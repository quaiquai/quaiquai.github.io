struct Ray {
    origin: vec3<f32>,
    dir: vec3<f32>,
};

struct Hit {
    hit: bool,
    t: f32,
    position: vec3<f32>,
    normal: vec3<f32>,
};

struct Uniforms {
    resolution   : vec2<f32>,   // 8 bytes, but padded to 16
    frame        : u32,         // 4 bytes, padded to 16
    cameraPos    : vec3<f32>,   // 12 bytes, padded to 16
    cameraTarget : vec3<f32>,   // 12 bytes, padded to 16
    cameraUp     : vec3<f32>,   // 12 bytes, padded to 16
};
@group(0) @binding(0) var<uniform> uniforms : Uniforms;


const lightPosition = vec3<f32>(0.0, 1.0, 1.0);
const lightColor = vec3<f32>(1.0, 1.0, 1.0);
const lambertianPDF = 1.0/3.14;
const directionalLightDir = vec3f(0.0, -1.0, 0.0);

fn intersectSphere(ray: Ray, center: vec3<f32>, radius: f32, hitInfo: ptr<function, Hit>) -> bool{
    let oc = ray.origin - center;
    let a = dot(ray.dir, ray.dir);
    let b = 2.0 * dot(oc, ray.dir);
    let c = dot(oc, oc) - radius * radius;
    let discriminant = b*b - 4.0*a*c;

    if (discriminant < 0.0) {
        // (*hitInfo) = Hit(false, 1000000.0, vec3<f32>(0.0), vec3<f32>(0.0));
        return false;
    }

    let t = (-b - sqrt(discriminant)) / (2.0*a);
    if (t < 0.0) {
    //   (*hitInfo) = Hit(false, 100000.0, vec3<f32>(0.0), vec3<f32>(0.0));
        return false;
    }

    if (t > 0.0001 && t < (*hitInfo).t) {
        let pos = ray.origin + t * ray.dir;
        let normal = normalize(pos - center);
        (*hitInfo).t = t;
        (*hitInfo).position = pos;
        (*hitInfo).normal = normal;
        (*hitInfo).hit = true;
        // (*hitInfo) = Hit(true, t, pos, normal);
        return true;
    }

    return false;

}

fn scalarTriple(a: vec3<f32>, b: vec3<f32>, c: vec3<f32>) -> f32 {
    return dot(a, cross(b, c));
}

fn testQuadTrace(
    rayPos: vec3<f32>,
    rayDir: vec3<f32>,
    a_in: vec3<f32>,
    b_in: vec3<f32>,
    c_in: vec3<f32>,
    d_in: vec3<f32>,
    info: ptr<function, Hit>
) -> bool {
    var a = a_in;
    var b = b_in;
    var c = c_in;
    var d = d_in;

    // calculate normal and flip vertices order if needed
    var normal = normalize(cross(c - a, c - b));
    if (dot(normal, rayDir) > 0.0) {
        normal = -normal;

        var temp = d;
        d = a;
        a = temp;

        temp = b;
        b = c;
        c = temp;
    }

    let p = rayPos;
    let q = rayPos + rayDir;
    let pq = q - p;
    let pa = a - p;
    let pb = b - p;
    let pc = c - p;

    // determine which triangle to test against by testing against diagonal first
    let m = cross(pc, pq);
    var v = dot(pa, m);
    var intersectPos = vec3<f32>(0.0);

    if (v >= 0.0) {
        // test against triangle a,b,c
        var u = -dot(pb, m);
        if (u < 0.0) { return false; }
        var w = scalarTriple(pq, pb, pa);
        if (w < 0.0) { return false; }
        let denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;
        intersectPos = u * a + v * b + w * c;
    } else {
        let pd = d - p;
        var u = dot(pd, m);
        if (u < 0.0) { return false; }
        var w = scalarTriple(pq, pa, pd);
        if (w < 0.0) { return false; }
        v = -v;
        let denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;
        intersectPos = u * a + v * d + w * c;
    }

    var t: f32;
    if (abs(rayDir.x) > 0.1) {
        t = (intersectPos.x - rayPos.x) / rayDir.x;
    } else if (abs(rayDir.y) > 0.1) {
        t = (intersectPos.y - rayPos.y) / rayDir.y;
    } else {
        t = (intersectPos.z - rayPos.z) / rayDir.z;
    }

    if (t > 0.0001 && t < (*info).t) {
        (*info).t = t;
        (*info).normal = normal;
        (*info).hit = true;
        return true;
    }

    return false;
}

