import { ShaderMaterial } from "three";
import { vertexShader, fragmentShader } from "./shaders/background/shaders";
import { useFrame } from "@react-three/fiber";

export const Background = ({shouldBeFull}) => {
  const material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      time: { value: 0 },
      shouldBeFull : { value: shouldBeFull },
    },
    transparent: true,
  });

  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.getElapsedTime();
  });
  return (
    <mesh position={[0, 0, -300]} material={material}>
      <planeGeometry args={[1000, 1000]} />
      
    </mesh>
  );
};
