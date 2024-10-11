import React, { useEffect, useState, useRef } from "react";
import { SectionWrapper } from "../hoc";
import useWebGPU from "./useWebGPU";
import useCanvasSize from "./useCanvasSize";
import Markdown from 'react-markdown';
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const blogPost =  `
# Implementing Photon Mapping with WebGPU: A Comprehensive Analysis

## Table of Contents

1. Introduction to Photon Mapping
2. Mathematical Foundations
3. WebGPU Setup
4. Shader Implementation
5. Computational Complexity Analysis
6. Memory Management in WebGPU
7. Comparison with the Original Photon Mapping Algorithm
8. Performance Considerations and Optimizations
9. Conclusion and Future Work
10. References

## 1. Introduction to Photon Mapping

Photon mapping is a global illumination technique introduced by Henrik Wann Jensen in 1996 [1]. It simulates the interaction of light with different surfaces to produce realistic lighting effects, including caustics, color bleeding, and soft shadows. Our implementation in WebGPU is a simplified version that demonstrates the core concepts while leveraging modern GPU capabilities.

## 2. Mathematical Foundations

### 2.1 Spherical Coordinate System

We use spherical coordinates to distribute photons uniformly on the sphere's surface. The transformation from spherical (r, θ, φ) to Cartesian (x, y, z) coordinates is given by:

$$
\\begin{align*}
x &= r \\sin(\\phi) \\cos(\\theta) \\\\
y &= r \\sin(\\phi) \\sin(\\theta) \\\\
z &= r \\cos(\\phi)
\\end{align*}
$$

Where r is the radius, θ is the azimuthal angle in the x-y plane from the x-axis (0 ≤ θ < 2π), and φ is the polar angle from the z-axis (0 ≤ φ ≤ π).

2.2 Ray-Sphere Intersection

The ray-sphere intersection is calculated by solving the quadratic equation:

$$(\\mathbf{p}(t) - \\mathbf{c}) \\cdot (\\mathbf{p}(t) - \\mathbf{c}) = r^2$$

Where $$\\mathbf{p}(t) = \\mathbf{o} + t\\mathbf{d}$$ is the ray equation, $$\\mathbf{o}$$ is the ray origin, $$\\mathbf{d}$$ is the ray direction, $$\\mathbf{c}$$ is the sphere center, and r is the sphere radius.

Expanding this equation gives us:

$$(\\mathbf{d} \\cdot \\mathbf{d})t^2 + 2(\\mathbf{d} \\cdot (\\mathbf{o} - \\mathbf{c}))t + ((\\mathbf{o} - \\mathbf{c}) \\cdot (\\mathbf{o} - \\mathbf{c}) - r^2) = 0$$

We solve this using the quadratic formula: $t = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

### 2.3 Photon Gathering and Rendering Equation

The rendering equation, introduced by Kajiya [2], forms the basis of our lighting calculation:

$$L_o(x,\\omega_o) = L_e(x,\\omega_o) + \\int_{\\Omega} f_r(x,\\omega_i,\\omega_o) L_i(x,\\omega_i) (\\omega_i \\cdot \\mathbf{n}) d\\omega_i$$

In our simplified version, we approximate this integral by summing the contributions of nearby photons:

$$L_o(x,\\omega_o) \\approx \\sum_{i=1}^N f_r(x,\\omega_i,\\omega_o) \\Phi_i K(\\|x - x_i\\|) (\\omega_i \\cdot \\mathbf{n})$$

Where $$\\Phi_i$$ is the photon power, K is a kernel function (in our case, inverse square falloff), and N is the number of photons.
## 3. WebGPU Setup

(WebGPU setup details...)

## 4. Shader Implementation

(Shader implementation details...)

## 5. Computational Complexity Analysis

### 5.1 Photon Distribution

The initial photon distribution has a time complexity of O(N), where N is the number of photons. This is a one-time cost performed on the CPU.

### 5.2 Rendering

The per-frame rendering complexity is O(P * N), where P is the number of pixels and N is the number of photons. This is because for each pixel (fragment), we potentially iterate through all photons.

In big-O notation, this is effectively O(N) per pixel, as P is constant for a given resolution. However, the constant factor (P) is significant in practice.

### 5.3 Ray-Sphere Intersection

The ray-sphere intersection test is O(1) for each pixel, as it involves solving a quadratic equation with a fixed number of operations.

## 6. Memory Management in WebGPU

### 6.1 Buffer Allocation

We allocate two main buffers:

1. Uniform Buffer: 5 * 4 bytes (vec3 position + vec2 rotation)
2. Photon Buffer: N * 4 * 4 bytes (N photons, each stored as vec4)

Total GPU memory usage: 20 + 16N bytes

### 6.2 Texture Memory

The render target texture uses width * height * 4 bytes (assuming 8-bit per channel RGBA).

### 6.3 Shader Storage

WebGPU manages shader storage separately. The WGSL code is compiled into GPU-specific bytecode, which is typically much smaller than the source code size.

## 7. Comparison with the Original Photon Mapping Algorithm

Our implementation differs from Jensen's original algorithm [1] in several key aspects:

1. Photon Tracing: We pre-compute a fixed distribution of photons on the sphere surface, whereas the original algorithm traces photons through the scene.

2. Photon Map: We don't build a spatial data structure (e.g., kd-tree) for efficient photon lookups. Instead, we brute-force search through all photons.

3. Gathering: Our gathering step is simplified, considering all photons rather than using a fixed radius or nearest-N search.

4. Caustics and Global Illumination: Our implementation doesn't handle advanced effects like caustics or multi-bounce global illumination.

## 8. Performance Considerations and Optimizations

### 8.1 GPU Parallelism

WebGPU and our shader design leverage GPU parallelism by processing each pixel independently. This is an embarrassingly parallel problem, well-suited for GPU computation.

### 8.2 Photon Lookup Optimization

To optimize photon lookup, we could implement a spatial data structure like a GPU-friendly BVH (Bounding Volume Hierarchy) or octree. This could reduce the per-pixel complexity from O(N) to O(log N) on average.

### 8.3 Deferred Shading

For more complex scenes, a deferred shading approach could be beneficial. This would separate the geometry pass from the lighting calculation, potentially reducing overdraw.

## 9. Conclusion and Future Work

Our WebGPU implementation demonstrates a simplified photon mapping technique. While it captures the essence of the algorithm, there are several avenues for improvement:

1. Implement dynamic photon tracing for more accurate global illumination.
2. Develop a GPU-based spatial data structure for efficient photon gathering.
3. Extend the model to support multiple objects and materials.
4. Implement progressive photon mapping for improved quality over time.
5. Explore hybrid techniques combining photon mapping with other global illumination methods.

## 10. References

[1] Jensen, H. W. (1996). Global Illumination using Photon Maps. Rendering Techniques '96, 21–30. https://doi.org/10.1007/978-3-7091-7484-5_3

[2] Kajiya, J. T. (1986). The rendering equation. SIGGRAPH Comput. Graph., 20(4), 143–150. https://doi.org/10.1145/15886.15902

[3] Pharr, M., Jakob, W., & Humphreys, G. (2016). Physically Based Rendering: From Theory to Implementation (3rd ed.). Morgan Kaufmann.

[4] Shirley, P., Marshner, S., et al. (2021). Fundamentals of Computer Graphics (5th ed.). A K Peters/CRC Press.

[5] GPU Gems 2: Programming Techniques for High-Performance Graphics and General-Purpose Computation. (2005). Addison-Wesley Professional.
`;