fn intersectSphereShadow(ray: Ray, center: vec3<f32>, radius: f32) -> bool {
    let oc = ray.origin - center;
    let a = dot(ray.dir, ray.dir);
    let b = 2.0 * dot(oc, ray.dir);
    let c = dot(oc, oc) - radius * radius;
    let discriminant = b*b - 4.0*a*c;

    if (discriminant < 0.0) {
        return false;
    }

    let t = (-b - sqrt(discriminant)) / (2.0*a);
    if (t < 0.0) {
        return false;
    }

    return true;

}

fn intersectQuad(rayPos: vec3f, rayDir: vec3f, a_in: vec3<f32>,
    b_in: vec3<f32>,
    c_in: vec3<f32>,
    d_in: vec3<f32>,)->bool{
    var a = a_in;
    var b = b_in;
    var c = c_in;
    var d = d_in;

    // calculate normal and flip vertices order if needed
    var normal = normalize(cross(c - a, c - b));
    if (dot(normal, rayDir) > 0.0) {
        normal = -normal;

        var temp = d;
        d = a;
        a = temp;

        temp = b;
        b = c;
        c = temp;
    }

    let p = rayPos;
    let q = rayPos + rayDir;
    let pq = q - p;
    let pa = a - p;
    let pb = b - p;
    let pc = c - p;

    // determine which triangle to test against by testing against diagonal first
    let m = cross(pc, pq);
    var v = dot(pa, m);
    var intersectPos = vec3<f32>(0.0);

    if (v >= 0.0) {
        // test against triangle a,b,c
        var u = -dot(pb, m);
        if (u < 0.0) { return false; }
        var w = scalarTriple(pq, pb, pa);
        if (w < 0.0) { return false; }
        let denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;
        intersectPos = u * a + v * b + w * c;
    } else {
        let pd = d - p;
        var u = dot(pd, m);
        if (u < 0.0) { return false; }
        var w = scalarTriple(pq, pa, pd);
        if (w < 0.0) { return false; }
        v = -v;
        let denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;
        intersectPos = u * a + v * d + w * c;
    }

    return true;
}

fn traceScene(ro: vec3f, rd: vec3f, hitInfo: ptr<function, Hit>){

    if(testQuadTrace(ro, rd, vec3f(-1.0, 1.0, 0.0), vec3f(-1.0, -1.0, 0.0), vec3f(1.0, -1.0, 0.0), vec3f(1.0, 1.0, 0.0), hitInfo)){
    }
    if(testQuadTrace(ro, rd, vec3f(-1.0, -1.0, 0.0), vec3f(-1.0, -1.0, 1.0), vec3f(1.0, -1.0, 1.0), vec3f(1.0, -1.0, 0.0), hitInfo)){
    }
    if(intersectSphere(Ray(ro, rd), vec3<f32>(0.0, -0.5, 0.25), 0.25, hitInfo)){
    }
    
}

fn traceIntersect(ro: vec3f, rd: vec3f){

}

//in shadow
fn getOcclution(ro: vec3f, lightPos: vec3f) -> bool{
    let lightDir = lightPos - ro;
    if(intersectSphereShadow(Ray(ro, lightDir), vec3<f32>(0.0, -0.5, 0.25), 0.25)){
        return true;
    }
    return false;
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
    let forward = normalize(uniforms.cameraTarget - uniforms.cameraPos);
    let right   = normalize(cross(forward, uniforms.cameraUp));
    let up      = cross(right, forward);

    var uv = (fragCoord.xy / uniforms.resolution) * 2.0 - vec2<f32>(1.0, 1.0);
    uv.x *= uniforms.resolution.x / uniforms.resolution.y;
    uv.y *= -1.0;

    let ro = uniforms.cameraPos;
    let rd = normalize(forward + uv.x * right + uv.y * up);

    var hitInfo = Hit(false, 100000.0, vec3<f32>(0.0), vec3<f32>(0.0));
    traceScene(ro, rd, &hitInfo);

    if (hitInfo.hit) {
        let rayPos = ro + rd * hitInfo.t;
        let distance = length(lightPosition - rayPos);
        let d2 = distance * distance;

        //shadow calc
        let occuld = getOcclution(rayPos, lightPosition);
        if (occuld) {
            return vec4<f32>(vec3f(0.0), 1.0);
        }

        let L = lightColor * 2.0 * max(0.0, dot(hitInfo.normal, normalize(lightPosition - rayPos))) / (3.14 * d2);
        return vec4<f32>(clamp(L, vec3f(0.0), vec3f(1.0)), 1.0);
    }
    return vec4<f32>(0.0, 0.0, 0.0, 1.0);
}