"use client";

import { useState } from "react";
import { Nunito } from "next/font/google";
import { dummyFlashcardSet } from "./dummydata";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import QuestionRenderer from "@/components/QuestionRenderer";

const nunito = Nunito({ subsets: ["latin"] });

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [isShifting, setIsShifting] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const cards = dummyFlashcardSet.cards;
  const maxCards = 5;

  // Get 5 cards starting from current index
  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = 0; i < maxCards && currentIndex + i < cards.length; i++) {
      visibleCards.push(cards[currentIndex + i]);
    }
    return visibleCards;
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFalling(true);
      
      // Step 1: Start falling animation for first card
      setTimeout(() => {
        setIsShifting(true);
      }, 400); // Start shifting while first card is still falling
      
      // Step 2: After cards have shifted, update the array
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setIsFalling(false);
        setIsShifting(false);
      }, 800);
    }
  };

  const handleFlip = () => {
    setIsFlipping(true);
    setIsFlipped(!isFlipped);
    
    // Hide button during flip animation (0.75s as per CSS)
    setTimeout(() => {
      setIsFlipping(false);
    }, 750);
  };

  const visibleCards = getVisibleCards();

  return (
    <div className={`${nunito.className} min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Flashcards
            </span>
          </h1>
          <p className="text-lg text-white/70">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative w-full h-96 mb-8">
          {visibleCards.map((card, index) => {
            // Calculate transform based on current state
            const getTransform = () => {
              if (index === 0 && isFalling) {
                return 'translateX(0px) translateY(0px)'; // Keep first card in place during fall
              }
              
              if (isShifting && index > 0) {
                // During shifting, move cards to their new positions
                return `translateX(${(index - 1) * 8}px) translateY(${(index - 1) * 8}px)`;
              }
              
              // Normal stacking
              return `translateX(${index * 8}px) translateY(${index * 8}px)`;
            };

            return (
              <div
                key={`${card.id}-${currentIndex}-${index}`}
                className={`absolute w-full h-full transition-all duration-500 ${
                  index === 0 && isFalling ? 'animate-[fall_0.8s_ease-in-out_forwards]' : ''
                } ${
                  index === 0 && isFalling ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  zIndex: maxCards - index,
                  transform: getTransform(),
                }}
              >
                <div className="flip-card-container h-full">
                  <div className={`flip-card h-full cursor-pointer ${index === 0 && isFlipped ? 'flipped' : ''}`} onClick={index === 0 ? handleFlip : undefined}>
                    {/* Front of card */}
                    <div className="flip-card-front">
                      <Card className="w-full h-full bg-slate-800 border border-slate-700 shadow-2xl !p-0 !gap-0 hover:bg-slate-750 transition-all duration-300">
                        <CardContent className="p-8 w-full h-full !px-8">
                          <div className="text-center h-full flex flex-col justify-center">
                            <div className="text-lg font-semibold text-blue-400 mb-6">
                           Question
                            </div>
                            <div className="text-lg leading-relaxed text-white">
                              <QuestionRenderer>{card.front}</QuestionRenderer>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Back of card */}
                    <div className="flip-card-back">
                      <Card className="w-full h-full bg-slate-800 border border-slate-700 shadow-2xl !p-0 !gap-0 hover:bg-slate-750 transition-all duration-300">
                        <CardContent className="p-8 w-full h-full !px-8">
                          <div className="text-center h-full flex flex-col justify-center">
                            <div className="text-lg font-semibold text-purple-400 mb-6">
                              Answer
                            </div>
                            <div className="text-lg leading-relaxed text-white">
                              <QuestionRenderer>{card.back}</QuestionRenderer>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Next button in top right */}
                    {index === 0 && !isFlipping && (
                      <div className="absolute top-4 right-4 z-10">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card flip when clicking Next
                            handleNext();
                          }}
                          disabled={currentIndex >= cards.length - 1 || isFalling}
                          size="sm"
                          className="px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg backdrop-blur-xl border border-white/20"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
