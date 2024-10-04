import React, { useEffect, useState, useRef } from "react";
import { SectionWrapper } from "../hoc";
import useWebGPU from "./useWebGPU";
import useCanvasSize from "./useCanvasSize";


const Test = () => {

    const canvasRef = useRef(null)
    const canvasSize = useCanvasSize()
    const { adapter, device, canvas, context, format } = useWebGPU(canvasRef.current)
   
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
        `

        const fragWGSL = `
        /*
            basic ray-sphere intersection example
        */

        struct Uniforms {
        mytimer : f32
        };

        @group(0) @binding(0) var  <uniform> uniforms : Uniforms;

        fn wangHash(seed:u32) -> u32 {
            var rand:u32 = u32(seed ^ u32(61)) ^ u32(seed >> u32(16));
            rand *= u32(9);
            rand = rand ^ (rand >> 4);
            rand *= u32(0x27d4eb2d);
            rand = rand ^ (rand >> 15);
            return rand;
        }

        fn randomFloat01(state:u32) -> f32 {
            return f32(wangHash(state)) / 4294967296.0;
        }

        fn randomUnitVector(state:u32) -> vec3<f32> {
            let z = randomFloat01(state) * 2.0f - 1.0f;
            let a = randomFloat01(state) * 2.0f * 3.14f;
            let r = sqrt(1.0f - z * z);
            let x = r * cos(a);
            let y = r * sin(a);

            return vec3<f32>(x,y,z);
        }

        fn lineIntersectSphere( s:vec3<f32>, e:vec3<f32>, c:vec3<f32>, r:f32 ) -> bool
        {
            let tsc = length(s-c); //len( sub(s,c) );
            let tec = length(e-c); //len( sub(e,c) );
            if ( tsc<r && tec<r ) // inside sphere
            {
                return false; // both s and e inside sphere
            }
            // could check here if the ray is entering or leaving
            // sphere (if start of line is inside shere)

            let nse = normalize( e-s ); //norm( sub(e,s) );
            let vsc = (c-s); // sub(c,s);

            let to = dot( nse, vsc ); //dot( nse, vsc );
            let th = length(vsc); // len( vsc );
            let ta = sqrt( th*th - to*to );

            if ( ta > r ) // missed sphere
            {
                return false; // ray misses sphere
            }

            let tpa = sqrt( r*r - ta*ta );
            var t = to - tpa;

            if ( tsc < r ) // start inside the sphere
            {
                t = to + tpa;
            }

            let tse = length(e-s); //len( sub(e,s) ); 

            if ( t<0 || t >= tse ) // greater than length of line
            {
                return false;
            }

            let p = ( s + (nse * t ) ); // hit point

            let n = normalize( p - c ); // hit normal
            
            // optionally calculation 'peneration depth' = tse-t
            
            return true; // hit!!
        }


        @fragment
        fn main(@location(0) coords : vec2<f32>) -> @location(0) vec4<f32> 
        {
            // -1 to 1
            var uv    = (-1.0 + 2.0*coords.xy);
            uv = vec2<f32>(-uv.x, uv.y); //-1 on x axis on left side

            var aspectRatio = 800.0/450.0;
            uv.y = uv.y/aspectRatio;

            var rngState = u32(u32(uv.x) * u32(1973) + u32(uv.y) * u32(9277) + u32(uniforms.mytimer) * u32(26699));

            var cameraDistance = 1.0/tan(90.0 * 0.5 * 3.14/180.0);

            // ray origin
            var ro:vec3<f32> = vec3<f32>(0, 0, 0);
            // ray direction
            var rd:vec3<f32> = normalize( vec3<f32>( uv, cameraDistance ) - ro ); 
            // ray-end
            var re:vec3<f32> = ro + rd*1000.0;

                
            //initilize colors
            var hitColor:vec4<f32>  = vec4<f32>(.4,.7,.4,1.0); // hit
            var fragColor:vec4<f32> = vec4<f32>(1.0); // no-hit - white
            // var testcolor:vec4<f32> = vec4<f32>(uv, 0.0, 1.0);
            
            var spherePos    = vec3<f32>(0,0,5);
            var sphereRadius = 2.0;
            
            if ( lineIntersectSphere( ro, re, spherePos, sphereRadius ) )
            {
                fragColor = hitColor;
            }
                
            return fragColor;
        }
        `
        
        if (!canvas || !context || !adapter || !device) return

        let textureSampler = device.createSampler({
            minFilter: "linear",
            magFilter: "linear"
        });

        const timerUniformBuffer = device.createBuffer({
            size: 4, 
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const timestep  = new Float32Array( [3.14] );

        device.queue.writeBuffer(timerUniformBuffer, 0, timestep );

        const sceneUniformBindGroupLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer : { type: "uniform"    } }
            ]
        });

        const uniformBindGroup = device.createBindGroup({
            layout:   sceneUniformBindGroupLayout,
            entries: [
                { binding : 0, resource: { buffer: timerUniformBuffer} }
            ]
        });

        const canvsConfig = {
            device,
            format,
            alphaMode: 'opaque'
        }
        context.configure(canvsConfig)

        const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({bindGroupLayouts: [sceneUniformBindGroupLayout]}),
        vertex:   {  module    : device.createShaderModule({ 
                                    code : vertWGSL }),
                        entryPoint: 'main'
                    },
        fragment: {  module    : device.createShaderModule({ 
                                    code : fragWGSL,     }),
                        entryPoint: 'main',
                        targets: [{  format : navigator.gpu.getPreferredCanvasFormat()  }] },
        primitive: { topology  : 'triangle-strip',
                        frontFace : "ccw",
    //                 cullMode  : 'back',
                        stripIndexFormat: 'uint32' }
                        
        });

        // GPURenderPassDescriptor 
        const renderPassDescriptor = { 
            colorAttachments:  [{    
            view     : undefined, // asign later in frame
            loadOp:"clear", clearValue: { r: 0.0, g: 0.5, b: 0.5, a: 1.0 },
            storeOp  : 'store' }]
        };

        // const pass = encoder.beginRenderPass({
        //     colorAttachments: [{
        //       view: context.getCurrentTexture().createView(),
        //       loadOp: "clear",
        //       clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1 }, // New line
        //       storeOp: "store",
        //     }],
        //   });

        //   pass.setPipeline(cellPipeline);
        // pass.setVertexBuffer(0, vertexBuffer);
        // pass.draw(vertices.length / 2); // 6 vertices

        // pass.end();

        // const commandBuffer = encoder.finish();

        // device.queue.submit([commandBuffer]);

        timestep[0] += 0.01;
        device.queue.writeBuffer(timerUniformBuffer,   0, timestep );
        // -------
        renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
    
        const commandEncoder = device.createCommandEncoder();
    
        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.draw(4, 1, 0, 0);
    
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);

        
        
        
    }, [canvasSize, canvas, context, format, adapter, device])


    return (
        <div className="flex flex-wrap gap-10 justify-center">
            <canvas ref={canvasRef} width={800} height={450} tabIndex={0} /> 
        </div>
    )
    

}

export default SectionWrapper(Test, "test");
