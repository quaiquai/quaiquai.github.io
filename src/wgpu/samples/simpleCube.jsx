

import React, { useEffect, useRef } from "react";
import useDevice from "../useDevice";
import { useWebGPU } from "../useWebGPU";
import useCanvasSize from "../useCanvasSize";


export default function SpinningCube() {
    const canvasRef = useRef(null);
    const canvasSize = useCanvasSize();
    const { adapter, device, canvas, context, format } = useWebGPU(canvasRef.current);

    useEffect(() => {
        if (!canvas || !context || !adapter || !device) return;
        let stopped = false;
        let animationFrame = 0;
        let pipeline, uniformBuffer, uniformBindGroup, depthTex, depthView;
        let vertexBuffer, indexBuffer;
        let startTime = performance.now();

        

        if (!("gpu" in navigator)) {
            console.error("WebGPU not supported. Enable chrome://flags/#enable-unsafe-webgpu");
            return;
        }

        const mat4 = {
            identity() {
                return new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,
                ]);
            },
            multiply(a, b) {
                const out = new Float32Array(16);
                for (let i = 0; i < 4; i++) {
                    const ai0 = a[i], ai1 = a[i + 4], ai2 = a[i + 8], ai3 = a[i + 12];
                    out[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                    out[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                    out[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                    out[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
                }
                return out;
            },
            perspective(fovy, aspect, near, far) {
                const f = 1.0 / Math.tan(fovy / 2);
                const nf = 1 / (near - far);
                const out = new Float32Array(16);
                out[0] = f / aspect;
                out[5] = f;
                out[10] = (far + near) * nf;
                out[11] = -1;
                out[14] = 2 * far * near * nf;
                return out;
            },
            translate(tx, ty, tz) {
                const out = mat4.identity();
                out[12] = tx; out[13] = ty; out[14] = tz;
                return out;
            },
            rotateX(rad) {
                const c = Math.cos(rad), s = Math.sin(rad);
                const out = mat4.identity();
                out[5] = c; out[6] = s; out[9] = -s; out[10] = c;
                return out;
            },
            rotateY(rad) {
                const c = Math.cos(rad), s = Math.sin(rad);
                const out = mat4.identity();
                out[0] = c; out[2] = -s; out[8] = s; out[10] = c;
                return out;
            },
            lookAt(eye, center, up) {
                const [ex, ey, ez] = eye;
                const [cx, cy, cz] = center;
                const [ux, uy, uz] = up;

                let zx = ex - cx, zy = ey - cy, zz = ez - cz;
                const zlen = Math.hypot(zx, zy, zz) || 1;
                zx /= zlen; zy /= zlen; zz /= zlen;

                let xx = uy * zz - uz * zy;
                let xy = uz * zx - ux * zz;
                let xz = ux * zy - uy * zx;
                const xlen = Math.hypot(xx, xy, xz) || 1;
                xx /= xlen; xy /= xlen; xz /= xlen;

                const yx = zy * xz - zz * xy;
                const yy = zz * xx - zx * xz;
                const yz = zx * xy - zy * xx;

                const out = new Float32Array(16);
                out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
                out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
                out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
                out[12] = -(xx * ex + xy * ey + xz * ez);
                out[13] = -(yx * ex + yy * ey + yz * ez);
                out[14] = -(zx * ex + zy * ey + zz * ez);
                out[15] = 1;
                return out;
            },
        };

        const vertWGSL = /* wgsl */`
      struct Uniforms {
        mvp : mat4x4<f32>,
      };
      @group(0) @binding(0) var<uniform> uniforms : Uniforms;

      struct VSOut {
        @builtin(position) position : vec4<f32>,
        @location(0) vColor : vec3<f32>,
      };

      @vertex
      fn main(
        @location(0) position : vec3<f32>,
        @location(1) color    : vec3<f32>
      ) -> VSOut {
        var out : VSOut;
        out.position = uniforms.mvp * vec4<f32>(position, 1.0);
        out.vColor = color;
        return out;
      }
    `;

        const fragWGSL = /* wgsl */`
      @fragment
      fn main(@location(0) vColor : vec3<f32>) -> @location(0) vec4<f32> {
        return vec4<f32>(vColor, 1.0);
      }
    `;

        const cubeData = () => {
            // Interleaved position (x,y,z) and color (r,g,b)
            const r = 1, g = 1, b = 1;
            const vertices = new Float32Array([
                // x, y, z,   r, g, b
                // Front
                -1, -1, 1, 1, 0, 0,
                1, -1, 1, 0, 1, 0,
                1, 1, 1, 0, 0, 1,
                -1, 1, 1, 1, 1, 0,
                // Back
                -1, -1, -1, 1, 0, 1,
                1, -1, -1, 0, 1, 1,
                1, 1, -1, 1, 1, 1,
                -1, 1, -1, 0.2, 0.7, 1,
            ]);

            const indices = new Uint16Array([
                // Front
                0, 1, 2, 0, 2, 3,
                // Right
                1, 5, 6, 1, 6, 2,
                // Back
                5, 4, 7, 5, 7, 6,
                // Left
                4, 0, 3, 4, 3, 7,
                // Top
                3, 2, 6, 3, 6, 7,
                // Bottom
                4, 5, 1, 4, 1, 0,
            ]);

            return { vertices, indices, stride: 6 * 4 };
        };

        async function init() {
        
            function configureCanvas() {
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const width = Math.floor(canvas.clientWidth * dpr);
                const height = Math.floor(canvas.clientHeight * dpr);
                canvas.width = width;
                canvas.height = height;
                context.configure({
                    device,
                    format,
                    alphaMode: "opaque",
                });
                depthTex = device.createTexture({
                    size: { width, height },
                    format: "depth24plus",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT,
                });
                depthView = depthTex.createView();
            }

            configureCanvas();
            window.addEventListener("resize", configureCanvas);

            const shaderModuleVS = device.createShaderModule({ code: vertWGSL });
            const shaderModuleFS = device.createShaderModule({ code: fragWGSL });

            const { vertices, indices, stride } = cubeData();

            vertexBuffer = device.createBuffer({
                size: vertices.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true,
            });
            new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
            vertexBuffer.unmap();

            indexBuffer = device.createBuffer({
                size: indices.byteLength,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true,
            });
            new Uint16Array(indexBuffer.getMappedRange()).set(indices);
            indexBuffer.unmap();

            uniformBuffer = device.createBuffer({
                size: 64, // mat4x4<f32> = 16 * 4 bytes
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            pipeline = device.createRenderPipeline({
                layout: "auto",
                vertex: {
                    module: shaderModuleVS,
                    entryPoint: "main",
                    buffers: [
                        {
                            arrayStride: stride,
                            attributes: [
                                { shaderLocation: 0, format: "float32x3", offset: 0 },       // position
                                { shaderLocation: 1, format: "float32x3", offset: 12 },      // color
                            ],
                        },
                    ],
                },
                fragment: {
                    module: shaderModuleFS,
                    entryPoint: "main",
                    targets: [{ format }],
                },
                primitive: {
                    topology: "triangle-list",
                    cullMode: "back",
                    frontFace: "ccw",
                },
                depthStencil: {
                    format: "depth24plus",
                    depthWriteEnabled: true,
                    depthCompare: "less",
                },
            });

            const bindGroupLayout = pipeline.getBindGroupLayout(0);
            uniformBindGroup = device.createBindGroup({
                layout: bindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: uniformBuffer } },
                ],
            });

            function frame() {
                if (stopped) return;

                const t = (performance.now() - startTime) * 0.001;
                const aspect = canvas.width / canvas.height;

                const proj = mat4.perspective((60 * Math.PI) / 180, aspect, 0.1, 100.0);
                const view = mat4.lookAt([0, 0, 6], [0, 0, 0], [0, 1, 0]);
                const rotY = mat4.rotateY(t * 0.9);
                const rotX = mat4.rotateX(t * 0.5);
                const model = mat4.multiply(rotY, rotX);

                const vp = mat4.multiply(proj, view);
                const mvp = mat4.multiply(vp, model);

                device.queue.writeBuffer(uniformBuffer, 0, mvp.buffer, mvp.byteOffset, mvp.byteLength);

                const colorView = context.getCurrentTexture().createView();
                const encoder = device.createCommandEncoder();
                const pass = encoder.beginRenderPass({
                    colorAttachments: [{
                        view: colorView,
                        clearValue: { r: 0.043, g: 0.055, b: 0.086, a: 1 },
                        loadOp: "clear",
                        storeOp: "store",
                    }],
                    depthStencilAttachment: {
                        view: depthView,
                        depthClearValue: 1.0,
                        depthLoadOp: "clear",
                        depthStoreOp: "store",
                    },
                });

                pass.setPipeline(pipeline);
                pass.setBindGroup(0, uniformBindGroup);
                pass.setVertexBuffer(0, vertexBuffer);
                pass.setIndexBuffer(indexBuffer, "uint16");
                pass.drawIndexed(36, 1, 0, 0, 0);
                pass.end();

                device.queue.submit([encoder.finish()]);
                animationFrame = requestAnimationFrame(frame);
            }

            frame();

            return () => {
                stopped = true;
                cancelAnimationFrame(animationFrame);
                window.removeEventListener("resize", configureCanvas);
                // WebGPU resources are GC'd when no longer referenced, but explicit .destroy() on textures is fine:
                try { depthTex?.destroy?.(); } catch { }
            };
        }

        init();

        return () => {
            stopped = true;
            cancelAnimationFrame(animationFrame);
        };
    }, [canvas, context, adapter, device, format]);

    // Style with CSS or Tailwind if you like; inline here for a complete single-file demo.
    return (
        <div style={{ display: "grid", placeItems: "center", width: "100%", height: "100vh", background: "#0b0e16" }}>
            <canvas ref={canvasRef} style={{ width: 800, height: 600, borderRadius: 12, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.97)" }} />
        </div>
    );
}