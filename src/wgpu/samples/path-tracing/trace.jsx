// PathTraceSphere.js
import React, { useEffect, useRef } from "react";
import { useWebGPU } from "../../useWebGPU";
import useCanvasSize from "../../useCanvasSize";

import fragwgsl from "../../shaders/path-tracing/pathTracingFrag.wgsl?raw"
import vertwgsl from "../../shaders/path-tracing/pathTracingVert.wgsl?raw"

import {getCameraPos, onMouseDown, onMouseMove, onMouseUp, target, up} from "../../camera.js"

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

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

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


    async function init() {
      const vertShaderModule = device.createShaderModule({code: vertwgsl});
      const fragShaderModule = device.createShaderModule({code: fragwgsl});

      // Uniform buffer (16 bytes)
      const uniformBufferSize = 80;
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

      const layout = device.createBindGroupLayout({
        entries:[{
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {type: "uniform"}
        }]
      })

      const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({bindGroupLayouts: [layout]}),
        vertex: {
          module: vertShaderModule,
          entryPoint: "vs_main",
          buffers: [{
            arrayStride: 8,
            attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
          }],
        },
        fragment: {
          module: fragShaderModule,
          entryPoint: "fs_main",
          targets: [{ format }],
        },
        primitive: { topology: "triangle-list" },
      });

      let frameCount = 0;

      function frame() {
        if (stopped) return;
        frameCount++;
        const camPos = getCameraPos();

        const UniformsValues = new ArrayBuffer(64);
        const UniformsViews = {
            resolution: new Float32Array(UniformsValues, 0, 2),
            frame: new Uint32Array(UniformsValues, 8, 1),
            cameraPos: new Float32Array(UniformsValues, 16, 3),
            cameraTarget: new Float32Array(UniformsValues, 32, 3),
            cameraUp: new Float32Array(UniformsValues, 48, 3),
        };

        UniformsViews.resolution.set([canvas.width, canvas.height]);
        UniformsViews.frame.set([frameCount]);
        UniformsViews.cameraPos.set([camPos[0], camPos[1], camPos[2]]);
        UniformsViews.cameraTarget.set([target[0], target[1], target[2]]);
        UniformsViews.cameraUp.set([up[0], up[1], up[2]]);

        // Upload
        device.queue.writeBuffer(uniformBuffer, 0, UniformsValues);

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
        canvas.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
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
