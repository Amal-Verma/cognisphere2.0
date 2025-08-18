"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Nunito } from "next/font/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { generateRoadmap } from "../../utlis/generate/roadmap";
import Tesseract from 'tesseract.js';
import type { RoadmapNode } from "../../utlis/generate/type";

const nunito = Nunito({ subsets: ["latin"] });

// OCR function for images using Tesseract.js
async function extractTextFromImage(file: File): Promise<string> {
  try {
    const { data } = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log('OCR:', m)
    });
    return data.text || '';
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    return '';
  }
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  // Syllabus image attachments for OCR
  const [syllabusFiles, setSyllabusFiles] = useState<File[]>([]);
  const syllabusFileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    // Ensure prompt is provided
    const promptToUse = prompt.trim();
    if (!promptToUse) {
      setError("Please enter a prompt to generate your roadmap");
      return;
    }

    // Use the syllabus text directly (OCR text is already included from image processing)
    const syllabusToUse = syllabus.trim();

    setIsGenerating(true);
    setError("");

    try {
      const roadmapData: RoadmapNode[] = await generateRoadmap(promptToUse, syllabusToUse);
      
      // Still store in localStorage for backward compatibility
      localStorage.setItem("generatedRoadmap", JSON.stringify(roadmapData));
      localStorage.setItem("roadmapPrompt", promptToUse);
      localStorage.setItem("roadmapSyllabus", syllabusToUse);
      localStorage.setItem("roadmapGeneratedAt", new Date().toISOString());
      localStorage.setItem("roadmapCurrentIndex", "0");
      
      // Navigate to roadmap page
      router.push("/roadmap");
    } catch (err) {
      console.error("Error generating roadmap:", err);
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`${nunito.className} min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-purple-50`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl sm:text-5xl font-extrabold">
              Generate Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Learning Roadmap
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe what you want to learn and we&apos;ll create a personalized, step-by-step learning path for you.
          </p>
        </div>

        {/* Generate Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="w-6 h-6 text-blue-500" />
              Create Your Learning Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-base font-semibold text-gray-700">
                What do you want to learn? *
              </Label>
              <Textarea
                id="prompt"
                placeholder="e.g., I want to learn machine learning from basics to advanced, focusing on practical applications..."
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                className="min-h-[120px] text-base border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            {/* Syllabus Input with Image Attachments */}
            {/* Hidden file input for syllabus images */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={syllabusFileInputRef}
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                const imgs = files.filter(f => f.type.startsWith('image/'));
                
                if (imgs.length) {
                  setSyllabusFiles(prev => [...prev, ...imgs]);
                  
                  // Process OCR for each image and append to syllabus textarea
                  for (const file of imgs) {
                    try {
                      const extractedText = await extractTextFromImage(file);
                      if (extractedText.trim()) {
                        setSyllabus(prev => {
                          const separator = prev.trim() ? '\n\n' : '';
                          return prev + separator + `--- Text from ${file.name} ---\n${extractedText.trim()}`;
                        });
                      }
                    } catch (error) {
                      console.error(`OCR failed for ${file.name}:`, error);
                      // Optionally show a toast or error message to user
                    }
                  }
                }
                
                if (syllabusFileInputRef.current) syllabusFileInputRef.current.value = '';
              }}
            />
            <div className="space-y-2">
              <Label htmlFor="syllabus" className="text-base font-semibold text-gray-700 flex justify-between items-center">
                Syllabus or Course Outline (Optional)
                <Button size="sm" onClick={() => syllabusFileInputRef.current?.click()} className="text-sm">
                  📷 Attach Images
                </Button>
              </Label>
              {/* Attached syllabus images preview */}
              {syllabusFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {syllabusFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center bg-gray-100 px-3 py-1 rounded text-sm">
                      <span className="truncate max-w-xs">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setSyllabusFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Remove"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              <Textarea
                id="syllabus"
                placeholder="Paste your course syllabus or curriculum outline here. You can also attach images above - text will be automatically extracted and added here."
                value={syllabus}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSyllabus(e.target.value)}
                onPaste={async (e) => {
                  const items = Array.from(e.clipboardData.items);
                  const imgs: File[] = [];
                  
                  for (const item of items) {
                    if (item.kind === 'file') {
                      const file = item.getAsFile();
                      if (file && file.type.startsWith('image/')) {
                        imgs.push(file);
                      }
                    }
                  }
                  
                  if (imgs.length) {
                    e.preventDefault();
                    setSyllabusFiles(prev => [...prev, ...imgs]);
                    
                    // Process OCR for pasted images and append to textarea
                    for (const file of imgs) {
                      try {
                        const extractedText = await extractTextFromImage(file);
                        if (extractedText.trim()) {
                          setSyllabus(prev => {
                            const separator = prev.trim() ? '\n\n' : '';
                            return prev + separator + `--- Text from pasted image ---\n${extractedText.trim()}`;
                          });
                        }
                      } catch (error) {
                        console.error(`OCR failed for pasted image:`, error);
                      }
                    }
                  }
                }}
                className="min-h-[100px] text-base border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
              <p className="text-sm text-gray-500">
                Adding a syllabus helps create a more targeted roadmap. Attach images to automatically extract text via OCR.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-6 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Learning Roadmap
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for better results:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific about your current knowledge level (beginner, intermediate, advanced)</li>
                <li>• Mention your goals (career change, exam preparation, hobby project, etc.)</li>
                <li>• Include any time constraints or preferred learning pace</li>
                <li>• Specify if you want practical projects or theoretical focus</li>
                <li>• The AI will create a mix of course content and assessments for balanced learning</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
            Need inspiration? Try these examples:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/60 border-gray-200 hover:bg-white/80 transition-all cursor-pointer"
                  onClick={() => setPrompt("I want to learn web development from scratch. I'm a complete beginner and want to build modern, responsive websites. Focus on practical projects and current industry standards.")}>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-800 mb-2">🌐 Web Development</h4>
                <p className="text-sm text-gray-600">Learn modern web development from HTML/CSS to React and backend technologies</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 border-gray-200 hover:bg-white/80 transition-all cursor-pointer"
                  onClick={() => setPrompt("I want to master machine learning and AI. I have basic Python knowledge but I'm new to ML. I want to understand both theory and practical applications, with hands-on projects.")}>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-800 mb-2">🤖 Machine Learning</h4>
                <p className="text-sm text-gray-600">Master AI and ML concepts with practical implementations and real-world projects</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
