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
    let needsReset = false;
    let lastCameraState = null;

    if (!("gpu" in navigator)) {
      console.error("WebGPU not supported. Enable chrome://flags/#enable-unsafe-webgpu");
      return;
    }

    // Camera change detection
    function cameraChanged() {
      const camPos = getCameraPos();
      const currentState = JSON.stringify([camPos, target, up]);
      if (lastCameraState !== currentState) {
        lastCameraState = currentState;
        return true;
      }
      return false;
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

      // Uniform buffer
      const uniformBufferSize = 80;
      const uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      // Create sampler
      const sampler = device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
      });

      let texA = null, texB = null;
      let readTexture = null, writeTexture = null;

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
        
        // Initialize ping-pong
        readTexture = texA;
        writeTexture = texB;
        needsReset = true;
      }

      configureCanvas();
      window.addEventListener("resize", () => {
        configureCanvas();
        needsReset = true;
      });

      const layout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" }
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: "float" }
          },
          {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {}
          }
        ]
      });

      const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
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

      // Clear texture to black
      function clearTexture(texture) {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [{
            view: texture.createView(),
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
          }],
        });
        pass.end();
        device.queue.submit([encoder.finish()]);
      }

      let frameCount = 0;

      function frame() {
        if (stopped) return;

        // Reset accumulation if camera moved
        if (cameraChanged() || needsReset) {
          frameCount = 0;
          clearTexture(readTexture);
          clearTexture(writeTexture);
          needsReset = false;
        }

        frameCount++;
        const camPos = getCameraPos();

        const UniformsValues = new ArrayBuffer(80);
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

        device.queue.writeBuffer(uniformBuffer, 0, UniformsValues);

        // Create bind group with previous frame texture
        // const bindGroup = device.createBindGroup({
        //   layout: pipeline.getBindGroupLayout(0),
        //   entries: [
        //     { binding: 0, resource: { buffer: uniformBuffer } },
        //     { binding: 1, resource: readTexture.createView() },
        //     { binding: 2, resource: sampler }
        //   ],
        // });

        // // Render to write texture
        // const encoder = device.createCommandEncoder();
        // const pass = encoder.beginRenderPass({
        //   colorAttachments: [{
        //     view: writeTexture.createView(),
        //     loadOp: "clear",
        //     storeOp: "store",
        //     clearValue: { r: 0, g: 0, b: 0, a: 1 },
        //   }],
        // });

        // pass.setPipeline(pipeline);
        // pass.setVertexBuffer(0, quadBuffer);
        // pass.setBindGroup(0, bindGroup);
        // pass.draw(6, 1, 0, 0);
        // pass.end();

        // device.queue.submit([encoder.finish()]);

        // Copy accumulated result to canvas
        const copyEncoder = device.createCommandEncoder();
        const canvasView = context.getCurrentTexture().createView();
        const copyPass = copyEncoder.beginRenderPass({
          colorAttachments: [{
            view: canvasView,
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
          }],
        });

        // Simple copy bind group (just the accumulated texture)
        const copyBindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: writeTexture.createView() },
            { binding: 2, resource: sampler }
          ],
        });

        copyPass.setPipeline(pipeline);
        copyPass.setVertexBuffer(0, quadBuffer);
        copyPass.setBindGroup(0, copyBindGroup);
        copyPass.draw(6, 1, 0, 0);
        copyPass.end();

        device.queue.submit([copyEncoder.finish()]);

        // Swap ping-pong buffers
        const temp = readTexture;
        readTexture = writeTexture;
        writeTexture = temp;

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