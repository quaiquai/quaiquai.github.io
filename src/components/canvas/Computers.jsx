import React, { Suspense, useEffect, useState } from "react";
import { Canvas , useLoader } from "@react-three/fiber";
import { Sky, OrbitControls, Preload, useGLTF, Text } from "@react-three/drei";
import Grass from "./Grass";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { profile_picture } from "../../assets";


import CanvasLoader from "../Loader";
let time = 0;

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./teapot/scene.gltf");
  const colorMap = useLoader(TextureLoader, profile_picture)
  return (
    <mesh position={[0, -3.5, 0]}>
      {/* <spotLight
        position={[10, 10, 5]}
        angle={0.5}
        penumbra={1}
        intensity={5}
        castShadow
        shadow-mapSize={1024}
      /> */}
      {/* <pointLight intensity={100} /> */}
      <mesh position={[-30.0, 10.5, 0]}>
        <circleGeometry args={[5, 32, 32]}/>
        <meshStandardMaterial map={colorMap} transparent/>
      </mesh>
      <mesh position={[4.0, 8.0, 0]}>
        <Text
          castShadow
          position={[-4, 6.5, 0]}
          scale={[4, 4, 4]}
          color="Gray" // default
          anchorX="center" // default
          anchorY="middle" // default
          outlineWidth={0.001}
          outlineBlur={0.01}
        >
          Hi, I'm Matthew McQuaigue
        </Text>
        <Text
          castShadow
          position={[0, 0.5, 0]}
          scale={[4, 4, 4]}
          color="Purple" // default
          anchorX="center" // default
          anchorY="middle" // default
          outlineWidth={0.001}
          outlineBlur={0.01}
        >
          I develop 3D visuals, user {"\n"}
          interfaces and web applications
        </Text>
      </mesh>
      {/* <primitive
        castShadow
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -0.25, 0.0]}
        rotation={[-0.01, -0.2, -0.1]}
      /> */}
      <Grass/>
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      {isMobile ? <></> : <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 5, 30], fov: 90 }}
        gl={{ preserveDrawingBuffer: true }}
      >
      {
        <Sky azimuth={1} inclination={0.6} distance={1000} />
      }
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={-Math.PI / 2}
          />
          <Computers isMobile={isMobile} />
          <ambientLight intensity={0.5}/>
          
          {
          // <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.5, 0]} >
          //   <planeGeometry args={[100, 100]} />
          //   <meshLambertMaterial />
          // </mesh>
          }
        </Suspense>
        <Preload all />
      </Canvas>}
    </>
  );
};

export default ComputersCanvas;
