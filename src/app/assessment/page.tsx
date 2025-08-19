
'use client';
import { useState, useEffect, useCallback } from 'react';
import { dummyAssessmentData, dummyAssessmentState, AssessmentData } from './dummydata';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Brain,
  Timer,
  AlertCircle,
  PlayCircle,
  RotateCcw,
  BookOpen,
  Sparkles
} from 'lucide-react'

// Simple QuestionRenderer component
const QuestionRenderer = ({ children }: { children: string }) => {
  return (
    <div className="prose prose-sm max-w-none prose-invert text-slate-200">
      <div 
        className="text-slate-200 leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: children
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300 font-semibold">$1</strong>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-700/50 text-blue-300 px-1 py-0.5 rounded text-sm">$1</code>')
            .replace(/### (.*?)(\n|$)/g, '<h3 class="text-xl font-bold text-white mb-2 mt-4">$1</h3>')
            .replace(/## (.*?)(\n|$)/g, '<h2 class="text-2xl font-bold text-white mb-3 mt-4">$1</h2>')
            .replace(/# (.*?)(\n|$)/g, '<h1 class="text-3xl font-bold text-white mb-4 mt-4">$1</h1>')
            .replace(/> (.*?)(\n|$)/g, '<blockquote class="border-l-4 border-blue-400 pl-4 italic text-slate-300 my-2">$1</blockquote>')
            .replace(/\n/g, '<br/>') 
        }} 
      />
    </div>
  );
};

export default function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[][]>([]);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes default
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Load assessment data from localStorage or use dummy data in demo mode
  useEffect(() => {
    try {
      // Check if demo mode is enabled via URL hash
      const isDemoMode = typeof window !== 'undefined' && window.location.hash.includes('demo=true');
      
      if (isDemoMode) {
        // Store dummy data in localStorage with specific dummy variable names
        localStorage.setItem("dummyAssessmentData", JSON.stringify(dummyAssessmentData));
        localStorage.setItem("dummyAssessmentState", JSON.stringify(dummyAssessmentState));
        
        // Load from dummy localStorage variables in demo mode
        const dummySavedAssessment = localStorage.getItem("dummyAssessmentData");
        const dummySavedState = localStorage.getItem("dummyAssessmentState");
        
        if (dummySavedAssessment) {
          const parsedAssessment: AssessmentData = JSON.parse(dummySavedAssessment);
          setAssessmentData(parsedAssessment);
          setUserAnswers(new Array(parsedAssessment.questions.length).fill([]));
          
          if (dummySavedState) {
            const state = JSON.parse(dummySavedState);
            setCurrentQuestionIndex(state.currentQuestionIndex);
            setTimeRemaining(state.timeRemaining);
            setIsTestStarted(state.isTestStarted);
            setIsTestCompleted(state.isTestCompleted);
            setScore(state.score);
            setShowResults(state.showResults);
          }
        } else {
          // Fallback to original dummy data
          setAssessmentData(dummyAssessmentData);
          setCurrentQuestionIndex(dummyAssessmentState.currentQuestionIndex);
          setUserAnswers(new Array(dummyAssessmentData.questions.length).fill([]));
          setTimeRemaining(dummyAssessmentState.timeRemaining);
          setIsTestStarted(dummyAssessmentState.isTestStarted);
          setIsTestCompleted(dummyAssessmentState.isTestCompleted);
          setScore(dummyAssessmentState.score);
          setShowResults(dummyAssessmentState.showResults);
        }
      } else {
        // Try to load from localStorage (for real assessment data)
        const savedAssessment = localStorage.getItem("currentAssessment");
        const savedProgress = localStorage.getItem("assessmentProgress");
        
        if (savedAssessment) {
          const parsedAssessment: AssessmentData = JSON.parse(savedAssessment);
          setAssessmentData(parsedAssessment);
          setUserAnswers(new Array(parsedAssessment.questions.length).fill([]));
          
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
            setUserAnswers(progress.userAnswers || new Array(parsedAssessment.questions.length).fill([]));
            setTimeRemaining(progress.timeRemaining || 900);
            setIsTestStarted(progress.isTestStarted || false);
            setIsTestCompleted(progress.isTestCompleted || false);
            setScore(progress.score || 0);
            setShowResults(progress.showResults || false);
          }
        }
        // If no saved assessment, assessmentData remains null (empty state)
      }
    } catch (error) {
      console.error("Error loading assessment data:", error);
      // assessmentData remains null (empty state)
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for hash changes to handle demo mode
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined' && window.location.hash.includes('demo=true')) {
        // Store dummy data in localStorage with specific dummy variable names
        localStorage.setItem("dummyAssessmentData", JSON.stringify(dummyAssessmentData));
        localStorage.setItem("dummyAssessmentState", JSON.stringify(dummyAssessmentState));
        
        // Load dummy data if demo mode is activated
        const dummySavedAssessment = localStorage.getItem("dummyAssessmentData");
        const dummySavedState = localStorage.getItem("dummyAssessmentState");
        
        if (dummySavedAssessment) {
          const parsedAssessment: AssessmentData = JSON.parse(dummySavedAssessment);
          setAssessmentData(parsedAssessment);
          setUserAnswers(new Array(parsedAssessment.questions.length).fill([]));
          
          if (dummySavedState) {
            const state = JSON.parse(dummySavedState);
            setCurrentQuestionIndex(state.currentQuestionIndex);
            setTimeRemaining(state.timeRemaining);
            setIsTestStarted(state.isTestStarted);
            setIsTestCompleted(state.isTestCompleted);
            setScore(state.score);
            setShowResults(state.showResults);
          }
        } else {
          // Fallback to original dummy data
          setAssessmentData(dummyAssessmentData);
          setCurrentQuestionIndex(dummyAssessmentState.currentQuestionIndex);
          setUserAnswers(new Array(dummyAssessmentData.questions.length).fill([]));
          setTimeRemaining(dummyAssessmentState.timeRemaining);
          setIsTestStarted(dummyAssessmentState.isTestStarted);
          setIsTestCompleted(dummyAssessmentState.isTestCompleted);
          setScore(dummyAssessmentState.score);
          setShowResults(dummyAssessmentState.showResults);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const calculateScore = useCallback(() => {
    if (!assessmentData) return;
    
    let totalScore = 0

    assessmentData.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index] || []
      const correctAnswer = question.answers

      if (userAnswer.length === 0) return // No answer given

      // Simple scoring: 1 point only if all correct answers are selected and no wrong answers
      const userAnswerSorted = [...userAnswer].sort()
      const correctAnswerSorted = [...correctAnswer].sort()

      // Check if arrays are exactly equal
      if (userAnswerSorted.length === correctAnswerSorted.length &&
        userAnswerSorted.every((val, i) => val === correctAnswerSorted[i])) {
        totalScore += 1
      }
    })

    setScore(totalScore)
  }, [assessmentData, userAnswers])

  // Helper function to calculate score immediately (without setState delay)
  const calculateFinalScore = useCallback(() => {
    if (!assessmentData) return 0;
    
    let totalScore = 0

    assessmentData.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index] || []
      const correctAnswer = question.answers

      if (userAnswer.length === 0) return // No answer given

      // Simple scoring: 1 point only if all correct answers are selected and no wrong answers
      const userAnswerSorted = [...userAnswer].sort()
      const correctAnswerSorted = [...correctAnswer].sort()

      // Check if arrays are exactly equal
      if (userAnswerSorted.length === correctAnswerSorted.length &&
        userAnswerSorted.every((val, i) => val === correctAnswerSorted[i])) {
        totalScore += 1
      }
    })

    return totalScore
  }, [assessmentData, userAnswers])

  // Helper function to advance current index in roadmap
  const advanceCurrentIndex = useCallback(() => {
    try {
      const isDemoMode = typeof window !== 'undefined' && window.location.hash.includes('demo=true')
      
      if (isDemoMode) {
        // Update dummy current index
        const currentDummyIndex = parseInt(localStorage.getItem("dummyRoadmapCurrentIndex") || "0", 10)
        const newDummyIndex = currentDummyIndex + 1
        localStorage.setItem("dummyRoadmapCurrentIndex", newDummyIndex.toString())
      } else {
        // Update regular current index
        const currentIndex = parseInt(localStorage.getItem("roadmapCurrentIndex") || "0", 10)
        const newIndex = currentIndex + 1
        localStorage.setItem("roadmapCurrentIndex", newIndex.toString())
      }
    } catch (error) {
      console.error("Error advancing current index:", error)
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (!isTestStarted || isTestCompleted || !assessmentData) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTestCompleted(true)
          calculateScore()
          setShowResults(true)
          
          // Check if user scored 60% or higher to advance to next node when time runs out
          const maxPossibleScore = assessmentData?.questions.length || 0
          const finalScore = calculateFinalScore() // Calculate score immediately
          const percentage = maxPossibleScore > 0 ? (finalScore / maxPossibleScore) * 100 : 0
          
          if (percentage >= 60) {
            advanceCurrentIndex()
          }
          
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTestStarted, isTestCompleted, calculateScore, assessmentData, calculateFinalScore, advanceCurrentIndex])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (!assessmentData) return;
    
    const newUserAnswers = [...userAnswers]
    const currentAnswers = newUserAnswers[currentQuestionIndex] || []

    if (currentAnswers.includes(optionIndex)) {
      // Remove option if already selected
      newUserAnswers[currentQuestionIndex] = currentAnswers.filter(index => index !== optionIndex)
    } else {
      // Add option to selection
      newUserAnswers[currentQuestionIndex] = [...currentAnswers, optionIndex].sort()
    }

    setUserAnswers(newUserAnswers)
  }

  const handleNextQuestion = () => {
    if (!assessmentData) return;
    
    if (currentQuestionIndex < assessmentData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitTest = () => {
    setIsTestCompleted(true)
    calculateScore()
    setShowResults(true)
    
    // Check if user scored 60% or higher to advance to next node
    const maxPossibleScore = assessmentData?.questions.length || 0
    const finalScore = calculateFinalScore() // Calculate score immediately
    const percentage = maxPossibleScore > 0 ? (finalScore / maxPossibleScore) * 100 : 0
    
    if (percentage >= 60) {
      advanceCurrentIndex()
    }
  }

  const handleStartTest = () => {
    if (!assessmentData) return;
    
    setIsTestStarted(true)
    setUserAnswers(new Array(assessmentData.questions.length).fill([]))
    setCurrentQuestionIndex(0)
    setTimeRemaining(900) // 15 minutes
  }

  const getProgress = () => {
    if (!assessmentData) return 0;
    
    const answeredQuestions = userAnswers.filter(answer => answer.length > 0).length
    return (answeredQuestions / assessmentData.questions.length) * 100
  }

  const currentQuestion = assessmentData?.questions[currentQuestionIndex]

  // Early returns for loading and empty states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Assessment Available
            </h2>
            <p className="text-slate-300 mb-6">
              No assessment data found. Please complete a course first or check your roadmap for available assessments.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/roadmap#demo=true'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white backdrop-blur-sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Go to Roadmap
              </Button>
              <Button 
                onClick={() => window.location.href = '/assessment#demo=true'}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try Demo Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results component
  const ResultsDisplay = () => {
    if (!assessmentData) return null;
    
    const maxPossibleScore = assessmentData.questions.length
    const percentage = Math.round((score / maxPossibleScore) * 100)
    
    const getGradeColor = () => {
      if (percentage >= 80) return 'text-emerald-400'
      if (percentage >= 60) return 'text-yellow-400'
      return 'text-red-400'
    }

    const getGradeText = () => {
      if (percentage >= 80) return 'Excellent!'
      if (percentage >= 60) return 'Good Job!'
      return 'Keep Learning!'
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>
              <CardTitle className="text-3xl mb-2 text-white">Assessment Complete!</CardTitle>
              <CardDescription className="text-lg text-slate-300">Here are your results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${getGradeColor()}`}>
                  {percentage}%
                </div>
                <div className={`text-2xl font-semibold ${getGradeColor()}`}>
                  {getGradeText()}
                </div>
                <div className="text-slate-300 mt-2">
                  You scored {score} out of {maxPossibleScore} questions correctly
                </div>
              </div>

              <Separator className="my-6 bg-slate-600/40" />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-white">Question Review</h3>
                {assessmentData.questions.map((question, index) => {
                  const userAnswer = userAnswers[index] || []
                  const correctAnswer = question.answers
                  const isCorrect = userAnswer.length === correctAnswer.length &&
                    userAnswer.every(val => correctAnswer.includes(val))
                  
                  return (
                    <Card key={index} className={`border-l-4 backdrop-blur-sm ${
                      isCorrect 
                        ? 'border-l-emerald-400 bg-emerald-500/10 border-emerald-400/30' 
                        : 'border-l-red-400 bg-red-500/10 border-red-400/30'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium mb-2 text-white">
                              Question {index + 1}
                            </div>
                            <div className="text-slate-200">
                              <QuestionRenderer>{question.question}</QuestionRenderer>
                            </div>
                            <div className="mt-3 space-y-2">
                              {question.options.map((option, optionIndex) => {
                                const isSelected = userAnswer.includes(optionIndex)
                                const isCorrectOption = correctAnswer.includes(optionIndex)
                                
                                return (
                                  <div key={optionIndex} className={`p-2 rounded border backdrop-blur-sm ${
                                    isCorrectOption ? 'bg-emerald-500/20 border-emerald-400/40' :
                                    isSelected ? 'bg-red-500/20 border-red-400/40' :
                                    'bg-slate-700/50 border-slate-600/40'
                                  }`}>
                                    <div className="flex items-center gap-2">
                                      {isCorrectOption && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                      {isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-red-400" />}
                                      <span className={`${isCorrectOption ? 'font-medium text-white' : 'text-slate-200'}`}>
                                        {option}
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="text-center mt-8">
                <Button 
                  onClick={() => window.location.href = '/roadmap#demo=true'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white backdrop-blur-sm"
                >
                  Back to Roadmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show results if test is completed
  if (showResults) {
    return <ResultsDisplay />
  }

  // Pre-test screen
  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="w-16 h-16 text-blue-400" />
            </div>
            <CardTitle className="text-3xl mb-2 text-white">Ready for Assessment?</CardTitle>
            <CardDescription className="text-lg text-slate-300">
              Test your knowledge with {assessmentData.questions.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="font-medium text-white">Duration</div>
                <div className="text-slate-300">15 minutes</div>
              </div>
              <div className="text-center p-4 bg-emerald-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30">
                <Brain className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <div className="font-medium text-white">Questions</div>
                <div className="text-slate-300">{assessmentData.questions.length} total</div>
              </div>
              <div className="text-center p-4 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-400/30">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="font-medium text-white">Passing Score</div>
                <div className="text-slate-300">60%</div>
              </div>
            </div>

            <Separator className="bg-slate-600/40" />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-white">Instructions:</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Read each question carefully
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Some questions may have multiple correct answers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  You can navigate between questions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Submit when you&apos;re ready or when time runs out
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleStartTest}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white backdrop-blur-sm shadow-lg"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main assessment interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer and progress */}
        <Card className="mb-6 bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2 border-blue-400/40 text-blue-300">
                  <Timer className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Brain className="w-4 h-4" />
                  <span>Question {currentQuestionIndex + 1} of {assessmentData.questions.length}</span>
                </div>
              </div>
              <Button 
                onClick={handleSubmitTest}
                variant="outline"
                size="sm"
                className="text-blue-300 border-blue-400/40 hover:bg-blue-500/20 backdrop-blur-sm bg-slate-700/30"
              >
                Submit Test
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                <span>Progress</span>
                <span>
                  Answered: {userAnswers.filter(answer => answer.length > 0).length} of {assessmentData.questions.length}
                </span>
              </div>
              <Progress value={getProgress()} className="h-2 bg-slate-700/50" />
            </div>
          </CardContent>
        </Card>

        {/* Question navigation */}
        <Card className="mb-6 bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {assessmentData.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 ${
                    index === currentQuestionIndex
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : userAnswers[index] && userAnswers[index].length > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                      : 'border-slate-600/40 text-slate-300 hover:bg-slate-700/50 bg-slate-700/30'
                  } backdrop-blur-sm`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current question */}
        {currentQuestion && (
          <Card className="mb-6 bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white">Question {currentQuestionIndex + 1}</CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1 bg-slate-700/50 text-slate-300">
                  <AlertCircle className="w-3 h-3" />
                  {currentQuestion.answers.length > 1 ? 'Multiple answers may be correct' : 'Select the correct answer'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-slate-200">
                <QuestionRenderer>{currentQuestion.question}</QuestionRenderer>
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <Button
                      variant={userAnswers[currentQuestionIndex]?.includes(index) ? "default" : "outline"}
                      className={`w-full p-4 h-auto text-left justify-start backdrop-blur-sm ${
                        userAnswers[currentQuestionIndex]?.includes(index)
                          ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400'
                          : 'border-slate-600/40 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200'
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          userAnswers[currentQuestionIndex]?.includes(index)
                            ? 'bg-white border-white'
                            : 'bg-slate-600/50 border-slate-500'
                        }`}>
                          {userAnswers[currentQuestionIndex]?.includes(index) && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <span className={`flex-1 ${
                          userAnswers[currentQuestionIndex]?.includes(index)
                            ? 'text-white'
                            : 'text-slate-200'
                        }`}>{option}</span>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="border-slate-600/40 text-slate-300 hover:bg-slate-700/50 backdrop-blur-sm"
              >
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === assessmentData.questions.length - 1}
                className="bg-blue-500 hover:bg-blue-600 text-white backdrop-blur-sm"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
