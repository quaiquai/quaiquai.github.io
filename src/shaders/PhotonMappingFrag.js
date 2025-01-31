const fragWGSL = `
    struct Uniforms {
        mytimer : f32,
        cameraRotationX : f32,
        cameraRotationY : f32,
    };

    @group(0) @binding(0) var<uniform> uniforms : Uniforms;

    const MAX_BOUNCES = 1u;
    const NUM_PHOTONS = 100u;
    const SPHERE_RADIUS = 4.0;
    const SPHERE_CENTER = vec3<f32>(0.0, 0.0, -4.0);
    const LIGHT_POSITION = vec3<f32>(5.0, -50.0, 0.0);

    fn randomFloat(seed: u32) -> f32 {
        return fract(sin(f32(seed) * 78.233) * 43758.5453);
    }

    fn randomVector(seed: u32) -> vec3<f32> {
        return normalize(vec3<f32>(
            randomFloat(seed * 1u),
            randomFloat(seed * 2u),
            randomFloat(seed * 3u)
        ) * 2.0 - 1.0);
    }

    const lut = vec4<u32>(1,2,0,1);

    fn is_point_in_triangle(p: vec3<f32>, v0: vec3<f32>, v1: vec3<f32>, v2: vec3<f32>) -> bool {
        let epsilon: f32 = 1e-6;
        let u = v1 - v0;
        let v = v2 - v0;
        let w = p - v0;

        let uu = dot(u, u);
        let uv = dot(u, v);
        let vv = dot(v, v);
        let wu = dot(w, u);
        let wv = dot(w, v);

        let denom = uv * uv - uu * vv;
        if abs(denom) < epsilon {
            return false; // Degenerate triangle
        }

        let s = (uv * wv - vv * wu) / denom;
        let t = (uv * wu - uu * wv) / denom;

        return s >= 0.0 && t >= 0.0 && (s + t) <= 1.0;
    }

    fn intersectRect(rayOrigin: vec3<f32>, rayDir: vec3<f32>, v0: vec3<f32>, v1: vec3<f32>, v2: vec3<f32>, v3: vec3<f32>) -> f32 {
        // Epsilon for numerical stability
        let epsilon: f32 = 1e-6;

        // Compute the normal of the quad plane
        let edge1 = v1 - v0;
        let edge2 = v3 - v0;
        let normal = cross(edge1, edge2);

        // Check if the ray and the plane are parallel
        let n_dot_dir = dot(normal, rayDir);
        if abs(n_dot_dir) < epsilon {
            return -1.0; // No intersection
        }

        // Compute the intersection point with the plane
        let d = dot(normal, v0);
        let t = (d - dot(normal, rayOrigin)) / n_dot_dir;

        if t < 0.0 {
            return -1.0; // Intersection is behind the ray origin
        }

        let p = rayOrigin + t * rayDir;

        // Check if the point is inside the quad using barycentric coordinates
        

        // Check if point p lies within either triangle of the quad
        if is_point_in_triangle(p, v0, v1, v3) || is_point_in_triangle(p, v1, v2, v3) {
            return t;
        }

        return -1.0; // No intersection
    }

    fn intersectSphere(rayOrigin: vec3<f32>, rayDir: vec3<f32>) -> f32 {
        let oc = rayOrigin - SPHERE_CENTER;
        let a = dot(rayDir, rayDir);
        let b = 2.0 * dot(oc, rayDir);
        let c = dot(oc, oc) - SPHERE_RADIUS * SPHERE_RADIUS;
        let discriminant = b * b - 4.0 * a * c;
        
        if (discriminant < 0.0) {
            return -1.0;
        } else {
            return (-b - sqrt(discriminant)) / (2.0 * a);
        }
    }

    fn generatePhotons() -> array<vec3<f32>, NUM_PHOTONS> {
        var photons: array<vec3<f32>, NUM_PHOTONS>;
        
        for (var i = 0u; i < NUM_PHOTONS; i++) {
            var photonOrigin = LIGHT_POSITION;
            var photonDir = normalize(SPHERE_CENTER - LIGHT_POSITION + randomVector(i) * 0.5);
            
            for (var bounce = 0u; bounce < MAX_BOUNCES; bounce++) {
                let t = intersectSphere(photonOrigin, photonDir);
                if (t > 0.0) {
                    let hitPoint = photonOrigin + photonDir * t;
                    photons[i] = hitPoint;
                    
                    let normal = normalize(hitPoint - SPHERE_CENTER);
                    photonDir = normalize(randomVector(i * (bounce + 1u) + 1u) + normal);
                    photonOrigin = hitPoint + normal * 0.001;
                } else {
                    break;
                }
            }
        }
        
        return photons;
    }

    fn rotateVector(v: vec3<f32>, angleX: f32, angleY: f32) -> vec3<f32> {
        let cosX = cos(angleX);
        let sinX = sin(angleX);
        let cosY = cos(angleY);
        let sinY = sin(angleY);

        var rotated = vec3<f32>(
            v.x * cos(angleY) * cos(angleX),
            v.y * sin(angleX),
            v.z * sin(angleY) * cos(angleX)
        );

        return rotated;
    }


    @fragment
    fn main(@location(0) coords : vec2<f32>) -> @location(0) vec4<f32> 
    {
        var uv = (coords * 2.0 - 1.0) * vec2<f32>(1.0, -1.0);
        var aspectRatio = 800.0 / 450.0;
        uv.y /= aspectRatio;

        let initialCameraPos = vec3<f32>(0.0, 0.0, 1.0);
        var cameraDistance = tan(10.0 * 0.5 * 3.14 / 180.0);
        
        var rayDir = vec3<f32>(uv, cameraDistance);
        rayDir = normalize(mat3x3f(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 1.0, 0.0), vec3f(0.0, 0.0, -1.0)) * rayDir);
        // let rayDir = normalize(rotateVector(vec3<f32>(uv, 1.0), uniforms.cameraRotationX, uniforms.cameraRotationY));
        // let cameraPos = rotateVector(initialCameraPos, uniforms.cameraRotationX, uniforms.cameraRotationY);
        var t = intersectSphere(initialCameraPos, rayDir);
        var q = intersectRect(rayDir, initialCameraPos, vec3<f32>(-1.0, 0.0, 1.0),  vec3<f32>(-1.0, 0.0, -10.0),  vec3<f32>(1.0, 0.0, -10.0),  vec3<f32>(1.0, 0.0, 1.0));
        var object = 1.0;
        if(q < t && q >= 0.0){
            t = q;
            object = 0.0;
        }

        if (t > 0.0) {
            let hitPoint = initialCameraPos + rayDir * t;
            var normal = normalize(hitPoint - SPHERE_CENTER);
            if(object == 0.0){
                let x = vec3<f32>(0.0, 1.0, 0.0);
                var normal = normalize(x);
            }
            
            let photons = generatePhotons();
            
            var illumination = 0.0;
            for (var i = 0u; i < NUM_PHOTONS; i++) {
                let photonDir = normalize(photons[i] - hitPoint);
                let distanceToPhoton = distance(photons[i], hitPoint);
                illumination += max(dot(normal, photonDir), 0.0) / (distanceToPhoton * distanceToPhoton);
            }
            
            illumination /= f32(NUM_PHOTONS);
            illumination = clamp(illumination * 5.0, 0.0, 1.0);
            
            let lightDir = normalize(LIGHT_POSITION - hitPoint);
            let directIllumination = max(dot(normal, lightDir), 0.0);
            
            let finalColor = vec3<f32>(1.0, 0.9, 0.7) * (illumination + directIllumination * 0.5);
            return vec4<f32>(finalColor, 1.0);
        } else {
            return vec4<f32>(0.1, 0.1, 0.1, 1.0);
        }
    }
    `;

export default fragWGSL;