import { useFrame, useThree } from '@react-three/fiber'
import React, { useRef, useLayoutEffect } from 'react'
import { RenderTexture } from '@react-three/drei'
import { vertexShader, fragmentShader } from './shaders/main/shaders'
import { Scene1, Scene2 } from './Scenes'
import { Vector2 } from 'three'

export const Lando = () => {
  const mesh = useRef()
  const { viewport } = useThree()
    const prevPointer = useRef(new Vector2(0, 0))
  const timeRef = useRef(0)

  useLayoutEffect(() => {
    if (mesh.current) {
      mesh.current.scale.set(viewport.width, viewport.height, 1)
    }
  }, [viewport.width, viewport.height])

  useFrame(({ pointer, clock }, delta) => {
    if (mesh.current) {
      const uniforms = mesh.current.material.uniforms

      timeRef.current = clock.getElapsedTime()
      uniforms.time.value = timeRef.current
      

      uniforms.pointer.value.set(pointer.x, pointer.y)

      uniforms.prevPointer.value.lerp(uniforms.pointer.value, 8 * delta)
      
    }
  })


  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          map1: { value: null },
          map2: { value: null },
          pointer: { value: new Vector2(0, 0) },
          prevPointer: { value: new Vector2(0, 0) },
        }}
        transparent
      >
        <RenderTexture attach="uniforms-map1-value" anisotropy={32}>
          <Scene1 />
        </RenderTexture>
        <RenderTexture attach="uniforms-map2-value" anisotropy={32}>
          <Scene2 />
        </RenderTexture>
      </shaderMaterial>
    </mesh>
  )
}
