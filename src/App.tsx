import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";

import * as three from "three";

import { cubePositionState, bulletPositionState } from "./gameState";

import "./styles.css";

// Todo:
// - Cube forward direction
// - Lasers from forward direction
// - Spawn enemies randomly coming towards you,
//   maybe from one direction first.

const Cube = () => {
  const cube = useRef<three.Mesh>();

  // Cube Movement:
  // On each frame, check the cursor position and move the ship to point in the
  // correct direction.
  const [cubePosition, setCubePosition] = useRecoilState(cubePositionState);

  useFrame(({ mouse }) => {
    setCubePosition({
      ...cubePosition,
      position: { ...cubePosition.position, y: 1 },
      rotation: { ...cubePosition.rotation, x: -mouse.x * 4 }
    });
  });

  useFrame(() => {
    if (!cube.current) return;

    cube.current.rotation.z = cubePosition.rotation.z;
    cube.current.rotation.y = cubePosition.rotation.x;
    cube.current.rotation.x = cubePosition.rotation.y;

    cube.current.position.y = cubePosition.position.y;
    cube.current.position.x = cubePosition.position.x;
  });

  return (
    <mesh
      ref={cube}
      onClick={() => {
        console.info("[DEBUG] Cube info: ", cube?.current);
      }}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0391BA" />
    </mesh>
  );
};

const Bullets = () => {
  const bullets = useRecoilValue(bulletPositionState);
  return (
    <group>
      {bullets.map((bullet) => (
        <mesh position={[bullet.x, bullet.y, bullet.z]} key={`${bullet.id}`}>
          <boxBufferGeometry attach="geometry" args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial attach="material" color="#ffe62a" />
        </mesh>
      ))}
    </group>
  );
};

const BulletsController = () => {
  const cubePosition = useRecoilValue(cubePositionState);
  const [bullets, setBullets] = useRecoilState(bulletPositionState);

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[Math.PI * 0.5, 0, 0]}
      onClick={() => {
        setBullets([
          ...bullets,
          {
            id: Math.random(),
            x: 0,
            y: 0,
            z: 0,
            velocity: [cubePosition.rotation.x * 6, cubePosition.rotation.y * 5]
          }
        ]);
        console.log("bullet set: ", bullets);
      }}
    >
      <boxBufferGeometry attach="geometry" args={[100, 100, 0]} />
      <meshStandardMaterial
        attach="material"
        color={0xbfee00}
        visible={false}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <gridHelper />
      <axesHelper />
      <pointLight intensity={1.0} position={[5, 3, 5]} />
      <Cube />
      <BulletsController />
      <Bullets />
    </>
  );
};

const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <Canvas
        concurrent
        camera={{
          near: 0.1,
          far: 100,
          zoom: 1,
          fov: 75
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#252934");
        }}
      >
        <Stats />
        <OrbitControls />
        <Suspense fallback={null}>
          <RecoilRoot>
            <Scene />
          </RecoilRoot>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
