'use client';
import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ modelUrl }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names && names.length > 0) {
      // Find an appropriate looping animation
      const animationToPlay = 
        names.find(name => name.toLowerCase().includes('explaining')) || 
        names.find(name => name.toLowerCase().includes('idle')) || 
        names.find(name => name.toLowerCase().includes('standing')) || 
        names[0];

      if (actions[animationToPlay]) {
        actions[animationToPlay].reset().setLoop(THREE.LoopRepeat, Infinity).play();
      }
    }
  }, [actions, names]);

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center); // Center the model
      
      // Adjust vertical position to be slightly lower
      scene.position.y -= 0.4;
    }
  }, [scene]);

  return <primitive ref={group} object={scene} dispose={null} scale={1.2} />;
};

const TeacherModel = () => {
  const modelUrl = '/Teacher Female Narration 01 (1).glb';

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.9} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.7} color="#bde0fe" />
        <Suspense fallback={null}>
          <Model modelUrl={modelUrl} />
        </Suspense>
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          target={[0, 0, 0]}
          minDistance={2}
          maxDistance={5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
};

export default TeacherModel;
