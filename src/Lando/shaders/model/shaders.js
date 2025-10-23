export const vertexShader = /*glsl*/`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /*glsl*/ `
precision highp float;

uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    float size = 20.;
  float minY = -size;
  float maxY = size;
  float yNorm = (vPosition.y - minY) / (maxY - minY);


  float speed = 0.4;
  float progress = 1. - mod(time * speed, 1.0);
// float progress = 0.1;
  float thickness = 0.2;
  float mask = smoothstep(progress, progress + thickness,  yNorm)
             - smoothstep(progress + thickness, progress + thickness * 2.,  yNorm);
  


  vec3 color = vec3(0.8);

  float alpha = mask * 0.2;

  gl_FragColor = vec4(color, alpha);
}

`;
