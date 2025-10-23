const vertexShader = /* glsl */ `
    varying vec2 vWorldPos;
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
    vUv = uv;
        vPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

const fragmentShader = /* glsl */ `
    uniform sampler2D map;
    varying vec2 vWorldPos;
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {

      vec2 uv = ((vPosition.xy / vec2(10.0)) + 0.5);

      vec4 texture = texture2D(map, uv);
      vec4 blackColor = vec4(0.0, 0.0, 0.0, 1.0);
      vec4 finalColor = mix(texture, blackColor, 1. -texture.a);

    
    if(1.-vUv.x> 0.995){
        finalColor= vec4(1.0);
    }
     gl_FragColor = finalColor;
    }
      `;

export { vertexShader, fragmentShader };
