export const VertexShader = /*glsl*/ `
    #ifdef USE_INSTANCING_INDIRECT
    #include <instanced_pars_vertex>
    #endif
    
    precision highp float;
    precision highp int;


    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
        vPosition = position;
        vUv = uv;
        
        #ifdef USE_INSTANCING_INDIRECT
            #include <instanced_vertex>
        #endif

        vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
        vec4 mvPosition = modelViewMatrix * worldPosition;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const FragmentShader = /*glsl*/ `
    precision highp float;
    precision highp int;

    uniform float uTime;
    uniform float frequency;
    uniform float speed;
    uniform vec4 blackColor;
    

    varying vec2 vUv;

    const float PI_OVER_5 = 0.628318530718;  // π/5 for 5-pointed star
    const vec4 WHITE = vec4(1.0);
    const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);


    float polarStar(in vec2 p) {

        float angle = atan(p.y, p.x);
        float modulatedAngle = mod(angle / PI_OVER_5 + 1.0, 2.0);
        
        const float STAR_SHARPNESS = 0.945;
        

        float angleOffset = modulatedAngle - 4.0 * step(1.0, modulatedAngle) + 1.0;
        float radius = length(p);
        float signedDistance = radius * cos(PI_OVER_5 * STAR_SHARPNESS * angleOffset) - 1.0;
        
        return signedDistance;
    }

    void main() {

        vec2 tiling = vec2(1.0);
        vec2 offset = vec2(0.0);
        float rotationAngle = 0.945; 

        vec2 centeredUV = vUv - 0.5 + offset;
        vec2 scaledUV = centeredUV * (2.0 + tiling);
        
        float cosTheta = cos(rotationAngle);
        float sinTheta = sin(rotationAngle);
        mat2 rotationMatrix = mat2(
            cosTheta, -sinTheta,
            sinTheta, cosTheta
        );
        vec2 rotatedUV = rotationMatrix * scaledUV;
        
        float starDistance = polarStar(rotatedUV) * 5.0;
        
        float ripplePattern = sin(starDistance * frequency - uTime * speed) / 10.0;
        
        float rippleMask = smoothstep(0.0, 0.05, ripplePattern);
        
        float clipDistance = polarStar(rotatedUV * 5.0);
        float clipMask = smoothstep(1.0, 1.0, clipDistance);
        
        float finalMask = rippleMask - clipMask;

        vec4 whitePortion = vec4(finalMask) * WHITE;
        vec4 blackPortion = (1.0 - vec4(finalMask + clipMask)) * blackColor;
        
        gl_FragColor = vec4(whitePortion.rgb + blackPortion.rgb, 1.0 - clipMask);
    }
`;
