export const vertexShader = /*glsl*/ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /*glsl*/`
  precision highp float;

  uniform sampler2D map1;
  uniform sampler2D map2;
  uniform vec2 pointer;
  uniform vec2 prevPointer;
  uniform float time;

  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float circle(vec2 uv, vec2 center, float radius, float edge) {
    float d = length(uv - center);
    return 1.0 - smoothstep(radius * (1.0 - edge), radius, d);
  }

  void main() {

    vec2 mouseUV = pointer * 0.5 + 0.5;
    vec2 prevMouseUV = prevPointer * 0.5 + 0.5;


    vec2 velocity = mouseUV - prevMouseUV;
    float speed = length(velocity);


    vec2 uv = vUv;

    float n = noise(uv * 10.0);

    float baseRadius = 0.;
    float speedRadius = clamp(speed * 0.6, 0.0, 0.6);
    float radius = baseRadius + speedRadius;

    float edge = 0.;

    float influenceCurr = circle(uv, mouseUV, radius, edge);

    float trailRadius = radius * 0.8;
    float influencePrev = circle(uv, prevMouseUV, trailRadius, 0.7);


    float streak = 0.0;
    if (speed > 0.0001) {
      vec2 dir = normalize(velocity);
 
      vec2 samplePos = mouseUV - dir * 0.02 * (1.0 + speed * 2.0);
      float streakRadius = radius * 0.4;
      streak = circle(uv, samplePos, streakRadius, 0.8) * step(1.0, speed * 10.0);
    }


    float mask = max(max(influenceCurr, influencePrev), streak);

    vec3 color1 = texture2D(map1, uv).rgb;
    vec3 color2 = texture2D(map2, uv).rgb;

    vec3 finalColor = mix(color1, color2, mask);

    vec3 outColor = vec3(mask);
    float outAlpha = mask;

    gl_FragColor = vec4(finalColor, 1.);
  }
`;
