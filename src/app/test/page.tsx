"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Users, BarChart3, MessageCircle, Presentation, Map, Shield, Check, Menu, X, Star, ArrowRight, Zap, Target, Sparkles, Plus, Search, Filter, Clock, TrendingUp, Award, Play, Edit, Trash2, Upload, FileText, Video, Headphones, ChevronRight, Settings, Bell, User, LogOut, Home, Library, PlusCircle, BarChart, HelpCircle } from 'lucide-react';

function Test() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  // Mock data for dashboard
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Advanced Machine Learning',
      description: 'Deep dive into neural networks, transformers, and modern AI architectures',
      progress: 75,
      modules: 12,
      completedModules: 9,
      timeSpent: '24h 30m',
      difficulty: 'Advanced',
      category: 'AI & ML',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastAccessed: '2 hours ago',
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Quantum Physics Fundamentals',
      description: 'Understanding quantum mechanics from first principles',
      progress: 45,
      modules: 8,
      completedModules: 4,
      timeSpent: '16h 15m',
      difficulty: 'Intermediate',
      category: 'Physics',
      thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastAccessed: '1 day ago',
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'Renaissance Art History',
      description: 'Exploring the masters and movements of the Renaissance period',
      progress: 100,
      modules: 6,
      completedModules: 6,
      timeSpent: '12h 45m',
      difficulty: 'Beginner',
      category: 'History',
      thumbnail: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastAccessed: '3 days ago',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Modern JavaScript Development',
      description: 'ES6+, React, Node.js, and modern web development practices',
      progress: 30,
      modules: 15,
      completedModules: 5,
      timeSpent: '8h 20m',
      difficulty: 'Intermediate',
      category: 'Programming',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastAccessed: '5 hours ago',
      status: 'In Progress'
    }
  ]);

  const [stats, setStats] = useState({
    totalCourses: 4,
    completedCourses: 1,
    totalHours: 61.5,
    currentStreak: 12,
    averageScore: 87,
    certificates: 3
  });

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Pricing', id: 'pricing' }
  ];

  const dashboardNavigation = [
    { name: 'Dashboard', id: 'dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'My Courses', id: 'courses', icon: <Library className="w-5 h-5" /> },
    { name: 'Create Course', id: 'create', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Analytics', id: 'analytics', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Help', id: 'help', icon: <HelpCircle className="w-5 h-5" /> }
  ];

  const features = [
    {
      id: 'study-library',
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Personal Study Library',
      description: 'Upload and organize your study materials into a comprehensive knowledge repository that powers all AI-generated content.',
      details: 'Transform your PDFs, presentations, and documents into a searchable, AI-ready library. Our advanced document processing ensures every piece of content becomes part of your personalized learning ecosystem.'
    },
    {
      id: 'ai-presentation',
      icon: <Presentation className="w-8 h-8" />,
      title: 'AI-Powered Presentations',
      description: 'Automatically generate professional presentations from your study materials with structured slides and speaker notes.',
      details: 'Our RAG system extracts key concepts and creates logically flowing presentations. Each slide includes comprehensive speaker notes, making complex topics accessible and engaging.'
    },
    {
      id: 'socratic-assistant',
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Socratic AI Assistant',
      description: 'Get instant answers and guidance from an AI tutor that knows your study materials inside and out.',
      details: 'Ask questions, seek clarification, or explore related concepts. The assistant uses your personal library to provide contextually accurate responses tailored to your learning journey.'
    },
    {
      id: 'interactive-learning',
      icon: <Brain className="w-8 h-8" />,
      title: 'Interactive Learning Interface',
      description: 'Experience lessons through an engaging, multimedia interface that adapts to your learning pace.',
      details: 'Clean, focused interface with synchronized content and narration. Visual progress indicators and interactive elements keep you engaged throughout each lesson.'
    },
    {
      id: 'dynamic-assessment',
      icon: <Target className="w-8 h-8" />,
      title: 'Dynamic Assessments',
      description: 'AI-generated quizzes and tests that adapt to your progress and identify knowledge gaps.',
      details: 'Personalized assessments that evolve with your learning. Automatic remedial content generation when struggles are detected, ensuring no concept is left behind.'
    },
    {
      id: 'roadmap-tracking',
      icon: <Map className="w-8 h-8" />,
      title: 'Learning Roadmap Tracking',
      description: 'Visual progress tracking with detailed analytics showing your strengths, weaknesses, and achievements.',
      details: 'Comprehensive dashboard displaying your learning journey. Track mastery levels, time spent on topics, and receive personalized recommendations for optimal study paths.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Freemium',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for exploring CogniSphere',
      features: [
        'Limited course generation',
        'Public knowledge base access',
        '50 AI credits per month',
        'Basic progress tracking',
        'Community support'
      ],
      color: 'border-white/20',
      popular: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'For serious learners and students',
      features: [
        'Unlimited course creation',
        'Personal document uploads',
        '1000 AI credits per month',
        'Advanced analytics',
        'Priority support',
        'Export functionality'
      ],
      color: 'border-blue-400/50',
      popular: true
    },
    {
      name: 'Institutional',
      price: 'Custom',
      period: 'pricing',
      description: 'For schools and organizations',
      features: [
        'Volume discounts',
        'Administrative dashboard',
        'Custom branding',
        'Dedicated support',
        'User group monitoring',
        'API access'
      ],
      color: 'border-purple-400/50',
      popular: false
    }
  ];

  const CreateCourseModal = () => {
    if (!isCreateCourseOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 w-full max-w-2xl relative shadow-2xl">
          <button
            onClick={() => setIsCreateCourseOpen(false)}
            className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Plus className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Create New Course
            </h2>
            <p className="text-white/70">
              Generate a personalized learning experience with AI
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Course Topic
              </label>
              <input
                type="text"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                placeholder="e.g., Machine Learning Fundamentals"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Learning Goals
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all resize-none"
                placeholder="Describe what you want to learn and achieve..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Difficulty Level
                </label>
                <select className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all">
                  <option value="beginner" className="bg-gray-900">Beginner</option>
                  <option value="intermediate" className="bg-gray-900">Intermediate</option>
                  <option value="advanced" className="bg-gray-900">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Duration
                </label>
                <select className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all">
                  <option value="1-week" className="bg-gray-900">1 Week</option>
                  <option value="2-weeks" className="bg-gray-900">2 Weeks</option>
                  <option value="1-month" className="bg-gray-900">1 Month</option>
                  <option value="3-months" className="bg-gray-900">3 Months</option>
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-white/30 transition-colors">
              <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-2">Upload your study materials</p>
              <p className="text-white/50 text-sm">PDFs, presentations, documents (optional)</p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Generate Course with AI
            </button>
          </form>
        </div>
      </div>
    );
  };

  const AuthModal = () => {
    if (!isLoginOpen && !isSignupOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
          <button
            onClick={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(false);
            }}
            className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back!' : 'Join CogniSphere'}
            </h2>
            <p className="text-white/70">
              {isLogin ? 'Sign in to continue your learning journey' : 'Start your personalized learning experience'}
            </p>
          </div>

          <form className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsLoggedIn(true);
                setIsLoginOpen(false);
                setIsSignupOpen(false);
                setCurrentPage('dashboard');
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-white/70">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setIsLoginOpen(!isLogin);
                  setIsSignupOpen(isLogin);
                }}
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const DashboardPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white/5 backdrop-blur-3xl border-r border-white/10">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold text-white ml-3">CogniSphere</span>
            </div>
            
            <nav className="space-y-2">
              {dashboardNavigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium text-sm">Alex Johnson</p>
                  <p className="text-white/50 text-xs">Pro Member</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentPage('home');
                }}
                className="w-full flex items-center justify-center px-3 py-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {currentPage === 'dashboard' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Alex!</h1>
                  <p className="text-white/70 text-lg">Continue your learning journey</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white/70 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white/70 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Courses', value: stats.totalCourses, icon: <BookOpen className="w-6 h-6" />, color: 'from-blue-500/20 to-cyan-500/20' },
                  { label: 'Completed', value: stats.completedCourses, icon: <Award className="w-6 h-6" />, color: 'from-green-500/20 to-emerald-500/20' },
                  { label: 'Study Hours', value: `${stats.totalHours}h`, icon: <Clock className="w-6 h-6" />, color: 'from-purple-500/20 to-pink-500/20' },
                  { label: 'Current Streak', value: `${stats.currentStreak} days`, icon: <TrendingUp className="w-6 h-6" />, color: 'from-orange-500/20 to-red-500/20' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-white/20`}>
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Courses */}
              <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
                  <button 
                    onClick={() => setCurrentPage('courses')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses.filter(course => course.status === 'In Progress').slice(0, 2).map((course) => (
                    <div key={course.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{course.title}</h3>
                          <p className="text-white/70 text-sm mb-3">{course.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <span>{course.completedModules}/{course.modules} modules</span>
                            <span>{course.timeSpent}</span>
                          </div>
                        </div>
                        <button className="p-2 bg-blue-500/20 backdrop-blur-xl rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors">
                          <Play className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => setIsCreateCourseOpen(true)}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
                >
                  <Plus className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">Create New Course</h3>
                  <p className="text-white/70">Generate AI-powered learning content</p>
                </button>
                
                <button className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group">
                  <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI Tutor Chat</h3>
                  <p className="text-white/70">Get instant help and guidance</p>
                </button>
                
                <button 
                  onClick={() => setCurrentPage('analytics')}
                  className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group"
                >
                  <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">View Analytics</h3>
                  <p className="text-white/70">Track your learning progress</p>
                </button>
              </div>
            </div>
          )}

          {currentPage === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">My Courses</h1>
                  <p className="text-white/70 text-lg">Manage and continue your learning journey</p>
                </div>
                <button 
                  onClick={() => setIsCreateCourseOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Course
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2">
                    <Search className="w-5 h-5 text-white/50 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Search courses..." 
                      className="bg-transparent text-white placeholder-white/50 outline-none flex-1"
                    />
                  </div>
                  <button className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 text-white/70 hover:text-white transition-colors">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          course.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white/90 text-sm mb-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{course.title}</h3>
                          <p className="text-white/70 text-sm mb-3 line-clamp-2">{course.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                        <span>{course.modules} modules</span>
                        <span>{course.difficulty}</span>
                        <span>{course.timeSpent}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium">
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </button>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-white/50 hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-white/50 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentPage === 'analytics' && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Learning Analytics</h1>
                <p className="text-white/70 text-lg">Track your progress and performance insights</p>
              </div>

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Learning Progress</h3>
                  <div className="space-y-6">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">{course.title}</p>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-white/70 ml-4 font-medium">{course.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Performance Metrics</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Average Score</span>
                      <span className="text-2xl font-bold text-green-400">{stats.averageScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Study Streak</span>
                      <span className="text-2xl font-bold text-blue-400">{stats.currentStreak} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Certificates Earned</span>
                      <span className="text-2xl font-bold text-purple-400">{stats.certificates}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Total Study Time</span>
                      <span className="text-2xl font-bold text-orange-400">{stats.totalHours}h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Weekly Activity</h3>
                <div className="grid grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="text-center">
                      <p className="text-white/70 text-sm mb-2">{day}</p>
                      <div className={`h-20 rounded-2xl ${
                        index < 5 ? 'bg-gradient-to-t from-blue-500/30 to-blue-500/10' : 'bg-white/5'
                      } border border-white/10`}></div>
                      <p className="text-white/50 text-xs mt-2">{index < 5 ? `${2 + index}h` : '0h'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl">
              <Brain className="w-20 h-20 text-blue-400" />
            </div>
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold text-white mb-8 leading-tight">
            Learn Smarter with
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CogniSphere
            </span>
          </h1>
          <p className="text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform any topic into an engaging, personalized learning experience. Upload your materials or explore our knowledge base to create adaptive curricula tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl rounded-3xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl backdrop-blur-xl border border-white/20 hover:scale-105"
            >
              Start Learning Free <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentPage('features')}
              className="px-10 py-5 bg-white/10 backdrop-blur-3xl text-white font-bold text-xl rounded-3xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-6 lg:px-8 py-32 relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Revolutionize Your Learning Experience
            </h2>
            <p className="text-2xl text-blue-100 max-w-4xl mx-auto">
              Harness the power of AI to create personalized learning paths, interactive content, and adaptive assessments that evolve with your progress.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(0, 6).map((feature, index) => (
              <div key={feature.id} 
                   className="p-10 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-500 group hover:scale-105 shadow-2xl">
                <div className="text-blue-400 mb-6 group-hover:text-blue-300 transition-colors group-hover:scale-110 transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-blue-100 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-32 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="p-16 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
              <Sparkles className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of learners who have already discovered the power of AI-driven education. Start your personalized learning journey today.
            </p>
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-2xl rounded-3xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const FeaturesPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-8">
            Powerful Features for
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Personalized Learning</span>
          </h1>
          <p className="text-2xl text-blue-100 max-w-4xl mx-auto">
            Discover how CogniSphere's advanced AI technologies create an unparalleled learning experience tailored to your unique needs and goals.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <div key={feature.id} className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center mb-8">
                  <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl text-blue-400 rounded-3xl mr-6 border border-white/20">
                    {feature.icon}
                  </div>
                  <h2 className="text-4xl font-bold text-white">
                    {feature.title}
                  </h2>
                </div>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  {feature.description}
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  {feature.details}
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-3xl p-16 rounded-[3rem] border border-white/20 shadow-2xl">
                  <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/20">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl"></div>
                        <div className="ml-4">
                          <div className="w-24 h-4 bg-white/20 rounded-xl"></div>
                          <div className="w-20 h-3 bg-white/10 rounded-lg mt-2"></div>
                        </div>
                      </div>
                      <div className="text-blue-400">{feature.icon}</div>
                    </div>
                    <div className="space-y-4">
                      <div className="w-full h-4 bg-white/10 rounded-xl"></div>
                      <div className="w-4/5 h-4 bg-white/10 rounded-xl"></div>
                      <div className="w-full h-4 bg-blue-500/20 rounded-xl"></div>
                      <div className="w-3/4 h-4 bg-white/10 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HowItWorksPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-8">
            How CogniSphere Works
          </h1>
          <p className="text-2xl text-blue-100 max-w-4xl mx-auto">
            From uploading your first document to mastering new subjects, here's your complete journey through our AI-powered learning ecosystem.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          
          <div className="space-y-24">
            {[
              {
                step: '01',
                title: 'Upload Your Materials',
                description: 'Start by uploading your study materials - PDFs, presentations, documents, or simply enter a topic you want to learn.',
                details: 'Our advanced document processing system analyzes and chunks your content, creating a comprehensive knowledge base that serves as the foundation for all AI-generated content.',
                icon: <BookOpen className="w-10 h-10" />
              },
              {
                step: '02',
                title: 'AI Generates Your Roadmap',
                description: 'Our AI analyzes your content and creates a personalized learning roadmap with structured modules and clear objectives.',
                details: 'Using Retrieval-Augmented Generation (RAG) and the Gemini 2.0 Flash model, we create adaptive learning paths that match your knowledge level and learning goals.',
                icon: <Map className="w-10 h-10" />
              },
              {
                step: '03',
                title: 'Engage with Interactive Lessons',
                description: 'Experience lessons through our engaging interface with synchronized content, narration, and interactive elements.',
                details: 'Each lesson is crafted to maintain your focus and engagement, with visual progress indicators and multimedia elements that enhance understanding.',
                icon: <Brain className="w-10 h-10" />
              },
              {
                step: '04',
                title: 'Get Assessed & Improve',
                description: 'Take AI-generated assessments that identify your strengths and areas for improvement.',
                details: 'Our dynamic assessment system adapts to your performance, automatically generating remedial content when knowledge gaps are detected.',
                icon: <Target className="w-10 h-10" />
              },
              {
                step: '05',
                title: 'Track Your Progress',
                description: 'Monitor your learning journey with detailed analytics and performance insights.',
                details: 'Comprehensive dashboard showing mastery levels, time investment, and personalized recommendations to optimize your learning path.',
                icon: <BarChart3 className="w-10 h-10" />
              }
            ].map((step, index) => (
              <div key={index} className="relative flex items-start">
                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center text-white font-bold text-2xl relative z-10 shadow-2xl">
                  {step.step}
                </div>
                <div className="ml-12 flex-1">
                  <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-3xl border border-white/20 shadow-2xl">
                    <div className="flex items-center mb-6">
                      <div className="text-blue-400 mr-4">
                        {step.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xl text-blue-100 mb-6">
                      {step.description}
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl p-16 rounded-[3rem] text-white border border-white/20 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
              <Zap className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-4xl font-bold mb-8">
              Experience the Future of Learning
            </h2>
            <p className="text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
              Ready to transform how you learn? Join CogniSphere today and discover a personalized education experience like no other.
            </p>
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="px-10 py-5 bg-white text-blue-600 font-bold text-xl rounded-3xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              Start Your Learning Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PricingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-8">
            Choose Your Learning Path
          </h1>
          <p className="text-2xl text-blue-100 max-w-4xl mx-auto">
            Start free and upgrade as you grow. Our flexible pricing ensures you only pay for what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div key={index} className={`relative bg-white/10 backdrop-blur-3xl rounded-[2rem] p-10 border-2 ${tier.color} ${tier.popular ? 'ring-4 ring-blue-400/30' : ''} hover:bg-white/15 transition-all duration-500 shadow-2xl hover:scale-105`}>
              {tier.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-white mb-3">
                  {tier.name}
                </h3>
                <p className="text-white/70 mb-6 text-lg">
                  {tier.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-bold text-white">
                    {tier.price}
                  </span>
                  <span className="text-white/70 ml-3 text-xl">
                    {tier.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => tier.name === 'Institutional' ? null : setIsSignupOpen(true)}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-xl' 
                    : 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {tier.name === 'Freemium' ? 'Get Started Free' : 
                 tier.name === 'Pro' ? 'Start Pro Trial' : 
                 'Contact Sales'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-blue-500/10 backdrop-blur-3xl p-10 rounded-3xl border border-blue-400/20 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400/20 to-blue-400/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Enterprise-Grade Security
            </h3>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto">
              Your data is protected with industry-leading security measures. All content is encrypted, and your personal study materials remain completely private to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (isLoggedIn && ['dashboard', 'courses', 'analytics'].includes(currentPage)) {
      return <DashboardPage />;
    }
    
    switch (currentPage) {
      case 'features':
        return <FeaturesPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'pricing':
        return <PricingPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      {!isLoggedIn && (
        <nav className="fixed top-0 w-full bg-white/5 backdrop-blur-3xl border-b border-white/10 z-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-white ml-4">CogniSphere</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-10">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`text-lg font-medium transition-all duration-300 ${
                      currentPage === item.id 
                        ? 'text-blue-400' 
                        : 'text-white hover:text-blue-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-white font-medium hover:text-blue-300 transition-colors text-lg px-4 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsSignupOpen(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </button>
              </div>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white p-2"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/5 backdrop-blur-3xl border-t border-white/10">
              <div className="px-6 py-6 space-y-6">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`block text-lg font-medium transition-colors ${
                      currentPage === item.id 
                        ? 'text-blue-400' 
                        : 'text-white hover:text-blue-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <button 
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-white font-medium hover:text-blue-300 transition-colors text-lg"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setIsSignupOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-center shadow-lg"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className={!isLoggedIn ? "pt-20" : ""}>
        {renderPage()}
      </main>

      {/* Footer */}
      {!isLoggedIn && (
        <footer className="bg-black/20 backdrop-blur-3xl text-white py-20 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                    <Brain className="w-7 h-7 text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold ml-4">CogniSphere</span>
                </div>
                <p className="text-white/70 leading-relaxed text-lg">
                  Revolutionizing education through AI-powered personalized learning experiences.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Features</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Pricing</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">About</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Careers</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Help Center</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Privacy Policy</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-16 pt-10 text-center text-white/70 text-lg">
              <p>&copy; 2024 CogniSphere. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Auth Modal */}
      <AuthModal />
      
      {/* Create Course Modal */}
      <CreateCourseModal />
    </div>
  );
}

export default Test;