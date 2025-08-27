struct Uniforms {
    resolution   : vec2<f32>,   // 8 bytes, but padded to 16
    frame        : u32,         // 4 bytes, padded to 16
    cameraPos    : vec3<f32>,   // 12 bytes, padded to 16
    cameraTarget : vec3<f32>,   // 12 bytes, padded to 16
    cameraUp     : vec3<f32>,   // 12 bytes, padded to 16
};
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

@vertex
fn vs_main(@location(0) pos : vec2<f32>) -> @builtin(position) vec4<f32> {
    // Touch uniforms so the binding isn’t stripped (optional, fragment also uses it)
    let _dummy = uniforms.frame;
    return vec4<f32>(pos, 0.0, 1.0);
}