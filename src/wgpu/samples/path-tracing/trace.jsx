// PathTraceSphere.js
import React, { useEffect, useRef } from "react";
import { useWebGPU } from "../../useWebGPU";
import useCanvasSize from "../../useCanvasSize";

export default function PathTraceSphere() {
  const canvasRef = useRef(null);
  const canvasSize = useCanvasSize();
  const { adapter, device, canvas, context, format } = useWebGPU(canvasRef.current);

  useEffect(() => {
    if (!canvas || !context || !device || !format) return;
    let stopped = false;
    let animationFrame = 0;

    if (!("gpu" in navigator)) {
      console.error("WebGPU not supported. Enable chrome://flags/#enable-unsafe-webgpu");
      return;
    }

    // Fullscreen quad vertices (clip space)
    const quadVerts = new Float32Array([
      -1, -1,  1, -1,  -1,  1,
      -1,  1,  1, -1,   1,  1,
    ]);
    const quadBuffer = device.createBuffer({
      size: quadVerts.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(quadBuffer.getMappedRange()).set(quadVerts);
    quadBuffer.unmap();

    const shaderWGSL = /* wgsl */`
      struct Uniforms {
        resolution : vec2<f32>,
        frame      : u32,
        _pad       : u32,   // keep 16-byte alignment
      };
      @group(0) @binding(0) var<uniform> uniforms : Uniforms;

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

      @vertex
      fn vs_main(@location(0) pos : vec2<f32>) -> @builtin(position) vec4<f32> {
        // Touch uniforms so the binding isn’t stripped (optional, fragment also uses it)
        let _dummy = uniforms.frame;
        return vec4<f32>(pos, 0.0, 1.0);
      }

      const lightPosition = vec3<f32>(0.0, 3.0, 2.0);
      const lightColor = vec3<f32>(0.9, 0.9, 0.8);
      const lambertianPDF = 1.0/3.14;

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

        fn traceScene(ro: vec3f, rd: vec3f, hitInfo: ptr<function, Hit>){

            if(testQuadTrace(ro, rd, vec3f(-1.0, 1.0, 0.0), vec3f(-1.0, -1.0, 0.0), vec3f(1.0, -1.0, 0.0), vec3f(1.0, 1.0, 0.0), hitInfo)){
            }
            if(testQuadTrace(ro, rd, vec3f(-1.0, -1.0, 0.0), vec3f(-1.0, -1.0, 1.0), vec3f(1.0, -1.0, 1.0), vec3f(1.0, -1.0, 0.0), hitInfo)){
            }
            if(intersectSphere(Ray(ro, rd), vec3<f32>(0.0, -0.5, 0.25), 0.25, hitInfo)){
            }
            
        }

      @fragment
      fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
        let res = uniforms.resolution;                 // USE the uniforms -> keeps binding
        var uv = (fragCoord.xy / res) * 2.0 - vec2<f32>(1.0, 1.0);
        uv.x *= res.x / res.y;
        uv.y *= -1.0;

        let ro = vec3<f32>(0.0, 0.5, 5.0);
        let rd = normalize(vec3<f32>(uv, -1.5));
        var hitInfo = Hit(false, 100000.0, vec3<f32>(0.0), vec3<f32>(0.0));
        traceScene(ro, rd, &hitInfo);
        if (hitInfo.hit) {
            let rayPos = ro + rd * hitInfo.t;
            let L = max(0.0, dot(normalize(lightPosition - rayPos), hitInfo.normal )) * lightColor * lambertianPDF;
            // visualize normal for now (you can switch to solid red if you want)
            // return vec4<f32>(hitInfo.normal * 0.5 + 0.5, 1.0);
            return vec4<f32>(L, 1.0);
        }
        return vec4<f32>(0.0, 0.0, 0.0, 1.0);
      }
    `;

    async function init() {
      const shaderModule = device.createShaderModule({ code: shaderWGSL });

      // Uniform buffer (16 bytes)
      const uniformBufferSize = 16;
      const uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      // Configure canvas & prep ping-pong textures
      let texA = null, texB = null;

      function createAccumTex() {
        return device.createTexture({
          size: { width: canvas.width, height: canvas.height },
          format,
          usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });
      }

      function configureCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(canvas.clientWidth * dpr);
        canvas.height = Math.floor(canvas.clientHeight * dpr);

        context.configure({
          device,
          format,
          alphaMode: "opaque",
        });

        texA?.destroy?.();
        texB?.destroy?.();
        texA = createAccumTex();
        texB = createAccumTex();
      }

      configureCanvas();
      window.addEventListener("resize", configureCanvas);

      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: {
          module: shaderModule,
          entryPoint: "vs_main",
          buffers: [{
            arrayStride: 8,
            attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
          }],
        },
        fragment: {
          module: shaderModule,
          entryPoint: "fs_main",
          targets: [{ format }],
        },
        primitive: { topology: "triangle-list" },
      });

      let frameCount = 0;

      function frame() {
        if (stopped) return;
        frameCount++;

        // resolution (x,y), frame, pad
        device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([canvas.width, canvas.height]));
        device.queue.writeBuffer(uniformBuffer, 8, new Uint32Array([frameCount]));
        device.queue.writeBuffer(uniformBuffer, 12, new Uint32Array([0]));

        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });

        const encoder = device.createCommandEncoder();
        const view = context.getCurrentTexture().createView();

        const pass = encoder.beginRenderPass({
          colorAttachments: [{
            view,
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
          }],
        });

        pass.setPipeline(pipeline);
        pass.setVertexBuffer(0, quadBuffer);
        pass.setBindGroup(0, bindGroup);
        pass.draw(6, 1, 0, 0);
        pass.end();

        device.queue.submit([encoder.finish()]);

        // swap ping-pong (not used yet)
        const tmp = texA; texA = texB; texB = tmp;

        animationFrame = requestAnimationFrame(frame);
      }

      frame();

      return () => {
        window.removeEventListener("resize", configureCanvas);
        texA?.destroy?.();
        texB?.destroy?.();
      };
    }

    let cleanup = () => {};
    init().then(fn => {
      if (typeof fn === "function") cleanup = fn;
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(animationFrame);
      cleanup?.();
    };
  }, [canvas, context, adapter, device, format, canvasSize.width, canvasSize.height]);

  return (
    <div style={{ width: "100%", height: "100vh", background: "#000" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
