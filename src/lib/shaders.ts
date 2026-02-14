
export const vertexShader = `#version 300 es
in vec2 position;
out vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragmentShader = `#version 300 es
precision mediump float;

in vec2 vUv;
out vec4 fragColor;

// --- Uniforms ---
uniform sampler2D u_image;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Config: Source
uniform bool u_use_image; 
uniform int u_gen_type; // 0: Spiral, 1: Noise, 2: Grid

// Config: Generator Params
uniform float u_gen_speed; 
uniform float u_gen_direction; // degrees
uniform float u_gen_scale;
uniform float u_gen_imp1; // octaves / threshold / warp

// Config: Dither
uniform float u_pixel_scale;
uniform int u_dither_method; // 0: Ordered, 1: Noise, 2: Lines, 3: Halftone
uniform float u_dither_amount; 
uniform float u_render_lines;  // freq for lines
uniform float u_render_weight; // thickness

// Config: Color & Effects
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_vignette;
uniform float u_glow;
uniform float u_warp;

// Palette
const int MAX_PALETTE_SIZE = 16;
uniform vec3 u_palette[MAX_PALETTE_SIZE];
uniform int u_palette_size;

// --- Helper Functions ---

#define PI 3.14159265359

// Simplex Noise (Start) - Simplified
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
// Simplex Noise (End)

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 findClosestColor(vec3 c) {
    float minDist = 1000.0;
    vec3 closest = c;
    for (int i = 0; i < MAX_PALETTE_SIZE; i++) {
        if (i >= u_palette_size) break;
        float dist = distance(c, u_palette[i]);
        if (dist < minDist) {
            minDist = dist;
            closest = u_palette[i];
        }
    }
    return closest;
}

// --- Generators ---

float genSpiral(vec2 uv) {
    vec2 center = vec2(0.5);
    vec2 pos = uv - center;
    float dist = length(pos);
    float angle = atan(pos.y, pos.x);
    float t = u_time * u_gen_speed; 
    float v = sin(dist * u_gen_scale + angle * u_gen_direction + t);
    return v * 0.5 + 0.5;
}

float genNoise(vec2 uv) {
    float t = u_time * u_gen_speed;
    float n = snoise(uv * u_gen_scale + vec2(t*0.1, t*0.05));
    if (n < u_gen_imp1 - 1.0) n = 0.0; // threshold logic
    return n * 0.5 + 0.5;
}

float genGrid(vec2 uv) {
    vec2 gridConfig = vec2(u_gen_scale);
    vec2 f = fract(uv * gridConfig + u_time * u_gen_speed * 0.1);
    return step(0.5, f.x) * step(0.5, f.y);
}

// --- Dither Patterns ---

const float bayer4x4[16] = float[](
    0.0/16.0, 8.0/16.0, 2.0/16.0, 10.0/16.0,
    12.0/16.0, 4.0/16.0, 14.0/16.0, 6.0/16.0,
    3.0/16.0, 11.0/16.0, 1.0/16.0, 9.0/16.0,
    15.0/16.0, 7.0/16.0, 13.0/16.0, 5.0/16.0
);

float getBayer(vec2 pixel) {
    int x = int(mod(pixel.x, 4.0));
    int y = int(mod(pixel.y, 4.0));
    return bayer4x4[y * 4 + x];
}

void main() {
  vec2 uv = vUv;

  // 1. Warp Effect
  if (u_warp > 0.0) {
      float n = snoise(uv * 3.0 + u_time * 0.2);
      vec2 offset = vec2(n, n) * u_warp * 0.05;
      uv += offset;
  }

  // 2. Pixelation Logic
  vec2 pixelSize = vec2(u_pixel_scale) / u_resolution;
  vec2 coord = floor(uv / pixelSize) * pixelSize + pixelSize * 0.5;
  
  // 3. Source Generation
  vec4 color = vec4(0.0);
  
  if (u_use_image) {
      color = texture(u_image, coord);
  } else {
      float pattern = 0.0;
      if (u_gen_type == 0) pattern = genSpiral(coord);
      else if (u_gen_type == 1) pattern = genNoise(coord);
      else if (u_gen_type == 2) pattern = genGrid(coord);
      color = vec4(vec3(pattern), 1.0);
  }

  // 4. Pre-process
  color.rgb += u_brightness;
  color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
  float gray = luma(color.rgb);
  color.rgb = mix(vec3(gray), color.rgb, u_saturation);

  // 5. Dithering
  vec2 ditherCoord = gl_FragCoord.xy / u_pixel_scale;
  float ditherVal = 0.0;
  
  if (u_dither_method == 0) {
      ditherVal = getBayer(ditherCoord) - 0.5;
  } else if (u_dither_method == 1) {
      ditherVal = fract(sin(dot(ditherCoord, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  } else if (u_dither_method == 2 || u_dither_method == 3) { // Lines / Halftone
      float angle = 0.785; // 45 deg
      vec2 rotated = vec2(
          ditherCoord.x * cos(angle) - ditherCoord.y * sin(angle),
          ditherCoord.x * sin(angle) + ditherCoord.y * cos(angle)
      );
      float linePattern = sin(rotated.y * u_render_lines * 0.5); 
      ditherVal = linePattern * 0.5; 
  }

  color.rgb += ditherVal * u_dither_amount;
  
  // 6. Quantize
  color.rgb = findClosestColor(color.rgb);

  // 7. Post-Process
  if (u_vignette > 0.0) {
      float dist = distance(vUv, vec2(0.5));
      color.rgb *= smoothstep(0.8, 0.8 - u_vignette * 0.8, dist);
  }
  
  if (u_glow > 0.0) {
      float b = luma(color.rgb);
      if (b > 0.7) color.rgb += u_glow * 0.3;
  }

  fragColor = vec4(color.rgb, 1.0);
}
`;
