import { useTexture } from "@react-three/drei";

export const Joker = () => {
  const texture = useTexture("./joker/joker_main_menu.png");
  const size = 7
  return (
    <mesh position={[1.9, -0.3, 1]}>
      <planeGeometry args={[size * 1.189, size]} />
      <meshBasicMaterial map={texture} transparent/>
    </mesh>
  );
};
