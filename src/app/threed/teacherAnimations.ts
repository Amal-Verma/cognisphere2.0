import * as THREE from 'three';

// This function can be called once after the model is loaded to set the initial pose
export const applyStandingPose = (scene: THREE.Object3D) => {
    // A temporary helper to get the standing quaternions
    const getStandingQuaternion = (boneName: string, qBase: Record<string, THREE.Quaternion>): THREE.Quaternion => {
        const qDelta = (x: number, y: number, z: number) =>
            new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, 'XYZ'));

        const baseQuat = qBase[boneName];
        if (!baseQuat) return new THREE.Quaternion();

        switch (boneName) {
            case 'LeftArm': return baseQuat.clone().multiply(qDelta(1.2, 0.4, 0.5));
            case 'LeftForeArm': return baseQuat.clone().multiply(qDelta(0, 1.0, 0.5));
            case 'LeftHand': return baseQuat.clone().multiply(qDelta(0.3, -0.5, 0.3));
            case 'RightArm': return baseQuat.clone().multiply(qDelta(1.2, -0.4, -0.5));
            case 'RightForeArm': return baseQuat.clone().multiply(qDelta(0, -1.0, -0.5));
            case 'RightHand': return baseQuat.clone().multiply(qDelta(0.3, 0.5, -0.3));
            case 'Spine1': return baseQuat.clone().multiply(qDelta(0.02, 0, 0));
            case 'Spine2': return baseQuat.clone().multiply(qDelta(0.01, 0, 0));
            case 'Head': return baseQuat.clone().multiply(qDelta(-0.1, 0, 0));
            case 'LeftHandThumb1':
            case 'RightHandThumb1':
            case 'RightHandIndex1':
            case 'RightHandIndex2':
            case 'RightHandIndex3':
            case 'RightHandMiddle1':
            case 'RightHandMiddle2':
            case 'RightHandMiddle3':
            case 'RightHandRing1':
            case 'RightHandRing2':
            case 'RightHandRing3':
            case 'RightHandPinky1':
            case 'RightHandPinky2':
            case 'RightHandPinky3':
                return baseQuat.clone().multiply(qDelta(-0.2, 0, 0));
            default:
                return baseQuat.clone();
        }
    };

    // Get all bones from the scene and apply the standing pose
    const allBones = [
        'Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head',
        'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand',
        'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand',
        'LeftHandThumb1', 'RightHandThumb1', 'RightHandIndex1', 'RightHandIndex2', 'RightHandIndex3',
        'RightHandMiddle1', 'RightHandMiddle2', 'RightHandMiddle3',
        'RightHandRing1', 'RightHandRing2', 'RightHandRing3',
        'RightHandPinky1', 'RightHandPinky2', 'RightHandPinky3'
    ];
    
    // Create a temporary qBase to calculate the standing quaternions
    const qBase: Record<string, THREE.Quaternion> = {};
    allBones.forEach(name => {
        const bone = scene.getObjectByName(name);
        if (bone) {
            qBase[name] = bone.quaternion.clone();
        }
    });

    allBones.forEach(name => {
        const bone = scene.getObjectByName(name);
        if (bone && qBase[name]) {
            bone.quaternion.copy(getStandingQuaternion(name, qBase));
        }
    });
};


