'use client';
import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { createCustomAnimations } from './teacherAnimations';


// --- 3D Model Component ---
interface ModelProps {
  modelUrl: string;
  playingAnimation: string | null;
  onAnimationsLoaded: (names: string[]) => void;
}

const Model: React.FC<ModelProps> = ({ modelUrl, playingAnimation, onAnimationsLoaded }) => {
  // Load the 3D model
  const { scene, animations } = useGLTF(modelUrl) as { scene: THREE.Object3D; animations: THREE.AnimationClip[] };
  
  // Refs for animation management
  const group = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const customActionsRef = useRef<{ [key: string]: THREE.AnimationAction }>({});
  const actionsRef = useRef<{ [key: string]: THREE.AnimationAction | null }>({});
  const namesRef = useRef<string[]>([]);
  
  // Set up animations from the model
  const { actions, names } = useAnimations(animations, group);
  actionsRef.current = actions;
  namesRef.current = names;

  // Set up animations when scene loads
  useEffect(() => {
    if (!scene || !group.current) return;

    // Create custom animations
    const customAnimations = createCustomAnimations(group.current);
    
    // Create mixer for custom animations
    const mixer = new THREE.AnimationMixer(group.current);
    mixerRef.current = mixer;
    
    // Create actions for custom animations
    customAnimations.forEach(clip => {
      const action = mixer.clipAction(clip);
      // Enable crossfading for smooth transitions
      action.clampWhenFinished = true;
      action.enabled = true;
      customActionsRef.current[clip.name] = action;
    });
    
    // Play standing pose immediately and keep it active as the base pose
    const standingPose = customActionsRef.current['Teacher_StandingPose'];
    if (standingPose) {
      standingPose
        .reset()
        .setEffectiveWeight(1)
        .setLoop(THREE.LoopOnce, 1)
        .play();
      // Apply the pose immediately
      mixer.update(0);
      
      // Notify that animations are loaded
      const allAnimations = [...namesRef.current, ...Object.keys(customActionsRef.current)];
      onAnimationsLoaded(allAnimations);
    }
  }, [scene, onAnimationsLoaded]);

  // Handle animation changes
  useEffect(() => {
    if (!mixerRef.current) return;

    // Apply standing pose as base before any other animation
    const standingPose = customActionsRef.current['Teacher_StandingPose'];
    if (standingPose && mixerRef.current) {
      standingPose.reset().setEffectiveWeight(1).play();
      mixerRef.current.update(0);
    }
    // Fade out all current animations
    Object.values(actions).forEach(action => {
      if (action) action.fadeOut(0.2);
    });
    Object.values(customActionsRef.current).forEach(action => {
      action.fadeOut(0.2);
    });

    // Play the new animation if specified
    if (playingAnimation) {
      // First try built-in actions
      if (actions[playingAnimation]) {
        actions[playingAnimation]?.reset()
          .setEffectiveWeight(1)
          .fadeIn(0.5)
          .play();
      } 
      // Then try custom actions
      else if (customActionsRef.current[playingAnimation]) {
        customActionsRef.current[playingAnimation]?.reset()
          .setEffectiveWeight(1)
          .fadeIn(0.5)
          .setLoop(THREE.LoopRepeat, Infinity)
          .play();
      }
    }
  }, [playingAnimation, actions]);

  // Animation loop for custom animations
  useEffect(() => {
    if (!mixerRef.current) return;
    
    let lastTime = 0;
    let animationId: number;
    
    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const deltaTime = (time - lastTime) / 1000; // Convert to seconds
      lastTime = time;
      
      if (mixerRef.current) {
        mixerRef.current.update(deltaTime);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []); // Removed dependencies to prevent recreation of animation loop

  // Center the model and position it properly
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      scene.position.sub(center);
      scene.position.y += size.y * 0.1;
    }
  }, [scene]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  return <primitive ref={group} object={scene} dispose={null} />;
};

