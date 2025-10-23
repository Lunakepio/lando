import { extend, useFrame } from "@react-three/fiber";
import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import { MeshBasicMaterial, PlaneGeometry, ShaderMaterial, Color, Vector3 } from "three";
import { VertexShader, FragmentShader } from "./Shaders";
import { useEffect, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";

extend({ InstancedMesh2 });
export const Stars = () => {
  const ref = useRef();
  const geometry = new PlaneGeometry(1, 1);
  const material = new ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    uniforms: {
      uTime: { value: 0 },
      frequency: { value : 9.},
      speed : { value : 5.},
      blackColor: { value: new Color(0x000000) },
    },
    transparent: true,
    defines: {
      USE_INSTANCING_INDIRECT: true,
    },
  });

  const offset = 5
  useEffect(() =>{
    if(ref.current){
       ref.current.initUniformsPerInstance({ fragment: { speed: "float", blackColor: "vec4" } });
      ref.current.addInstances(150, (obj) =>
      {
        obj.position.x = (Math.random() * offset - offset/2) * 2.;
        obj.position.y = (Math.random() * offset - offset/2) * 2.;
        obj.rotateZ(Math.random() * Math.PI * 2);
        const scale = Math.random() > 0.8 ? 2 + Math.random() * 3. : 0;
        obj.scaleBase = scale;
        obj.scale.set(scale, scale, scale);
        const dir = Math.random() < 0.5 ? -1 : 1;
        obj.setUniform("speed", dir * (1 + Math.random() * offset));
        Math.random() < 0.3 && obj.setUniform("blackColor", new Color("#949494"));
      })
    }
  })

  useFrame(({clock}, delta ) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    ref.current.updateInstances((obj) => {
      if(obj.scaleBase === 0 && clock.getElapsedTime() > 1){
        obj.scale.lerp(new Vector3(4,4,4), 2 * delta);
      }
    })
  })
  return (
    <>
      <instancedMesh2 ref={ref} args={[geometry, material, { createEntities: true }]} />
          <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 10]} />
    </>
  );
};
