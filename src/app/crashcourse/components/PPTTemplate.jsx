"use client";
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Nunito } from "next/font/google";
import MarkdownRenderer from './utils/MarkdownRenderer.jsx';
import CodeBlock from './utils/CodeBlock.jsx';

const nunito = Nunito({ subsets: ["latin"] });

const Mermaid = dynamic(() => import('./utils/mermaidRenderer'), {
  ssr: false,
  loading: () => <div className="min-h-[200px] flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 text-gray-600">Loading Diagram...</div>,
});

export default function PPTTemplate({ slides, currentSlide, onNext, onPrev, onGoToSlide, autoNavigate = false, scriptProgress = 0, onScriptComplete, isPaused = false, onPauseChange }) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false); // Combined auto-play + TTS
  const [internalPaused, setInternalPaused] = useState(isPaused);
  const [isClient, setIsClient] = useState(false);
  
  // Combined pause state (external or internal)
  const currentlyPaused = isPaused || internalPaused;
  
  // Function to handle unified pause state changes (PPT + Audio + Recording)
  const handleUnifiedPauseChange = (newPausedState) => {
    setInternalPaused(newPausedState);
    
    // Handle speech synthesis pause/resume
    if ('speechSynthesis' in window) {
      if (newPausedState && speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
      } else if (!newPausedState && speechSynthesis.paused) {
        speechSynthesis.resume();
      }
    }
    
    // Handle recording pause/resume
    if (isRecording && mediaRecorderRef.current) {
      try {
        if (newPausedState && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.pause();
          console.log('Recording paused');
        } else if (!newPausedState && mediaRecorderRef.current.state === 'paused') {
          mediaRecorderRef.current.resume();
          console.log('Recording resumed');
        }
      } catch (error) {
        console.error('Error controlling recording state:', error);
      }
    }
    
    // Notify parent component if callback provided
    if (onPauseChange) {
      onPauseChange(newPausedState);
    }
  };
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [isInitializingRecording, setIsInitializingRecording] = useState(false);
  const [recordingSetupComplete, setRecordingSetupComplete] = useState(false);
  const [useManualNarration, setUseManualNarration] = useState(false);
  const presentationRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // TTS and presentation mode functionality
  useEffect(() => {
    const script = slides[currentSlide]?.script;
    // Only speak if in presentation mode AND recording is properly set up AND not using manual narration AND not paused
    if (isPresentationMode && script && recordingSetupComplete && !useManualNarration && !currentlyPaused) {
      // Speak the script when in presentation mode and not paused
      speakText(script);
    } else if (!isPresentationMode || currentlyPaused) {
      // Stop speaking when presentation mode is turned off or when paused
      stopSpeaking();
    }
  }, [isPresentationMode, slides, currentSlide, recordingSetupComplete, useManualNarration, currentlyPaused]);

  const speakText = async (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      // Create an audio context and use Web Audio API for better recording compatibility
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          destinationRef.current = audioContextRef.current.createMediaStreamDestination();
        }

        // Resume audio context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Create a more compatible TTS approach using audio buffer
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          if (isPresentationMode && currentSlide < slides.length - 1 && !currentlyPaused) {
            // Longer delay for manual narration mode
            const delay = useManualNarration ? 5000 : 1000;
            setTimeout(() => onNext(), delay);
          } else if (isPresentationMode && currentSlide === slides.length - 1 && !currentlyPaused) {
            // End the presentation after a brief pause and stop recording
            setTimeout(() => {
              setIsPresentationMode(false);
              setIsAutoPlaying(false);
              setRecordingSetupComplete(false);
              stopRecording(); // Explicitly stop recording when presentation ends
            }, 1000); // Wait 1 second after the last speech ends before stopping
          }
        };
        utterance.onerror = () => setIsSpeaking(false);
        
        speechSynthesis.speak(utterance);

      } catch (error) {
        console.warn('Web Audio API approach failed, using basic TTS:', error);
        
        // Fallback to basic TTS
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          if (isPresentationMode && currentSlide < slides.length - 1 && !currentlyPaused) {
            setTimeout(() => onNext(), 1000);
          } else if (isPresentationMode && currentSlide === slides.length - 1 && !currentlyPaused) {
            setTimeout(() => {
              setIsPresentationMode(false);
              setIsAutoPlaying(false);
              setRecordingSetupComplete(false);
              stopRecording();
            }, 1000);
          }
        };
        utterance.onerror = () => setIsSpeaking(false);
        
        speechSynthesis.speak(utterance);
      }
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const togglePresentationMode = async () => {
    if (!isPresentationMode) {
      // Starting presentation - first set up recording
      setIsInitializingRecording(true);
      try {
        await startRecording();
        // Only start presentation after recording is successfully set up
        setIsPresentationMode(true);
        setIsAutoPlaying(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsInitializingRecording(false);
      }
    } else {
      // Stopping presentation
      setIsPresentationMode(false);
      setIsAutoPlaying(false);
      setRecordingSetupComplete(false);
      stopSpeaking();
      stopRecording();
    }
  };

  // Recording functions
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      
      // Show instructions to user about screen sharing and TTS audio challenges
      const audioChoice = window.confirm(
        "📹 Audio Recording Options:\n\n" +
        "⚠️ TTS (Auto-narration) often isn't captured by browsers because it's generated programmatically.\n\n" +
        "Choose your audio approach:\n\n" +
        "✅ OK = Try automatic TTS + system audio capture\n" +
        "❌ Cancel = Use MANUAL narration (speak into microphone yourself)\n\n" +
        "Manual narration is more reliable for audio recording."
      );
      
      setUseManualNarration(!audioChoice);
      
      if (!audioChoice) {
        // User chose manual narration
        const confirmManual = window.confirm(
          "📹 Manual Narration Mode Selected\n\n" +
          "• You will narrate each slide yourself using your microphone\n" +
          "• Auto-advance will be slower to give you time to speak\n" +
          "• This ensures your audio is captured in the recording\n\n" +
          "Make sure your microphone is ready. Continue?"
        );
        
        if (!confirmManual) {
          setIsInitializingRecording(false);
          throw new Error('Recording setup cancelled');
        }
      }

      // Get display media with specific constraints for tab capture
      let displayStream;
      try {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            mediaSource: 'screen',
            width: { ideal: 1920, max: 1920 },
            height: { ideal: 1080, max: 1080 },
            frameRate: { ideal: 30, max: 30 }
          },
          audio: {
            echoCancellation: false, // Don't cancel echo - we want to capture TTS
            noiseSuppression: false, // Don't suppress noise - we want all audio
            autoGainControl: false,  // Don't auto-adjust - we want raw audio
            sampleRate: 44100
          },
          preferCurrentTab: true // Hint to prefer current tab
        });
        
        console.log('📹 Display stream tracks:', {
          video: displayStream.getVideoTracks().length,
          audio: displayStream.getAudioTracks().length,
          audioSettings: displayStream.getAudioTracks()[0]?.getSettings()
        });
        
      } catch (displayError) {
        console.error('Display capture failed:', displayError);
        setIsInitializingRecording(false);
        throw new Error('Screen sharing was cancelled or failed. Please try again and make sure to select this tab AND enable "Share tab audio".');
      }

      // Get microphone audio and try to capture system audio for TTS
      let audioStream = null;
      let systemAudioStream = null;
      
      try {
        // Try to get system audio using getDisplayMedia with audio-only
        systemAudioStream = await navigator.mediaDevices.getDisplayMedia({
          video: false,
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100
          }
        });
        console.log('🔊 System audio captured for TTS recording');
      } catch (systemAudioError) {
        console.warn('System audio capture failed:', systemAudioError);
        
        // Fallback to microphone
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 44100
            }
          });
        } catch (audioError) {
          console.warn('Microphone access denied:', audioError);
        }
      }

      // Combine streams - prioritize multiple audio sources
      const tracks = [...displayStream.getVideoTracks()];
      
      // Add tab audio if available (may not capture TTS)
      if (displayStream.getAudioTracks().length > 0) {
        console.log('🔊 Tab audio available');
        tracks.push(...displayStream.getAudioTracks());
      } else {
        console.warn('⚠️ No tab audio available');
      }
      
      // Add system audio stream if available (better for TTS)
      if (systemAudioStream && systemAudioStream.getAudioTracks().length > 0) {
        console.log('🔊 System audio available - this should capture TTS');
        tracks.push(...systemAudioStream.getAudioTracks());
      }
      
      // Add microphone audio as fallback
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        console.log('🎤 Microphone audio available');
        tracks.push(...audioStream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);
      
      console.log('📹 Combined stream tracks:', {
        video: combinedStream.getVideoTracks().length,
        audio: combinedStream.getAudioTracks().length,
        totalTracks: combinedStream.getTracks().length,
        sources: {
          tabAudio: displayStream.getAudioTracks().length > 0,
          systemAudio: systemAudioStream?.getAudioTracks().length > 0,
          microphone: audioStream?.getAudioTracks().length > 0
        }
      });

      // Check if we have the necessary tracks
      if (combinedStream.getVideoTracks().length === 0) {
        throw new Error('No video track available. Please select a screen or tab to record.');
      }
      
      if (combinedStream.getAudioTracks().length === 0) {
        const proceedWithoutAudio = window.confirm(
          '⚠️ No audio tracks detected!\n\n' +
          'TTS audio may not be recorded because:\n' +
          '• TTS is generated programmatically, not as "tab audio"\n' +
          '• Browser may not capture speechSynthesis API output\n\n' +
          'To potentially capture TTS:\n' +
          '1. Try using system audio capture\n' +
          '2. Or use external recording software\n' +
          '3. Or manually narrate using microphone\n\n' +
          'Do you want to proceed with video-only recording?'
        );
        
        if (!proceedWithoutAudio) {
          throw new Error('Recording cancelled - no audio available');
        }
      }

      // Set up MediaRecorder with better codec support
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for good quality
        audioBitsPerSecond: 128000   // 128 kbps for audio
      });

      console.log('📹 MediaRecorder created:', {
        mimeType,
        state: mediaRecorderRef.current.state,
        stream: {
          videoTracks: combinedStream.getVideoTracks().length,
          audioTracks: combinedStream.getAudioTracks().length
        }
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('📹 MediaRecorder onstop event fired');
        console.log('📹 Recorded chunks count:', recordedChunksRef.current.length);
        
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          console.log('📹 Created blob URL:', url);
          setRecordedVideoUrl(url);
          setShowRecordingModal(true);
        } else {
          console.warn('📹 No recorded chunks available');
          alert('Recording completed but no data was captured. Please try again.');
        }
        
        // Clean up streams
        displayStream.getTracks().forEach(track => {
          console.log('🔌 Stopping track:', track.kind);
          track.stop();
        });
        if (systemAudioStream) {
          systemAudioStream.getTracks().forEach(track => {
            console.log('🔊 Stopping system audio track:', track.kind);
            track.stop();
          });
        }
        if (audioStream) {
          audioStream.getTracks().forEach(track => {
            console.log('🎤 Stopping audio track:', track.kind);
            track.stop();
          });
        }
      };

      // Handle stream ending (user stops sharing)
      displayStream.getVideoTracks()[0].onended = () => {
        console.log('Screen sharing ended by user');
        if (isPresentationMode) {
          setIsPresentationMode(false);
          setIsAutoPlaying(false);
          stopSpeaking();
          stopRecording();
        }
      };

      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setIsInitializingRecording(false);
      setRecordingSetupComplete(true);

      // Set up a timeout to auto-stop recording after 30 minutes (safety measure)
      recordingTimeoutRef.current = setTimeout(() => {
        console.log('📹 Auto-stopping recording after 30 minutes');
        if (isRecording) {
          stopRecording();
        }
      }, 30 * 60 * 1000); // 30 minutes

      // Show success message
      setTimeout(() => {
        const audioStatus = combinedStream.getAudioTracks().length > 0 ? 
          '🔊 Audio capture enabled - TTS will be recorded!' :
          '⚠️ No audio capture - only video will be recorded';
          
        alert(`🎥 Recording started successfully!\n\n${audioStatus}\n\nYour presentation will now begin with AI narration.`);
      }, 500);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsInitializingRecording(false);
      setRecordingSetupComplete(false);
      
      let errorMessage = 'Recording setup failed. ';
      if (error.message.includes('cancelled')) {
        errorMessage += 'Screen sharing was cancelled. Please try again and select this browser tab to record.';
      } else if (error.message.includes('Permission denied')) {
        errorMessage += 'Please grant screen sharing permissions and try again.';
      } else {
        errorMessage += 'Please ensure you have a modern browser and try again.';
      }
      
      alert(errorMessage);
      throw error;
    }
  };

  const stopRecording = () => {
    console.log('🛑 Stopping recording...', { 
      mediaRecorderExists: !!mediaRecorderRef.current, 
      isRecording,
      recorderState: mediaRecorderRef.current?.state 
    });

    // Clear timeout if it exists
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          console.log('📹 MediaRecorder.stop() called');
        } else {
          console.log('📹 MediaRecorder is not in recording state:', mediaRecorderRef.current.state);
          // If recorder is not recording but we think it is, force the modal
          if (recordedChunksRef.current.length > 0) {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedVideoUrl(url);
            setShowRecordingModal(true);
          }
        }
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
        // Try to create blob from existing chunks anyway
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedVideoUrl(url);
          setShowRecordingModal(true);
        }
      }
    } else if (recordedChunksRef.current.length > 0) {
      // If we have recorded chunks but the recorder isn't active, create the video anyway
      console.log('📹 Creating video from existing chunks');
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setShowRecordingModal(true);
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedVideoUrl) {
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.download = `crash-course-presentation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const closeRecordingModal = () => {
    setShowRecordingModal(false);
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }
    setIsInitializingRecording(false);
    setRecordingSetupComplete(false);
    
    // Clear timeout if it exists
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  };

  // Auto-navigation based on script progress
  useEffect(() => {
    if (autoNavigate && scriptProgress > 0) {
      // Navigate to next slide when script is 80% complete
      if (scriptProgress >= 80 && currentSlide < slides.length - 1) {
        const timer = setTimeout(() => {
          onNext();
        }, 2000); // Wait 2 seconds before advancing
        
        return () => clearTimeout(timer);
      }
    }
  }, [scriptProgress, autoNavigate, currentSlide, slides, onNext]);

  if (!slides || slides.length === 0) {
    return (
      <div className={`${nunito.className} w-full h-[600px] bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl border border-gray-200/50 shadow-lg`}>
        <p className="text-gray-800 text-lg">No slides available</p>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`${nunito.className} w-full max-w-7xl mx-auto`}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes recording-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
      
      {/* PPT Header */}
      <div className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-4 sm:p-5 rounded-t-2xl flex justify-between items-center shadow-lg">
        <h2 className="m-0 text-lg sm:text-xl font-semibold">
          📊 Presentation
        </h2>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-sm font-medium">
            {currentSlide + 1} of {slides.length}
          </span>
          
          {/* Unified Presentation Mode Button */}
          <button
            onClick={togglePresentationMode}
            disabled={isInitializingRecording}
            className={`${
              isPresentationMode 
                ? 'bg-red-500 hover:bg-red-600' 
                : isInitializingRecording
                ? 'bg-yellow-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-md transform hover:scale-105 duration-200 flex items-center gap-2 disabled:transform-none disabled:hover:scale-100`}
            title={
              isPresentationMode 
                ? 'Stop the presentation and recording' 
                : isInitializingRecording
                ? 'Setting up recording...'
                : 'Start presentation with auto-narration and recording'
            }
          >
            {isPresentationMode ? (
              <>
                <span className="w-3 h-3 bg-white rounded-sm animate-pulse"></span>
                Stop Presentation
              </>
            ) : isInitializingRecording ? (
              <>
                <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                Setting up Recording...
              </>
            ) : (
              <>
                🎥 Start Presentation & Record
              </>
            )}
          </button>

          {/* Recording Setup Status */}
          {isInitializingRecording && (
            <div className="flex items-center gap-1 text-xs bg-yellow-500/20 px-2 py-1 rounded border border-yellow-300">
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#eab308',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              <span className="text-yellow-700 font-medium">Initializing...</span>
            </div>
          )}

          {/* Recording Status Indicator */}
          {isRecording && (
            <div className="flex items-center gap-1 text-xs bg-red-500/20 px-2 py-1 rounded border border-red-300">
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: mediaRecorderRef.current?.state === 'paused' ? '#eab308' : '#ef4444',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              <span className="text-red-700 font-medium">
                {mediaRecorderRef.current?.state === 'paused' ? 'Recording Paused' : 'Recording'} {mediaRecorderRef.current?.stream?.getAudioTracks().length > 0 ? '🔊' : '🔇'}
              </span>
            </div>
          )}

          {/* Unified Pause Status Indicator */}
          {currentlyPaused && (
            <div className="flex items-center gap-1 text-xs bg-yellow-500/20 px-2 py-1 rounded border border-yellow-300">
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#eab308',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              <span className="text-yellow-700 font-medium">
                System Paused {isSpeaking && '| Audio Paused'} {isRecording && '| Recording Paused'}
              </span>
            </div>
          )}

          {/* Manual Stop Recording Button (fallback) */}
          {isRecording && !isPresentationMode && (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-md transform hover:scale-105 duration-200 flex items-center gap-2"
              title="Stop recording manually"
            >
              🛑 Stop Recording
            </button>
          )}

          {/* Speaking Status Indicator */}
          {(isSpeaking || (isPresentationMode && useManualNarration)) && (
            <div className="flex items-center gap-1 text-xs bg-green-500/20 px-2 py-1 rounded">
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              {useManualNarration ? 'Manual Narration Mode...' : 'Speaking...'}
            </div>
          )}
        </div>
      </div>

      {/* PPT Slide Display */}
      <div ref={presentationRef} className="bg-white/90 backdrop-blur-sm w-full min-h-[600px] max-h-[80vh] aspect-video p-8 sm:p-10 border-x border-gray-200/50 relative overflow-hidden flex flex-col shadow-lg">
        {/* Slide Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-100 opacity-50 z-0" />

        {/* Slide Content */}
        <div className="relative z-10 text-gray-800">
          {isClient && renderSlideContent(currentSlideData, currentSlide)}
        </div>

        {/* Slide Number Indicator */}
        <div className="absolute bottom-5 right-5 bg-black/70 text-white px-2 py-1 rounded text-xs z-20">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* PPT Controls */}
      <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-5 rounded-b-2xl border border-gray-200/50 border-t-0 flex justify-between items-center shadow-lg">
        {/* Navigation Controls */}
        <div className="flex gap-3 items-center">
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className={`${
              currentSlide === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white hover:shadow-md transform hover:scale-105'
            } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            disabled={currentSlide === slides.length - 1}
            className={`${
              currentSlide === slides.length - 1 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white hover:shadow-md transform hover:scale-105'
            } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
          >
            Next →
          </button>
        </div>

        {/* Pause/Play Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newPausedState = !currentlyPaused;
              handleUnifiedPauseChange(newPausedState);
              
              // If resuming and in presentation mode, restart TTS for current slide
              if (!newPausedState && isPresentationMode) {
                const script = slides[currentSlide]?.script;
                if (script && recordingSetupComplete && !useManualNarration) {
                  // Small delay to ensure speech synthesis is ready
                  setTimeout(() => speakText(script), 100);
                }
              }
            }}
            className={`${
              currentlyPaused 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
            } text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 flex items-center gap-2`}
            title={currentlyPaused ? 'Resume presentation (PPT + Audio + Recording)' : 'Pause presentation (PPT + Audio + Recording)'}
          >
            {currentlyPaused ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume All
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause All
              </>
            )}
          </button>
          
          {/* Recording Status Indicator */}
          {isRecording && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                mediaRecorderRef.current?.state === 'paused' 
                  ? 'bg-yellow-500 animate-pulse' 
                  : 'bg-red-500 animate-pulse'
              }`}></div>
              <span className="text-xs text-red-700 font-medium">
                {mediaRecorderRef.current?.state === 'paused' ? 'Rec Paused' : 'Recording'}
              </span>
            </div>
          )}
          
          {/* TTS Control */}
          {slides[currentSlide]?.script && (
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else if (!currentlyPaused) {
                  speakText(slides[currentSlide].script);
                }
              }}
              disabled={currentlyPaused}
              className={`${
                isSpeaking 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
              } text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100`}
              title={currentlyPaused ? 'Resume presentation to use TTS' : isSpeaking ? 'Stop narration' : 'Read slide aloud'}
            >
              {isSpeaking ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.74L4.84 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.84l3.543-2.74a1 1 0 011.617.74zM15 8a3 3 0 110 6V8z" clipRule="evenodd" />
                    <path d="M17.33 6.106a5 5 0 010 7.788" />
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.74L4.84 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.84l3.543-2.74a1 1 0 011.617.74zM15 8a3 3 0 110 6V8z" clipRule="evenodd" />
                    <path d="M17.33 6.106a5 5 0 010 7.788" />
                  </svg>
                  Speak
                </>
              )}
            </button>
          )}
        </div>

      {/* Slide Navigation Input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={currentSlide + 1}
          onChange={(e) => {
            const slideNum = parseInt(e.target.value, 10);
            if (slideNum > 0 && slideNum <= slides.length) {
              onGoToSlide(slideNum - 1);
            }
          }}
          className="w-16 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="1"
          max={slides.length}
          disabled={isPresentationMode}
        />
        <span className="text-gray-600">/ {slides.length}</span>
      </div>

      {/* Complete Course Button on Last Slide */}
      {currentSlide === slides.length - 1 && slides.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200"
            onClick={() => {
              // Update roadmap progress
              const savedCurrentIndex = localStorage.getItem('roadmapCurrentIndex');
              let newIndex = 1;
              if (savedCurrentIndex) {
                newIndex = parseInt(savedCurrentIndex, 10) + 1;
              }
              localStorage.setItem('roadmapCurrentIndex', newIndex.toString());
              // Optionally redirect to roadmap
              window.location.href = '/roadmap';
            }}
          >
            🎉 Complete Course & Update Progress
          </button>
        </div>
      )}
      </div>

      {/* Recording Modal */}
      {showRecordingModal && recordedVideoUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-6">
              <h3 className="text-2xl font-bold mb-2">🎥 Recording Complete!</h3>
              <p className="text-blue-100">Your presentation has been successfully recorded with audio narration.</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <video
                  src={recordedVideoUrl}
                  controls
                  className="w-full max-h-96 rounded-xl shadow-lg"
                  preload="metadata"
                >
                  Your browser does not support video playback.
                </video>
              </div>
              
              <div className="flex justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Recording Details:</p>
                  <p>• Video format: WebM with VP9 codec</p>
                  <p>• Audio: High-quality narration included</p>
                  <p>• Date: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={closeRecordingModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={downloadRecording}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105 duration-200 flex items-center gap-2"
                  >
                    📥 Download Recording
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderSlideContent(slide, slideIndex) {
  // Helper function to safely convert any value to string
  const safeString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return String(value || '');
  };

  // Fallback for simple string slides (from user-generated content)
  if (typeof slide === 'string') {
    return (
      <div className="p-6">
        <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">Slide Content</h2>
        <MarkdownRenderer>{slide}</MarkdownRenderer>
      </div>
    );
  }

  if (!slide || typeof slide !== 'object') {
    return <div className="text-gray-600">No content available</div>;
  }

  // Slide type switch
  switch (slide.type) {
    case 'title':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500">{safeString(slide.title)}</h1>
          {slide.subtitle && <h2 className="text-xl sm:text-2xl text-gray-700 mb-6">{safeString(slide.subtitle)}</h2>}
          <div className="text-gray-600 text-lg mb-2 font-semibold">{safeString(slide.author)}</div>
          <div className="text-gray-500 text-base font-medium">{safeString(slide.date)}</div>
        </div>
      );
    case 'section':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 font-bold mb-3">{safeString(slide.title)}</h2>
          <p className="text-gray-700 text-lg sm:text-xl">{safeString(slide.description)}</p>
        </div>
      );
    case 'content':
      return (
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <MarkdownRenderer>{safeString(slide.content)}</MarkdownRenderer>
          {slide.bullets && Array.isArray(slide.bullets) && (
            <ul className="mt-4 ml-6 space-y-2">
              {slide.bullets.map((b, i) => (
                <li key={i} className="text-lg text-gray-700"><MarkdownRenderer>{safeString(b)}</MarkdownRenderer></li>
              ))}
            </ul>
          )}
        </div>
      );
    case 'image':
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <div className="relative w-4/5 h-96 mb-4">
            <Image 
              src={safeString(slide.imageUrl)} 
              alt={safeString(slide.caption || 'Slide image')} 
              fill
              className="rounded-xl shadow-lg object-contain" 
            />
          </div>
          {slide.caption && <div className="text-gray-600 text-base font-medium">{safeString(slide.caption)}</div>}
        </div>
      );
    case 'mermaid':
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <div className="w-full max-w-2xl min-h-[200px] bg-slate-50 rounded-xl p-4 mb-4 shadow-inner">
            <Mermaid key={slideIndex} chart={safeString(slide.diagram)} />
          </div>
          {slide.caption && <div className="text-gray-600 text-base font-medium">{safeString(slide.caption)}</div>}
        </div>
      );
    case 'quote':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <blockquote style={{ fontSize: 28, color: '#1f2937', fontStyle: 'italic', borderLeft: '6px solid #1e3a8a', paddingLeft: 24, marginBottom: 16 }}>
            “{safeString(slide.quote)}”
          </blockquote>
          <div className="text-gray-700 text-xl font-bold">— {safeString(slide.author)}</div>
        </div>
      );
    case 'code':
      return (
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <CodeBlock code={safeString(slide.code)} language={safeString(slide.language)} />
        </div>
      );
    case 'table':
      return (
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr>
                  {slide.headers && Array.isArray(slide.headers) && slide.headers.map((h, i) => (
                    <th key={i} className="border border-gray-300/50 p-3 bg-gradient-to-r from-blue-50 to-pink-50 font-bold text-gray-800">{safeString(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.rows && Array.isArray(slide.rows) && slide.rows.map((row, i) => (
                  <tr key={i}>
                    {Array.isArray(row) && row.map((cell, j) => (
                      <td key={j} className="border border-gray-300/50 p-3 text-gray-700">{safeString(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'list':
      return (
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <ul className="space-y-3 ml-6">
            {slide.items && Array.isArray(slide.items) && slide.items.map((item, i) => (
              <li key={i} className="flex items-center text-lg">
                <input type="checkbox" checked={item?.checked || false} readOnly className="mr-3 scale-125" />
                <span className="text-gray-700">{safeString(item?.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'conclusion':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500">{safeString(slide.title)}</h2>
          <MarkdownRenderer>{safeString(slide.content)}</MarkdownRenderer>
        </div>
      );
    case 'content-and-image':
      return (
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <MarkdownRenderer>{safeString(slide.content)}</MarkdownRenderer>
              {slide.bullets && Array.isArray(slide.bullets) && (
                <ul className="mt-4 ml-6 space-y-2">
                  {slide.bullets.map((b, i) => (
                    <li key={i} className="text-lg text-gray-700"><MarkdownRenderer>{safeString(b)}</MarkdownRenderer></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-72 mb-4">
                <Image 
                  src={safeString(slide.imageUrl)} 
                  alt={safeString(slide.imageCaption || 'Slide image')} 
                  fill
                  className="rounded-xl shadow-lg object-contain" 
                />
              </div>
              {slide.imageCaption && <div className="text-gray-600 text-base font-medium">{safeString(slide.imageCaption)}</div>}
            </div>
          </div>
        </div>
      );
    case 'content-and-code':
      return (
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-4">{safeString(slide.title)}</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <MarkdownRenderer>{safeString(slide.content)}</MarkdownRenderer>
            </div>
            <div className="flex-1">
              <CodeBlock code={safeString(slide.code)} language={safeString(slide.language)} />
            </div>
          </div>
        </div>
      );
    default:
      // Instead of returning the object, return a message.
      return <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 rounded-lg">Unsupported slide type: {slide.type}</div>;
  }
}