import * as THREE from "three"
import React, { useRef, useMemo, useEffect, useState } from "react"
import SimplexNoise from "simplex-noise"
import { useFrame, useThree } from "@react-three/fiber"

const simplex = new SimplexNoise(Math.random);

const GrassPlane = ({ position, chunkSize, heightScale }) => {
  const vertices = useMemo(() => {
    const geo = new THREE.PlaneGeometry(chunkSize, chunkSize, 32, 32);
    const pos = geo.attributes.position;
    const pa = pos.array;
    
    for (let i = 0; i < pa.length; i += 3) {

      const x = pa[i] + position[0];
      const z = pa[i + 1] + position[1];  // Use Z instead of Y
      var noise = 2 * simplex.noise2D(x / 50, z / 50)
      noise += 4 * simplex.noise2D(x / 100, z / 100)
      noise += 0.2 * simplex.noise2D(x / 10, z / 10)
      pa[i + 2] = noise * heightScale;
    }
    
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [position, chunkSize, heightScale]);

  return (
    <mesh position={position} geometry={vertices} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="limegreen" side={THREE.DoubleSide} />
    </mesh>
  );
};

const Grass = () => {
  const { camera } = useThree();
  const groupRef = useRef();
  const chunkSize = 50;
  const heightScale = 2;

  const grassPlanes = useMemo(() => {
    const planes = [];
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        planes.push([x * chunkSize, 0, z * chunkSize]);
      }
    }
    return planes;
  }, [chunkSize]);

  useFrame(() => {
    if (groupRef.current && camera) {
      const cameraPosition = new THREE.Vector3();
      camera.getWorldPosition(cameraPosition);
      
      groupRef.current.position.x = Math.floor(cameraPosition.x / chunkSize) * chunkSize;
      groupRef.current.position.z = Math.floor(cameraPosition.z / chunkSize) * chunkSize;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3.5, 0]}>
      {grassPlanes.map((position, index) => (
        <GrassPlane key={index} position={position} chunkSize={chunkSize} heightScale={heightScale} />
      ))}
    </group>
  );
};

export default Grass;