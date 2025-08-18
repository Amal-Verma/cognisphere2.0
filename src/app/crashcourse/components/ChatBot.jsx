"use client";
import { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '@/utlis/generate/chatGemini';

export default function ChatBot({ isOpen, onClose, slides, slideNumber, totalSlides, onSlideChange, onPauseResume, isPaused }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for speech recognition and synthesis support
    if (typeof window !== 'undefined') {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setSpeechSupported(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          // Automatically send message after successful transcription
          handleSendMessage(transcript); 
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    // Pause the entire system (PPT + Audio + Recording) when chatbot opens
    if (!isPaused) {
      onPauseResume(true);
    }
    
    // Add welcome message for Q&A when component starts
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Hi! I'm your AI Teacher. I've paused the presentation so we can chat. Feel free to ask me questions about the course content, or ask for summaries and explanations. You can also ask me to navigate the presentation for you!`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      speakText(welcomeMessage.content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, messages.length, isPaused, onPauseResume]);

  // Resume the entire system when chatbot closes
  useEffect(() => {
    if (!isOpen && isPaused) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        onPauseResume(false);
      }, 300);
    }
  }, [isOpen, isPaused, onPauseResume]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageOverride) => {
    const messageToSend = (messageOverride || inputMessage || '').trim();
    if (!messageToSend) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Check if user mentioned a specific slide number
      const slideNumberMatch = messageToSend.match(/slide\s+(\d+)/i);
      let targetSlideNumber = slideNumber;
      
      if (slideNumberMatch) {
        const mentionedSlide = parseInt(slideNumberMatch[1]) - 1; // Convert to 0-based index
        if (mentionedSlide >= 0 && mentionedSlide < totalSlides) {
          targetSlideNumber = mentionedSlide;
        }
      }

      // Prepare slide context for Gemini
      const slideContext = {
        currentSlide: slides[targetSlideNumber],
        previousSlide: targetSlideNumber > 0 ? slides[targetSlideNumber - 1] : null,
        nextSlide: targetSlideNumber < totalSlides - 1 ? slides[targetSlideNumber + 1] : null,
        slideNumber: targetSlideNumber,
        totalSlides: totalSlides
      };

      // Handle navigation commands first
      const input = messageToSend.toLowerCase();
      let botResponse;
      
      if (input.includes('next') || input.includes('continue')) {
        if (slideNumber < totalSlides - 1) {
          onSlideChange(slideNumber + 1);
          botResponse = "Moving to the next slide! 📊";
        } else {
          botResponse = "We're already on the last slide. Would you like me to review any previous concepts?";
        }
      } else if (input.includes('previous') || input.includes('back')) {
        if (slideNumber > 0) {
          onSlideChange(slideNumber - 1);
          botResponse = "Going back to the previous slide! ⬅️";
        } else {
          botResponse = "We're already on the first slide. Ready to move forward?";
        }
      } else if (input.includes('jump') || input.includes('go to')) {
        const numbers = messageToSend.match(/\d+/);
        if (numbers) {
          const slideNum = parseInt(numbers[0]) - 1;
          if (slideNum >= 0 && slideNum < totalSlides) {
            onSlideChange(slideNum);
            botResponse = `Jumping to slide ${slideNum + 1}! 🎯`;
          } else {
            botResponse = `Please specify a slide number between 1 and ${totalSlides}. For example: "Go to slide 3"`;
          }
        } else {
          botResponse = `Please specify a slide number between 1 and ${totalSlides}. For example: "Go to slide 3"`;
        }
      } else {
        // Use Gemini for content-based questions
        botResponse = await chatWithGemini(messageToSend, slideContext);
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Automatically speak the bot's response
      speakText(botResponse);
      
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your question right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 w-[400px] h-[600px] flex flex-col bg-slate-900/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 z-50">
      {/* Chatbot Header */}
      <div className="flex justify-between items-center p-4 bg-white/5 text-white rounded-t-2xl border-b border-white/10">
        <h3 className="text-lg font-semibold">AI Teacher</h3>
        <button 
          onClick={onClose} 
          className="text-white/70 hover:text-white"
          title="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Slide indicator */}
      <div className="px-4 py-2 bg-black/20 border-b border-white/10">
        <span className="text-xs text-blue-300 font-medium">
          Slide {slideNumber + 1} of {totalSlides}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed relative ${
                message.type === 'user'
                  ? 'bg-blue-500/80 text-white rounded-br-sm'
                  : 'bg-slate-700/80 text-white/90 rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.type === 'bot' && !isSpeaking && (
                <button
                  onClick={() => speakText(message.content)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-xs transition-colors text-white"
                  title="Read aloud"
                >
                  🔊
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700/80 text-gray-800 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Controls when speaking */}
      {isSpeaking && (
        <div className="px-4 py-3 bg-blue-900/30 border-t border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-300">🔊</span>
            <span className="text-sm text-blue-300">Reading response...</span>
          </div>
          <button
            onClick={stopSpeaking}
            className="text-xs bg-blue-600/80 text-white px-2 py-1 rounded hover:bg-blue-700/80 transition-colors"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 bg-black/20">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about the course content..."
              className="w-full p-3 bg-slate-800/90 border border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              disabled={isTyping}
            />
          </div>
          
          {speechSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-10 h-10 rounded-full border-none flex items-center justify-center text-white transition-all ${
                isListening 
                  ? 'bg-red-500/80 animate-pulse' 
                  : 'bg-slate-600/80 hover:bg-slate-500/80'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className={`w-10 h-10 rounded-full border-none flex items-center justify-center text-white transition-all ${
              inputMessage.trim() && !isTyping
                ? 'bg-blue-500/80 hover:bg-blue-600/80'
                : 'bg-slate-700/80 cursor-not-allowed'
            }`}
          >
            📤
          </button>
        </div>
        
        <div className="mt-2 text-xs text-slate-400 text-center">
          Ask questions about content or say "next/previous" to navigate
          {speechSupported && <span> • Click 🎤 for voice input</span>}
        </div>
      </div>
    </div>
  );
}
