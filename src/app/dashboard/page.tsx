"use client";
import React, { useState } from 'react';
import { BookOpen, Brain, Users, BarChart3, MessageCircle, Presentation, Map, Shield, Check, Menu, X, Star, ArrowRight, Zap, Target, Sparkles, Plus, Search, Filter, Clock, TrendingUp, Award, Play, Edit, Trash2, Upload, FileText, Video, Headphones, ChevronRight, Settings, Bell, User, LogOut, Home, Library, PlusCircle, BarChart, HelpCircle } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  // Mock data for dashboard
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, JavaScript, and React to build modern web applications from scratch',
      progress: 0,
      modules: 8,
      completedModules: 0,
      timeSpent: '0h 0m',
      difficulty: 'Beginner',
      category: 'Web Development',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastAccessed: 'Never',
      status: 'Not Started'
    }
  ]);

  const [stats, setStats] = useState({
    totalCourses: 1,
    completedCourses: 0,
    totalHours: 0,
    currentStreak: 0,
    averageScore: 0,
    certificates: 0
  });

  const dashboardNavigation = [
    { name: 'Dashboard', id: 'dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'My Courses', id: 'courses', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Digital Library', id: 'library', icon: <Library className="w-5 h-5" />, href: '/library' },
    { name: 'Create Course', id: 'create', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Analytics', id: 'analytics', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Help', id: 'help', icon: <HelpCircle className="w-5 h-5" /> }
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

  return (
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
                  onClick={() => {
                    if (item.href) {
                      window.location.href = item.href;
                    } else {
                      setCurrentPage(item.id);
                    }
                  }}
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
                onClick={onLogout}
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
                  <h2 className="text-2xl font-bold text-white">Demo Courses</h2>
                  <button 
                    onClick={() => setCurrentPage('courses')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses.slice(0, 1).map((course) => (
                    <div 
                      key={course.id} 
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                      onClick={() => window.location.href = '/roadmap#demo=true'}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{course.title}</h3>
                          <p className="text-white/70 text-sm mb-3">{course.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <span>{course.completedModules}/{course.modules} modules</span>
                            <span>{course.timeSpent}</span>
                          </div>
                        </div>
                        <button 
                          className="p-2 bg-blue-500/20 backdrop-blur-xl rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = '/roadmap#demo=true';
                          }}
                        >
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <button 
                  onClick={() => window.location.href = '/generate'}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
                >
                  <Plus className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">Create New Course</h3>
                  <p className="text-white/70">Generate AI-powered learning content</p>
                </button>

                <button 
                  onClick={() => window.location.href = '/library'}
                  className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-300 group"
                >
                  <Library className="w-12 h-12 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">Digital Library</h3>
                  <p className="text-white/70">Browse and upload textbooks</p>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/flashcards'}
                  className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 group"
                >
                  <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">Flashcards</h3>
                  <p className="text-white/70">Practice with interactive flashcards</p>
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
                        <button 
                          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
                          onClick={() => window.location.href = '/roadmap#demo=true'}
                        >
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

      {/* Create Course Modal */}
      <CreateCourseModal />
    </div>
  );
}

export default Dashboard;