// --- Enhanced Main App Component ---
const App: React.FC = () => {
  const modelUrl = '/source/Teacher Female Narration 01 (1).glb';
  // Set default to standing pose
  const [playingAnimation, setPlayingAnimation] = useState<string | null>('Teacher_StandingPose');
  const [animationNames, setAnimationNames] = useState<string[]>([]);

  const handleAnimationsLoaded = useCallback((names: string[]) => {
    setAnimationNames(names);
  }, []);

  const playAnimation = (name: string) => {
    setPlayingAnimation(playingAnimation === name ? null : name);
  };

  const stopAnimation = () => {
    setPlayingAnimation(null);
  };

  // Categorize animations
  const originalAnimations = animationNames.filter(name => !name.startsWith('Teacher_'));
  const customAnimations = animationNames.filter(name => name.startsWith('Teacher_'));

  // Group custom animations by category
  const gestureAnimations = customAnimations.filter(name => 
    name.includes('Pointing') || name.includes('Explaining') || name.includes('Welcoming') || name.includes('Greeting')
  );
  
  const classroomAnimations = customAnimations.filter(name => 
    name.includes('Writing') || name.includes('Organizing') || name.includes('Calling')
  );
  
  const expressiveAnimations = customAnimations.filter(name => 
    name.includes('Nod') || name.includes('Thinking') || name.includes('Applaud') || name.includes('Wave')
  );

  // Helper function to get animation description
  const getAnimationDescription = (name: string) => {
    const descriptions: { [key: string]: string } = {
      'Teacher_PointingBoard': 'Points at whiteboard while explaining',
      'Teacher_Greeting': 'Welcomes students with open arms',
      'Teacher_ExplainingGestures': 'Dynamic hand gestures while teaching',
      'Teacher_WritingBoard': 'Writes on whiteboard with realistic motion',
      'Teacher_EncouragingNod': 'Nods approvingly at students',
      'Teacher_ThinkingPose': 'Hand to chin in thoughtful pose',
      'Teacher_Applauding': 'Claps hands to celebrate student success',
      'Teacher_DismissiveWave': 'Gentle corrective gesture',
      'Teacher_CallingStudent': 'Points and beckons student to participate',
      'Teacher_OrganizingPapers': 'Organizes papers on desk'
    };
    return descriptions[name] || 'Custom teacher animation';
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex flex-col md:flex-row font-sans">
      {/* --- Enhanced Controls Panel --- */}
      <div className="w-full md:w-96 bg-black/30 backdrop-blur-lg border-r border-white/20 p-6 shadow-2xl overflow-y-auto flex-shrink-0">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Teacher Model Viewer
        </h1>
        
        {/* Original Animations */}
        {originalAnimations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-400 flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
              Model Animations ({originalAnimations.length})
            </h2>
            <div className="space-y-3">
              {originalAnimations.map((name, index) => (
                <button
                  key={`original-${name}-${index}`}
                  onClick={() => playAnimation(name)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    playingAnimation === name
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/30 font-medium'
                      : 'bg-white/10 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm'
                  }`}
                >
                  <div className="font-medium">{name}</div>
                  <div className="text-xs opacity-75 mt-1">Built-in Animation</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Idle/Standing Pose Button */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-300 flex items-center">
            <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
            Idle Pose
          </h2>
          <div className="space-y-3">
            <button
              key="idle-standing-pose"
              onClick={() => playAnimation('Teacher_StandingPose')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                playingAnimation === 'Teacher_StandingPose'
                  ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black shadow-lg shadow-gray-400/30 font-medium'
                  : 'bg-white/10 hover:bg-white/20 border border-gray-400/30 backdrop-blur-sm'
              }`}
            >
              <div className="font-medium">Standing Pose</div>
              <div className="text-xs opacity-75 mt-1">Arms down, relaxed</div>
            </button>
          </div>
        </div>
        {/* Gesture Animations */}
        {gestureAnimations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Teaching Gestures ({gestureAnimations.length})
            </h2>
            <div className="space-y-3">
              {gestureAnimations.map((name, index) => (
                <button
                  key={`gesture-${name}-${index}`}
                  onClick={() => playAnimation(name)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    playingAnimation === name
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-green-500/30 font-medium'
                      : 'bg-white/10 hover:bg-white/20 border border-green-500/30 backdrop-blur-sm'
                  }`}
                >
                  <div className="font-medium">{name.replace('Teacher_', '')}</div>
                  <div className="text-xs opacity-75 mt-1">{getAnimationDescription(name)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Classroom Activities */}
        {classroomAnimations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Classroom Activities ({classroomAnimations.length})
            </h2>
            <div className="space-y-3">
              {classroomAnimations.map((name, index) => (
                <button
                  key={`classroom-${name}-${index}`}
                  onClick={() => playAnimation(name)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    playingAnimation === name
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black shadow-lg shadow-blue-500/30 font-medium'
                      : 'bg-white/10 hover:bg-white/20 border border-blue-500/30 backdrop-blur-sm'
                  }`}
                >
                  <div className="font-medium">{name.replace('Teacher_', '')}</div>
                  <div className="text-xs opacity-75 mt-1">{getAnimationDescription(name)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expressive Animations */}
        {expressiveAnimations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-400 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Expressions ({expressiveAnimations.length})
            </h2>
            <div className="space-y-3">
              {expressiveAnimations.map((name, index) => (
                <button
                  key={`expressive-${name}-${index}`}
                  onClick={() => playAnimation(name)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    playingAnimation === name
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 font-medium'
                      : 'bg-white/10 hover:bg-white/20 border border-purple-500/30 backdrop-blur-sm'
                  }`}
                >
                  <div className="font-medium">{name.replace('Teacher_', '')}</div>
                  <div className="text-xs opacity-75 mt-1">{getAnimationDescription(name)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <button
          onClick={stopAnimation}
          className="w-full px-6 py-4 mb-6 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-lg shadow-red-500/30"
        >
          ⏹ Stop All Animations
        </button>
        
        {/* Controls Info */}
        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <p className="font-bold mb-3 text-cyan-400">3D Controls:</p>
          <div className="space-y-2 text-sm opacity-90">
            <p><span className="font-semibold text-cyan-300">Rotate:</span> Left-click + drag</p>
            <p><span className="font-semibold text-cyan-300">Zoom:</span> Mouse wheel</p>
            <p><span className="font-semibold text-cyan-300">Pan:</span> Right-click + drag</p>
          </div>
        </div>

        {/* Animation Status */}
        {playingAnimation && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
            <p className="text-green-300 font-medium">Now Playing:</p>
            <p className="text-white text-sm">{playingAnimation.replace('Teacher_', '')}</p>
          </div>
        )}
      </div>

      {/* --- Enhanced 3D Canvas --- */}
      <div className="flex-grow h-full w-full relative">
        <Canvas 
          camera={{ position: [0, 1, 3], fov: 50 }}
          className="bg-gradient-to-b from-transparent to-black/20"
        >
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#4f46e5" />
          <pointLight position={[0, 3, 0]} intensity={0.8} color="#06b6d4" />
          <spotLight 
            position={[3, 3, 3]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={1.0} 
            color="#f59e0b"
            castShadow 
          />
          
          <Suspense fallback={null}>
            <Model 
              modelUrl={modelUrl} 
              playingAnimation={playingAnimation}
              onAnimationsLoaded={handleAnimationsLoaded}
            />
          </Suspense>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]}
            minDistance={1}
            maxDistance={8}
            minPolarAngle={0}
            maxPolarAngle={Math.PI * 0.75}
          />
        </Canvas>

        {/* Loading Indicator */}
        {animationNames.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-cyan-400 font-medium">Loading 3D Model...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;