export const createCustomAnimations = (scene: THREE.Object3D): THREE.AnimationClip[] => {
  const animations: THREE.AnimationClip[] = [];

  try {
    // Get all bones using exact names
    const hips = scene.getObjectByName('Hips');
    const spine = scene.getObjectByName('Spine');
    const spine1 = scene.getObjectByName('Spine1');
    const spine2 = scene.getObjectByName('Spine2');
    const neck = scene.getObjectByName('Neck');
    const head = scene.getObjectByName('Head');
    
    // Left Arm
    const leftShoulder = scene.getObjectByName('LeftShoulder');
    const leftArm = scene.getObjectByName('LeftArm');
    const leftForeArm = scene.getObjectByName('LeftForeArm');
    const leftHand = scene.getObjectByName('LeftHand');
    
    // Right Arm
    const rightShoulder = scene.getObjectByName('RightShoulder');
    const rightArm = scene.getObjectByName('RightArm');
    const rightForeArm = scene.getObjectByName('RightForeArm');
    const rightHand = scene.getObjectByName('RightHand');
    
    // Finger bones
    const leftThumb1 = scene.getObjectByName('LeftHandThumb1');
    const rightThumb1 = scene.getObjectByName('RightHandThumb1');
    const rightIndex1 = scene.getObjectByName('RightHandIndex1');
    const rightIndex2 = scene.getObjectByName('RightHandIndex2');
    const rightIndex3 = scene.getObjectByName('RightHandIndex3');
    const rightMiddle1 = scene.getObjectByName('RightHandMiddle1');
    const rightMiddle2 = scene.getObjectByName('RightHandMiddle2');
    const rightMiddle3 = scene.getObjectByName('RightHandMiddle3');
    const rightRing1 = scene.getObjectByName('RightHandRing1');
    const rightRing2 = scene.getObjectByName('RightHandRing2');
    const rightRing3 = scene.getObjectByName('RightHandRing3');
    const rightPinky1 = scene.getObjectByName('RightHandPinky1');
    const rightPinky2 = scene.getObjectByName('RightHandPinky2');
    const rightPinky3 = scene.getObjectByName('RightHandPinky3');

    // Helper functions for rotations
    const getQ = (b: THREE.Object3D) => b.quaternion.clone();
    const qToArray = (q: THREE.Quaternion) => [q.x, q.y, q.z, q.w];
    const qDelta = (x: number, y: number, z: number) => 
      new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, 'XYZ'));
    
    // Cache base quaternions from the model's default pose (T-pose)
    const qBase: Record<string, THREE.Quaternion> = {};
    const allBones: (THREE.Object3D | undefined)[] = [
      hips, spine, spine1, spine2, neck, head,
      leftShoulder, leftArm, leftForeArm, leftHand,
      rightShoulder, rightArm, rightForeArm, rightHand,
      leftThumb1, rightIndex1, rightIndex2, rightIndex3,
      rightMiddle1, rightMiddle2, rightMiddle3,
      rightRing1, rightRing2, rightRing3,
      rightPinky1, rightPinky2, rightPinky3
    ];
    allBones.forEach(b => { 
      if (b) { // Only cache if bone exists
          qBase[b.name] = getQ(b);
      }
    });

    // --- BASE POSE & HELPERS ---
    
    // Store standing quaternions as THREE.Quaternion objects for consistency
    const standingQuaternions: Record<string, THREE.Quaternion> = {};
    allBones.forEach(bone => {
        if (bone) {
            let poseQuat: THREE.Quaternion;
            switch (bone.name) {
                // Define the standing pose relative to the original T-pose
                case 'LeftArm': poseQuat = qBase[bone.name].clone().multiply(qDelta(1.2, 0.4, 0.5)); break;
                case 'LeftForeArm': poseQuat = qBase[bone.name].clone().multiply(qDelta(0, 1.0, 0.5)); break;
                case 'LeftHand': poseQuat = qBase[bone.name].clone().multiply(qDelta(0.3, -0.5, 0.3)); break;
                case 'RightArm': poseQuat = qBase[bone.name].clone().multiply(qDelta(1.2, -0.4, -0.5)); break;
                case 'RightForeArm': poseQuat = qBase[bone.name].clone().multiply(qDelta(0, -1.0, -0.5)); break;
                case 'RightHand': poseQuat = qBase[bone.name].clone().multiply(qDelta(0.3, 0.5, -0.3)); break;
                case 'Spine1': poseQuat = qBase[bone.name].clone().multiply(qDelta(0.02, 0, 0)); break;
                case 'Spine2': poseQuat = qBase[bone.name].clone().multiply(qDelta(0.01, 0, 0)); break;
                case 'Head': poseQuat = qBase[bone.name].clone().multiply(qDelta(-0.1, 0, 0)); break;
                case 'LeftHandThumb1':
                case 'RightHandThumb1':
                case 'RightHandIndex1':
                case 'RightHandIndex2':
                case 'RightHandIndex3':
                case 'RightHandMiddle1':
                case 'RightHandMiddle2':
                case 'RightHandMiddle3':
                case 'RightHandRing1':
                case 'RightHandRing2':
                case 'RightHandRing3':
                case 'RightHandPinky1':
                case 'RightHandPinky2':
                case 'RightHandPinky3':
                    poseQuat = qBase[bone.name].clone().multiply(qDelta(-0.2, 0, 0)); break;
                default:
                    poseQuat = qBase[bone.name].clone().multiply(qDelta(0, 0, 0)); break;
            }
            standingQuaternions[bone.name] = poseQuat;
        }
    });

    const createStandingPoseClip = (): THREE.AnimationClip => {
        const duration = 1.0;
        const tracks: THREE.KeyframeTrack[] = [];
        allBones.forEach(bone => {
            if (bone) {
                const pose = standingQuaternions[bone.name];
                if (pose) {
                    tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, [0, duration], [ ...pose.toArray(), ...pose.toArray() ]));
                }
            }
        });
        return new THREE.AnimationClip('Teacher_StandingPose', duration, tracks);
    };

    const standingPose = createStandingPoseClip();
    
    // Helper to get a stored standing quaternion
    const getStandingQuaternion = (boneName: string): THREE.Quaternion => {
        return standingQuaternions[boneName] || new THREE.Quaternion();
    };
    
    // This helper now applies rotation relative to a given base quaternion
    const rel = (baseQuat: THREE.Quaternion, x: number, y: number, z: number): number[] => {
        // Multiply the base quaternion by the delta to apply the new rotation
        return baseQuat.clone().multiply(qDelta(x, y, z)).toArray();
    }
    
    // This function creates a base set of tracks for all bones in the standing pose
    const createBaseTracks = (duration: number): THREE.KeyframeTrack[] => {
        const tracks: THREE.KeyframeTrack[] = [];
        allBones.forEach(bone => {
            if (bone) {
                const standingQuat = getStandingQuaternion(bone.name).toArray();
                tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, [0, duration], [ ...standingQuat, ...standingQuat ]));
            }
        });
        return tracks;
    }

    // --- GESTURE ANIMATIONS ---

    const createPointingAtBoardAnimation = (): THREE.AnimationClip => {
        const duration = 3;
        // Start with a full set of tracks for all bones in the standing pose
        const tracks = createBaseTracks(duration);
        try {
            const times = [0, 1.2, duration];
            
            // Replace the base tracks for animated bones with new keyframes
            if (spine2) tracks.push(new THREE.QuaternionKeyframeTrack(`${spine2.name}.quaternion`, times, [ ...getStandingQuaternion(spine2.name).toArray(), ...rel(getStandingQuaternion(spine2.name), 0.05, 0.3, 0), ...getStandingQuaternion(spine2.name).toArray() ]));
            if (head) tracks.push(new THREE.QuaternionKeyframeTrack(`${head.name}.quaternion`, times, [ ...getStandingQuaternion(head.name).toArray(), ...rel(getStandingQuaternion(head.name), 0.15, 0.3, 0), ...getStandingQuaternion(head.name).toArray() ]));
            if (rightShoulder) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightShoulder.name}.quaternion`, times, [ ...getStandingQuaternion(rightShoulder.name).toArray(), ...rel(getStandingQuaternion(rightShoulder.name), 0.25, 0.35, -0.25), ...getStandingQuaternion(rightShoulder.name).toArray() ]));
            if (rightArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightArm.name).toArray(), ...rel(getStandingQuaternion(rightArm.name), -1.0, 0.25, -0.35), ...getStandingQuaternion(rightArm.name).toArray() ]));
            if (rightForeArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightForeArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightForeArm.name).toArray(), ...rel(getStandingQuaternion(rightForeArm.name), -0.8, 0, 0), ...getStandingQuaternion(rightForeArm.name).toArray() ]));
            if (rightHand) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightHand.name}.quaternion`, times, [ ...getStandingQuaternion(rightHand.name).toArray(), ...rel(getStandingQuaternion(rightHand.name), 0, 1.3, -0.6), ...getStandingQuaternion(rightHand.name).toArray() ]));
            if (rightIndex1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightIndex1.name}.quaternion`, times, [ ...getStandingQuaternion(rightIndex1.name).toArray(), ...rel(getStandingQuaternion(rightIndex1.name), 0, 0, 0), ...getStandingQuaternion(rightIndex1.name).toArray() ]));
            if (rightThumb1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightThumb1.name}.quaternion`, times, [ ...getStandingQuaternion(rightThumb1.name).toArray(), ...rel(getStandingQuaternion(rightThumb1.name), -0.5, 0.25, 0.25), ...getStandingQuaternion(rightThumb1.name).toArray() ]));
            if (rightMiddle1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightMiddle1.name}.quaternion`, times, [ ...getStandingQuaternion(rightMiddle1.name).toArray(), ...rel(getStandingQuaternion(rightMiddle1.name), -Math.PI / 2, 0, 0), ...getStandingQuaternion(rightMiddle1.name).toArray() ]));
            if (rightRing1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightRing1.name}.quaternion`, times, [ ...getStandingQuaternion(rightRing1.name).toArray(), ...rel(getStandingQuaternion(rightRing1.name), -Math.PI / 2, 0, 0), ...getStandingQuaternion(rightRing1.name).toArray() ]));
            if (rightPinky1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightPinky1.name}.quaternion`, times, [ ...getStandingQuaternion(rightPinky1.name).toArray(), ...rel(getStandingQuaternion(rightPinky1.name), -Math.PI / 2, 0, 0), ...getStandingQuaternion(rightPinky1.name).toArray() ]));
        } catch (error) {
            console.error("Failed to create Pointing animation:", error);
        }
        return new THREE.AnimationClip('Teacher_PointingBoard', duration, tracks);
    };

    const createWritingOnBoardAnimation = (): THREE.AnimationClip => {
        const duration = 4;
        const tracks = createBaseTracks(duration);
        try {
            const times = [0, 0.8, 1.6, 2.4, 3.2, duration];
            
            // Replace the base tracks for animated bones with new keyframes
            if (spine1) tracks.push(new THREE.QuaternionKeyframeTrack(`${spine1.name}.quaternion`, times, [ ...getStandingQuaternion(spine1.name).toArray(), ...rel(getStandingQuaternion(spine1.name), 0.25, 0, 0), ...rel(getStandingQuaternion(spine1.name), 0.25, 0, 0), ...rel(getStandingQuaternion(spine1.name), 0.25, 0, 0), ...rel(getStandingQuaternion(spine1.name), 0.25, 0, 0), ...getStandingQuaternion(spine1.name).toArray() ]));
            if (head) tracks.push(new THREE.QuaternionKeyframeTrack(`${head.name}.quaternion`, times, [ ...getStandingQuaternion(head.name).toArray(), ...rel(getStandingQuaternion(head.name), 0.25, 0, 0), ...rel(getStandingQuaternion(head.name), 0.25, 0, 0), ...rel(getStandingQuaternion(head.name), 0.25, 0, 0), ...rel(getStandingQuaternion(head.name), 0.25, 0, 0), ...getStandingQuaternion(head.name).toArray() ]));
            if (rightArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightArm.name).toArray(), ...rel(getStandingQuaternion(rightArm.name), -1.1, 0.45, -0.55), ...rel(getStandingQuaternion(rightArm.name), -1.05, 0.42, -0.52), ...rel(getStandingQuaternion(rightArm.name), -1.1, 0.45, -0.55), ...rel(getStandingQuaternion(rightArm.name), -1.05, 0.42, -0.52), ...getStandingQuaternion(rightArm.name).toArray() ]));
            if (rightForeArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightForeArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightForeArm.name).toArray(), ...rel(getStandingQuaternion(rightForeArm.name), -0.9, 0, 0), ...rel(getStandingQuaternion(rightForeArm.name), -0.8, 0, 0), ...rel(getStandingQuaternion(rightForeArm.name), -0.9, 0, 0), ...rel(getStandingQuaternion(rightForeArm.name), -0.8, 0, 0), ...getStandingQuaternion(rightForeArm.name).toArray() ]));
            if (rightHand) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightHand.name}.quaternion`, times, [ ...getStandingQuaternion(rightHand.name).toArray(), ...rel(getStandingQuaternion(rightHand.name), 0, 1.5, -0.8), ...rel(getStandingQuaternion(rightHand.name), 0, 1.1, -0.75), ...rel(getStandingQuaternion(rightHand.name), 0, 1.5, -0.8), ...rel(getStandingQuaternion(rightHand.name), 0, 1.1, -0.75), ...getStandingQuaternion(rightHand.name).toArray() ]));
            if (rightThumb1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightThumb1.name}.quaternion`, times, [ ...getStandingQuaternion(rightThumb1.name).toArray(), ...rel(getStandingQuaternion(rightThumb1.name), -0.45, 0.3, 0.3), ...rel(getStandingQuaternion(rightThumb1.name), -0.45, 0.3, 0.3), ...rel(getStandingQuaternion(rightThumb1.name), -0.45, 0.3, 0.3), ...rel(getStandingQuaternion(rightThumb1.name), -0.45, 0.3, 0.3), ...getStandingQuaternion(rightThumb1.name).toArray() ]));
            if (rightIndex1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightIndex1.name}.quaternion`, times, [ ...getStandingQuaternion(rightIndex1.name).toArray(), ...rel(getStandingQuaternion(rightIndex1.name), -0.25, 0, 0), ...rel(getStandingQuaternion(rightIndex1.name), -0.25, 0, 0), ...rel(getStandingQuaternion(rightIndex1.name), -0.25, 0, 0), ...rel(getStandingQuaternion(rightIndex1.name), -0.25, 0, 0), ...getStandingQuaternion(rightIndex1.name).toArray() ]));
            if (rightMiddle1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightMiddle1.name}.quaternion`, times, [ ...getStandingQuaternion(rightMiddle1.name).toArray(), ...rel(getStandingQuaternion(rightMiddle1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightMiddle1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightMiddle1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightMiddle1.name), -Math.PI / 2, 0, 0), ...getStandingQuaternion(rightMiddle1.name).toArray() ]));
            if (rightRing1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightRing1.name}.quaternion`, times, [ ...getStandingQuaternion(rightRing1.name).toArray(), ...rel(getStandingQuaternion(rightRing1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightRing1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightRing1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightRing1.name), -Math.PI / 2, 0, 0), ...getStandingQuaternion(rightRing1.name).toArray() ]));
            if (rightPinky1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightPinky1.name}.quaternion`, times, [ ...getStandingQuaternion(rightPinky1.name).toArray(), ...rel(getStandingQuaternion(rightPinky1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightPinky1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightPinky1.name), -Math.PI / 2, 0, 0), ...rel(getStandingQuaternion(rightPinky1.name), -Math.PI / 2, 0, 0), ...getStandingQuaternion(rightPinky1.name).toArray() ]));
        } catch (error) {
            console.error("Failed to create Writing animation:", error);
        }
        return new THREE.AnimationClip('Teacher_WritingBoard', duration, tracks);
    };

    const createEncouragingNodAnimation = (): THREE.AnimationClip => {
        const duration = 2;
        const tracks = createBaseTracks(duration);
        try {
            const times = [0, 0.4, 0.8, 1.2, 1.6, duration];
            if (head) {
                // Replace the base track for the head with new keyframes
                const nodUp = rel(getStandingQuaternion(head.name), -0.05, 0, 0);
                const nodDown = rel(getStandingQuaternion(head.name), 0.1, 0, 0);
                tracks.push(new THREE.QuaternionKeyframeTrack(`${head.name}.quaternion`, times, [ ...getStandingQuaternion(head.name).toArray(), ...nodDown, ...nodUp, ...nodDown, ...nodUp, ...getStandingQuaternion(head.name).toArray() ]));
            }
        } catch (error) {
            console.error("Failed to create Nod animation:", error);
        }
        return new THREE.AnimationClip('Teacher_EncouragingNod', duration, tracks);
    };

    const createThinkingPoseAnimation = (): THREE.AnimationClip => {
        const duration = 3;
        const tracks = createBaseTracks(duration);
        try {
            const times = [0, 1.5, duration];
            
            // Replace the base tracks for animated bones with new keyframes
            if (head) tracks.push(new THREE.QuaternionKeyframeTrack(`${head.name}.quaternion`, times, [ ...getStandingQuaternion(head.name).toArray(), ...rel(getStandingQuaternion(head.name), -0.2, 0.25, 0), ...getStandingQuaternion(head.name).toArray() ]));
            if (rightArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightArm.name).toArray(), ...rel(getStandingQuaternion(rightArm.name), 0.4, -0.5, 0.5), ...getStandingQuaternion(rightArm.name).toArray() ]));
            if (rightForeArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightForeArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightForeArm.name).toArray(), ...rel(getStandingQuaternion(rightForeArm.name), -2.0, 0, 0), ...getStandingQuaternion(rightForeArm.name).toArray() ]));
            if (rightHand) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightHand.name}.quaternion`, times, [ ...getStandingQuaternion(rightHand.name).toArray(), ...rel(getStandingQuaternion(rightHand.name), 0.5, 1.65, -0.45), ...getStandingQuaternion(rightHand.name).toArray() ]));
            if (rightIndex1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightIndex1.name}.quaternion`, times, [ ...getStandingQuaternion(rightIndex1.name).toArray(), ...rel(getStandingQuaternion(rightIndex1.name), -0.5, 0, 0), ...getStandingQuaternion(rightIndex1.name).toArray() ]));
            if (rightMiddle1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightMiddle1.name}.quaternion`, times, [ ...getStandingQuaternion(rightMiddle1.name).toArray(), ...rel(getStandingQuaternion(rightMiddle1.name), -Math.PI / 3, 0, 0), ...getStandingQuaternion(rightMiddle1.name).toArray() ]));
            if (rightRing1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightRing1.name}.quaternion`, times, [ ...getStandingQuaternion(rightRing1.name).toArray(), ...rel(getStandingQuaternion(rightRing1.name), -Math.PI / 3, 0, 0), ...getStandingQuaternion(rightRing1.name).toArray() ]));
            if (rightPinky1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightPinky1.name}.quaternion`, times, [ ...getStandingQuaternion(rightPinky1.name).toArray(), ...rel(getStandingQuaternion(rightPinky1.name), -Math.PI / 3, 0, 0), ...getStandingQuaternion(rightPinky1.name).toArray() ]));
        } catch (error) {
            console.error("Failed to create Thinking animation:", error);
        }
        return new THREE.AnimationClip('Teacher_ThinkingPose', duration, tracks);
    };

    const createCallingStudentAnimation = (): THREE.AnimationClip => {
        const duration = 2.5;
        const tracks = createBaseTracks(duration);
        try {
            const times = [0, 1.0, duration];
            
            // Replace the base tracks for animated bones with new keyframes
            if (rightArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightArm.name).toArray(), ...rel(getStandingQuaternion(rightArm.name), 1.3, -0.25, -0.5), ...getStandingQuaternion(rightArm.name).toArray() ]));
            if (rightForeArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightForeArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightForeArm.name).toArray(), ...rel(getStandingQuaternion(rightForeArm.name), -1.4, 0.2, 0), ...getStandingQuaternion(rightForeArm.name).toArray() ]));
            if (rightHand) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightHand.name}.quaternion`, times, [ ...getStandingQuaternion(rightHand.name).toArray(), ...rel(getStandingQuaternion(rightHand.name), 0, 1.2, 0.3), ...getStandingQuaternion(rightHand.name).toArray() ]));
            if (rightIndex1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightIndex1.name}.quaternion`, times, [ ...getStandingQuaternion(rightIndex1.name).toArray(), ...rel(getStandingQuaternion(rightIndex1.name), -1.0, 0, 0), ...getStandingQuaternion(rightIndex1.name).toArray() ]));
            if (rightMiddle1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightMiddle1.name}.quaternion`, times, [ ...getStandingQuaternion(rightMiddle1.name).toArray(), ...rel(getStandingQuaternion(rightMiddle1.name), -1.1, 0, 0), ...getStandingQuaternion(rightMiddle1.name).toArray() ]));
            if (rightRing1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightRing1.name}.quaternion`, times, [ ...getStandingQuaternion(rightRing1.name).toArray(), ...rel(getStandingQuaternion(rightRing1.name), -1.2, 0, 0), ...getStandingQuaternion(rightRing1.name).toArray() ]));
            if (rightPinky1) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightPinky1.name}.quaternion`, times, [ ...getStandingQuaternion(rightPinky1.name).toArray(), ...rel(getStandingQuaternion(rightPinky1.name), -1.3, 0, 0), ...getStandingQuaternion(rightPinky1.name).toArray() ]));
        } catch (error) {
            console.error("Failed to create Calling Student animation:", error);
        }
        return new THREE.AnimationClip('Teacher_CallingStudent', duration, tracks);
    };

    const createExplainingWithGesturesAnimation = (): THREE.AnimationClip => {
        const duration = 3;
        const tracks = createBaseTracks(duration);
        try {
            const times = [0, 0.6, 1.2, 1.8, 2.4, duration];
            
            // Replace the base tracks for animated bones with new keyframes
            if (rightArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightArm.name).toArray(), ...rel(getStandingQuaternion(rightArm.name), 1.0, -0.25, -0.35), ...rel(getStandingQuaternion(rightArm.name), 0.9, -0.22, -0.32), ...rel(getStandingQuaternion(rightArm.name), 1.0, -0.25, -0.35), ...rel(getStandingQuaternion(rightArm.name), 0.9, -0.22, -0.32), ...getStandingQuaternion(rightArm.name).toArray() ]));
            if (rightForeArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightForeArm.name}.quaternion`, times, [ ...getStandingQuaternion(rightForeArm.name).toArray(), ...rel(getStandingQuaternion(rightForeArm.name), -0.7, 0, 0), ...rel(getStandingQuaternion(rightForeArm.name), -0.6, 0, 0), ...rel(getStandingQuaternion(rightForeArm.name), -0.7, 0, 0), ...rel(getStandingQuaternion(rightForeArm.name), -0.6, 0, 0), ...getStandingQuaternion(rightForeArm.name).toArray() ]));
            if (rightHand) tracks.push(new THREE.QuaternionKeyframeTrack(`${rightHand.name}.quaternion`, times, [ ...getStandingQuaternion(rightHand.name).toArray(), ...rel(getStandingQuaternion(rightHand.name), 0, 1.7, 0.4), ...rel(getStandingQuaternion(rightHand.name), 0, 0.9, -0.4), ...rel(getStandingQuaternion(rightHand.name), 0, 1.7, 0.4), ...rel(getStandingQuaternion(rightHand.name), 0, 0.9, -0.4), ...getStandingQuaternion(rightHand.name).toArray() ]));
            if (leftArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${leftArm.name}.quaternion`, times, [ ...getStandingQuaternion(leftArm.name).toArray(), ...rel(getStandingQuaternion(leftArm.name), 1.0, 0.25, 0.35), ...rel(getStandingQuaternion(leftArm.name), 0.9, 0.22, 0.32), ...rel(getStandingQuaternion(leftArm.name), 1.0, 0.25, 0.35), ...rel(getStandingQuaternion(leftArm.name), 0.9, 0.22, 0.32), ...getStandingQuaternion(leftArm.name).toArray() ]));
            if (leftForeArm) tracks.push(new THREE.QuaternionKeyframeTrack(`${leftForeArm.name}.quaternion`, times, [ ...getStandingQuaternion(leftForeArm.name).toArray(), ...rel(getStandingQuaternion(leftForeArm.name), -0.7, 0, 0), ...rel(getStandingQuaternion(leftForeArm.name), -0.6, 0, 0), ...rel(getStandingQuaternion(leftForeArm.name), -0.7, 0, 0), ...rel(getStandingQuaternion(leftForeArm.name), -0.6, 0, 0), ...getStandingQuaternion(leftForeArm.name).toArray() ]));
            if (leftHand) tracks.push(new THREE.QuaternionKeyframeTrack(`${leftHand.name}.quaternion`, times, [ ...getStandingQuaternion(leftHand.name).toArray(), ...rel(getStandingQuaternion(leftHand.name), 0, -1.7, -0.4), ...rel(getStandingQuaternion(leftHand.name), 0, -0.9, 0.4), ...rel(getStandingQuaternion(leftHand.name), 0, -1.7, -0.4), ...rel(getStandingQuaternion(leftHand.name), 0, -0.9, 0.4), ...getStandingQuaternion(leftHand.name).toArray() ]));
        } catch (error) {
            console.error("Failed to create Explaining animation:", error);
        }
        return new THREE.AnimationClip('Teacher_ExplainingGestures', duration, tracks);
    };

    const createLookingAroundClassroomAnimation = (): THREE.AnimationClip => {
        const duration = 4;
        const tracks = createBaseTracks(duration);
        try {
            const times = [0, 1, 2, 3, duration];
            
            // Replace the base tracks for animated bones with new keyframes
            if (head) tracks.push(new THREE.QuaternionKeyframeTrack(`${head.name}.quaternion`, times, [ ...getStandingQuaternion(head.name).toArray(), ...rel(getStandingQuaternion(head.name), 0, 0.3, 0), ...rel(getStandingQuaternion(head.name), 0, -0.3, 0), ...rel(getStandingQuaternion(head.name), 0, -0.15, 0), ...getStandingQuaternion(head.name).toArray() ]));
            if (neck) tracks.push(new THREE.QuaternionKeyframeTrack(`${neck.name}.quaternion`, times, [ ...getStandingQuaternion(neck.name).toArray(), ...rel(getStandingQuaternion(neck.name), 0, 0.1, 0), ...rel(getStandingQuaternion(neck.name), 0, -0.1, 0), ...rel(getStandingQuaternion(neck.name), 0, -0.05, 0), ...getStandingQuaternion(neck.name).toArray() ]));
        } catch (error) {
            console.error("Failed to create Looking Around animation:", error);
        }
        return new THREE.AnimationClip('Teacher_LookingAround', duration, tracks);
    };

    animations.push(standingPose);
    animations.push(createPointingAtBoardAnimation());
    animations.push(createWritingOnBoardAnimation());
    animations.push(createEncouragingNodAnimation());
    animations.push(createThinkingPoseAnimation());
    animations.push(createCallingStudentAnimation());
    animations.push(createExplainingWithGesturesAnimation());
    animations.push(createLookingAroundClassroomAnimation());

  } catch (error) {
    console.error("A critical error occurred while creating custom animations:", error);
  }
  
  return animations.filter(a => a && a.tracks.length > 0);
};
