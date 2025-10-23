import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RenderTexture } from "@react-three/drei";
import { Stars } from "../stars/Stars";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Joker } from "./JokerMain";
import { JokerModel } from "../model/Joker";

export const Menu = () => {
  const meshRef = useRef();
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const size = 6;
    const vertices = new Float32Array([
      0,
      -size,
      0,
      size,
      -size,
      0,
      size,
      size,
      0,
      -5,
      size,
      0,
    ]);

    const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const indices = [0, 1, 2, 0, 2, 3];

    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    return geo;
  }, []);

  const vertexDesiredPositions = {
    topLeft: {
      base: -4.05,
      active: -0.2,
      value: -5,
    },
    bottomLeft: {
      base: -0,
      active: -4.1,
      value: -0,
    },
  };

const isActive = useRef(false);

useEffect(() => {
  const vertexPosition = meshRef.current.geometry.attributes.position.array;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      isActive.current = !isActive.current;

      gsap.to(vertexDesiredPositions.topLeft, {
        value: isActive.current
          ? vertexDesiredPositions.topLeft.active
          : vertexDesiredPositions.topLeft.base,
        duration: 1,
        ease: "power1.inOut",
        onUpdate: () => {
          vertexPosition[9] = vertexDesiredPositions.topLeft.value;
        },
      });

      gsap.to(vertexDesiredPositions.bottomLeft, {
        value: isActive.current
          ? vertexDesiredPositions.bottomLeft.active
          : vertexDesiredPositions.bottomLeft.base,
        duration: 1,
        ease: "power1.inOut",
        onUpdate: () => {
          vertexPosition[0] = vertexDesiredPositions.bottomLeft.value;
        },
      });
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [vertexDesiredPositions]);


  useFrame(() => 
  {
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  })

  return (
    <>
      <mesh position={[3, 0, 0]} ref={meshRef} geometry={geometry}>
        <shaderMaterial
          // ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            map: { value: null },
          }}
          transparent
        >
          <RenderTexture attach="uniforms-map-value" anisotropy={32}>
            <Stars />
          </RenderTexture>
        </shaderMaterial>
      </mesh>
      <Joker />
      <JokerModel/>
    </>
  );
};
