export const HEAT_HAZE_VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const BOTTOM_HEAT_HAZE_FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;

  vec3 rainbow(float t) {
    return 0.58 + 0.42 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + t));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.05;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 smokeUv = uv * vec2(4.2, 2.25);
    smokeUv.x += sin(uv.y * 8.0 + u_time * 1.55) * 0.28;
    smokeUv.x += sin(uv.y * 15.0 - u_time * 1.2) * 0.12;
    smokeUv.y -= u_time * 0.42;

    float softNoise = fbm(smokeUv + vec2(u_time * 0.18, 0.0));
    float detailNoise = fbm(smokeUv * 2.8 - vec2(u_time * 0.28, u_time * 0.12));
    float plumes = sin(uv.x * 13.0 + softNoise * 7.2 + u_time * 1.45) * 0.5 + 0.5;
    float heightNoise = fbm(vec2(uv.x * 5.0 + u_time * 0.24, u_time * 0.18));
    float heightLimit = 0.42 + heightNoise * 0.48 + plumes * 0.18;
    float irregularTop = smoothstep(heightLimit, heightLimit - 0.28, uv.y);
    float bottomWeight = smoothstep(1.0, 0.06, uv.y);
    float verticalFade = pow(1.0 - uv.y, 1.45);
    float smokeShape = smoothstep(0.12, 0.68, verticalFade + softNoise * 0.52 + plumes * 0.24 - uv.y * 0.28);
    float wisps = smoothstep(0.32, 0.86, detailNoise + plumes * 0.2) * bottomWeight;
    vec3 color = rainbow(uv.x * 0.72 + u_time * 0.045 + softNoise * 0.12);
    float alpha = (smokeShape * 0.78 + wisps * 0.42) * verticalFade * irregularTop;
    alpha += (1.0 - smoothstep(0.0, 0.2, uv.y)) * 0.36;

    gl_FragColor = vec4(color, min(alpha, 0.96));
  }
`;

export const MENU_HEAT_HAZE_FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_progress;

  vec3 rainbow(float t) {
    return 0.58 + 0.42 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + t));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.05;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 smokeUv = uv * vec2(4.2, 2.25);
    smokeUv.x += sin(uv.y * 8.0 + u_time * 1.55) * 0.28;
    smokeUv.x += sin(uv.y * 15.0 - u_time * 1.2) * 0.12;
    smokeUv.y -= u_time * 0.42;

    float softNoise = fbm(smokeUv + vec2(u_time * 0.18, 0.0));
    float detailNoise = fbm(smokeUv * 2.8 - vec2(u_time * 0.28, u_time * 0.12));
    float plumes = sin(uv.x * 13.0 + softNoise * 7.2 + u_time * 1.45) * 0.5 + 0.5;
    float heightNoise = fbm(vec2(uv.x * 5.0 + u_time * 0.24, u_time * 0.18));

    float baseHeight = 0.42 + heightNoise * 0.48 + plumes * 0.18;
    float heightLimit = baseHeight + u_progress * (1.5 - baseHeight);

    float irregularTop = smoothstep(heightLimit, heightLimit - 0.28, uv.y);
    float bottomWeight = smoothstep(1.0, 0.06, uv.y);
    float verticalFade = pow(1.0 - uv.y, 1.45);
    float smokeShape = smoothstep(0.12, 0.68, verticalFade + softNoise * 0.52 + plumes * 0.24 - uv.y * 0.28);
    float wisps = smoothstep(0.32, 0.86, detailNoise + plumes * 0.2) * bottomWeight;
    vec3 color = rainbow(uv.x * 0.72 + u_time * 0.045 + softNoise * 0.12);
    float alpha = (smokeShape * 0.78 + wisps * 0.42) * verticalFade * irregularTop;
    alpha += (1.0 - smoothstep(0.0, 0.2, uv.y)) * 0.36;

    gl_FragColor = vec4(color, min(alpha, 0.96));
  }
`;
