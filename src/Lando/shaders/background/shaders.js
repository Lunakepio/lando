export const vertexShader = /*glsl*/`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /*glsl*/ `
  precision highp float;

  uniform float time;
  varying vec2 vUv;
  uniform bool shouldBeFull;


  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(1.0, 57.0, -13.7))) * 43758.5453);
  }

  float noise3(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        mix(hash(p + vec3(0.0,0.0,0.0)), hash(p + vec3(1.0,0.0,0.0)), f.x),
        mix(hash(p + vec3(0.0,1.0,0.0)), hash(p + vec3(1.0,1.0,0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash(p + vec3(0.0,0.0,1.0)), hash(p + vec3(1.0,0.0,1.0)), f.x),
        mix(hash(p + vec3(0.0,1.0,1.0)), hash(p + vec3(1.0,1.0,1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  float noise(vec3 x) {
    return (noise3(x) + noise3(x + 11.5)) * 0.5;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = 1.0; 
    vec3 p = vec3( 0.2 + uv * 3., 0.1 * time * 0.8);

    float n = noise(p);


    float v = sin(6.2831 * 5.0 * n);
    float stripes = step(0.0, v);
    v = smoothstep(1.0, 0.0, 2. * abs(v) / fwidth(v));


    // vec3 col1 = 0.5 + 0.5 * sin(12.0 * n + vec3(0.0, 2.1, -2.1));
    vec3 col2 = vec3(shouldBeFull ? 0.89 : 0.96);

    vec3 color = mix(col2, vec3(0.5), shouldBeFull ? stripes : v);
    gl_FragColor = vec4(color, 1.0);
  }
`;
