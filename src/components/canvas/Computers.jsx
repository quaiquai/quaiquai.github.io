import React from 'react'
import { Suspense } from 'react';
import { Canvas,  useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/web'
import Overlay from './Overlay'
import Scene from './Scene'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { profile_picture } from "../../assets";

export default function App() {
  const colorMap = useLoader(TextureLoader, profile_picture)
  // This spring controls the background and the svg fill (text color)
  const [{ background, fill }, set] = useSpring({ background: '#202020', fill: '#f0f0f0' }, [])
  return (
    <Suspense fallback={<div>Loading... </div>}>

      <a.main style={{ background }}>
        <Canvas className="canvas" dpr={[1, 2]}>
          <Scene setBg={set} />
          <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        </Canvas>
        
        <Overlay fill={fill} />
      </a.main>
    </Suspense>
  )
}