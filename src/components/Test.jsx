import React, { useEffect, useState, useRef, useCallback  } from "react";
import ReactDOM from 'react-dom'
import { SectionWrapper } from "../hoc";
import {useWebGPU} from "./useWebGPU";
import useCanvasSize from "./useCanvasSize";
import Markdown from 'react-markdown';
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import PhotonMappingWriting from "../writings/PhotonMappingWriting";
import '../markdown.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const vertWGSL = `
        struct VSOut {
            @builtin(position) Position: vec4<f32>,
            @location(0)       uvs     : vec2<f32>
        };
        
        @vertex
        fn main(@builtin(vertex_index) VertexIndex : u32)  -> VSOut 
        {
            var s = 1.0; 
            var pos =  array<vec2<f32>, 4>( vec2<f32>( -s,  s ), 
                                            vec2<f32>( -s, -s ), 
                                            vec2<f32>(  s,  s ),
                                            vec2<f32>(  s, -s ));
        
            s = 1.0;
            var uvs =  array<vec2<f32>, 4>( vec2<f32>(  s,  s ), 
                                            vec2<f32>(  s, -s ), 
                                            vec2<f32>( -s,  s ),
                                            vec2<f32>( -s, -s ));
        
            var vsOut: VSOut;
            vsOut.Position = vec4<f32>(pos[ VertexIndex ], 0.0, 1.0);
            vsOut.uvs      = uvs[ VertexIndex ] * 0.5 + 0.5; // 0->1
            return vsOut;
        }
        `;

        const fragWGSL = `
        struct Uniforms {
            mytimer : f32,
            cameraRotationX : f32,
            cameraRotationY : f32,
        };

        @group(0) @binding(0) var<uniform> uniforms : Uniforms;

        const MAX_BOUNCES = 1u;
        const NUM_PHOTONS = 100u;
        const SPHERE_RADIUS = 2.0;
        const SPHERE_CENTER = vec3<f32>(0.0, 0.0, 0.0);
        const LIGHT_POSITION = vec3<f32>(5.0, 5.0, 0.0);

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
                v.x * cosY - v.z * sinY,
                v.y * cosX + (v.x * sinY + v.z * cosY) * sinX,
                v.y * -sinX + (v.x * sinY + v.z * cosY) * cosX
            );

            return rotated;
        }

        @fragment
        fn main(@location(0) coords : vec2<f32>) -> @location(0) vec4<f32> 
        {
            var uv = (coords * 2.0 - 1.0) * vec2<f32>(1.0, -1.0);
            var aspectRatio = 800.0 / 450.0;
            uv.y /= aspectRatio;

            let initialCameraPos = vec3<f32>(0.0, 0.0, -10.0);
            let cameraPos = rotateVector(initialCameraPos, uniforms.cameraRotationX, uniforms.cameraRotationY);
            let rayDir = normalize(rotateVector(vec3<f32>(uv, 1.0), uniforms.cameraRotationX, uniforms.cameraRotationY));

            let t = intersectSphere(cameraPos, rayDir);
            
            if (t > 0.0) {
                let hitPoint = cameraPos + rayDir * t;
                let normal = normalize(hitPoint - SPHERE_CENTER);
                
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

        const markdown = '# Hi, *Pluto* $$ \int_0^\infty e^{-x^2} dx $$!'

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