const Test = () => {
    const canvasRef = useRef(null);
    const canvasSize = useCanvasSize();
    const { adapter, device, canvas, context, format } = useWebGPU(canvasRef.current);
    
    const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
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
        const SPHERE_CENTER = vec3<f32>(0.0, 0.0, 5.0);
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

        function updateUniformBuffer() {
            const uniformData = new Float32Array([
                0, // timer (unused for now)
                cameraRotation.x,
                cameraRotation.y
            ]);
            device.queue.writeBuffer(uniformBuffer, 0, uniformData);
        }

        function frame() {
            updateUniformBuffer();

            renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
        
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
            renderPass.setPipeline(pipeline);
            renderPass.setBindGroup(0, uniformBindGroup);
            renderPass.draw(4, 1, 0, 0);
            renderPass.end();
            device.queue.submit([commandEncoder.finish()]);

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);

    }, [canvasSize, canvas, context, format, adapter, device, cameraRotation]);

    useEffect(() => {
        const handleMouseDown = (e) => {
            setIsDragging(true);
            setLastMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseMove = (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastMousePosition.x;
                const deltaY = e.clientY - lastMousePosition.y;
                setCameraRotation(prev => ({
                    x: prev.x + deltaY * 0.005,
                    y: prev.y + deltaX * 0.005
                }));
                setLastMousePosition({ x: e.clientX, y: e.clientY });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

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
    }, [canvas, isDragging, lastMousePosition]);

    return (
        <MathJaxContext>
            <div className="flex flex-col items-center">
                <div className="mb-8">
                    <canvas ref={canvasRef} width={800} height={450} tabIndex={0} /> 
                </div>
                <div className="max-w-4xl mx-auto px-4">
                    <MathJax>{blogPost}</MathJax>
                </div>
            </div>
        </MathJaxContext>
        
    );
};

export default SectionWrapper(Test, "test");