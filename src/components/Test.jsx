import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from 'react-dom'
import { SectionWrapper } from "../hoc";
import { useWebGPU } from "./useWebGPU";
import useCanvasSize from "./useCanvasSize";
import Markdown from 'react-markdown';
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import PhotonMappingWriting from "../../public/writings/PhotonMappingWriting";
import '../markdown.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import vertWGSL from "../shaders/PhotonMappingVert";
import fragWGSL from "../shaders/PhotonMappingFrag";

const Test = () => {
    const canvasRef = useRef(null);
    const canvasSize = useCanvasSize();
    const { adapter, device, canvas, context, format } = useWebGPU(canvasRef.current);

    const cameraRotationRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const lastMousePositionRef = useRef({ x: 0, y: 0 });

    const [isInitialized, setIsInitialized] = useState(false);

    function tokenizeByHash(str) {
        return str.split(/(#+)/); // Split by one or more # characters
    }

    let tokens = console.log(tokenizeByHash(PhotonMappingWriting))
    console.log(tokens)

    const [count, setCount] = useState(0);
    useEffect(() => {
        // This effect will only run when 'count' changes
        console.log('The count has changed:', count);
    }, [count]);

    const webGPUContextRef = useRef({
        pipeline: null,
        uniformBuffer: null,
        uniformBindGroup: null,
        renderPassDescriptor: null,
    });

    const initializeWebGPU = useCallback(() => {
        if (!canvas || !context || !adapter || !device) return;

        const uniformBufferSize = 4 * 3; // float32 x 3
        const uniformBuffer = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const uniformBindGroupLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } }
            ]
        });

        const uniformBindGroup = device.createBindGroup({
            layout: uniformBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: uniformBuffer } }
            ]
        });

        const canvasConfig = {
            device,
            format,
            alphaMode: 'opaque'
        };
        context.configure(canvasConfig);

        const pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBindGroupLayout] }),
            vertex: {
                module: device.createShaderModule({ code: vertWGSL }),
                entryPoint: 'main'
            },
            fragment: {
                module: device.createShaderModule({ code: fragWGSL }),
                entryPoint: 'main',
                targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
            },
            primitive: {
                topology: 'triangle-strip',
                frontFace: "ccw",
                stripIndexFormat: 'uint32'
            }
        });

        const renderPassDescriptor = {
            colorAttachments: [{
                view: undefined,
                loadOp: "clear",
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                storeOp: 'store'
            }]
        };

        webGPUContextRef.current = {
            pipeline,
            uniformBuffer,
            uniformBindGroup,
            renderPassDescriptor,
        };

        setIsInitialized(true);
    }, [canvas, context, adapter, device, format]);

    const updateUniformBuffer = useCallback(() => {
        const { uniformBuffer } = webGPUContextRef.current;
        const { x, y } = cameraRotationRef.current;
        const uniformData = new Float32Array([0, x, y]);
        device.queue.writeBuffer(uniformBuffer, 0, uniformData);
    }, [device]);

    const render = useCallback(() => {
        if (!isInitialized) return;

        const { pipeline, uniformBindGroup, renderPassDescriptor } = webGPUContextRef.current;

        updateUniformBuffer();

        renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();

        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.draw(4, 1, 0, 0);
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);

    }, [context, device, isInitialized, updateUniformBuffer]);

    const animationFrameRef = useRef();

    const animate = useCallback(() => {
        render();
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [render]);

    useEffect(() => {
        initializeWebGPU();
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [initializeWebGPU]);

    useEffect(() => {
        if (isInitialized) {
            animate();
        }
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isInitialized, animate]);

    const handleMouseDown = useCallback((e) => {
        isDraggingRef.current = true;
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDraggingRef.current) return;

        const deltaX = e.clientX - lastMousePositionRef.current.x;
        const deltaY = e.clientY - lastMousePositionRef.current.y;

        cameraRotationRef.current = {
            x: cameraRotationRef.current.x + deltaY * 0.005,
            y: cameraRotationRef.current.y + deltaX * 0.005
        };

        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;
    }, []);

    useEffect(() => {
        if (canvas) {
            canvas.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);

    return (
        <div>
            <MathJaxContext>

                <div className="flex flex-col items-center">
                    <div className="mb-8">
                        <canvas ref={canvasRef} width={800} height={450} tabIndex={0} />
                    </div>

                    <button onClick={() => setCount(count + 1)}>Increment</button>
                </div>
                <Markdown className="markdown" >{PhotonMappingWriting}</Markdown >
            </MathJaxContext>

        </div>
    );
};

export default SectionWrapper(Test, "test");
