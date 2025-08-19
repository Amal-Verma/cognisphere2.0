'use client';

import { useState, useEffect } from 'react';
import { Nunito } from "next/font/google";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Upload,
  Search,
  Download,
  Eye,
  ArrowLeft,
  Plus,
  FileText,
  Calendar,
  User,
  Filter,
  Grid,
  List,
  Star
} from 'lucide-react';

const nunito = Nunito({ subsets: ["latin"] });

// Dummy textbook data
const dummyTextbooks = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    author: "Dr. Sarah Johnson",
    subject: "Computer Science",
    uploadedAt: "2024-01-15",
    fileSize: "12.4 MB",
    pages: 380,
    rating: 4.8,
    downloads: 1240,
    thumbnail: "📊",
    description: "Comprehensive guide to machine learning algorithms and applications.",
    tags: ["AI", "ML", "Algorithms", "Data Science"]
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    author: "Mark Thompson",
    subject: "Web Development",
    uploadedAt: "2024-02-10",
    fileSize: "8.7 MB",
    pages: 245,
    rating: 4.6,
    downloads: 892,
    thumbnail: "⚛️",
    description: "Master advanced React patterns and best practices for modern web development.",
    tags: ["React", "JavaScript", "Frontend", "Patterns"]
  },
  {
    id: 3,
    title: "Database Design Fundamentals",
    author: "Prof. Emily Chen",
    subject: "Database Systems",
    uploadedAt: "2024-01-28",
    fileSize: "15.2 MB",
    pages: 420,
    rating: 4.9,
    downloads: 1567,
    thumbnail: "🗄️",
    description: "Complete guide to database design, normalization, and optimization.",
    tags: ["Database", "SQL", "Design", "Optimization"]
  },
  {
    id: 4,
    title: "Digital Marketing Strategy",
    author: "Alex Rodriguez",
    subject: "Marketing",
    uploadedAt: "2024-02-05",
    fileSize: "6.3 MB",
    pages: 189,
    rating: 4.4,
    downloads: 654,
    thumbnail: "📱",
    description: "Modern digital marketing strategies and social media optimization.",
    tags: ["Marketing", "Digital", "Strategy", "Social Media"]
  },
  {
    id: 5,
    title: "Python for Data Analysis",
    author: "Dr. Michael Park",
    subject: "Programming",
    uploadedAt: "2024-01-20",
    fileSize: "11.8 MB",
    pages: 325,
    rating: 4.7,
    downloads: 1089,
    thumbnail: "🐍",
    description: "Learn Python programming for data analysis and visualization.",
    tags: ["Python", "Data Analysis", "Programming", "Visualization"]
  },
  {
    id: 6,
    title: "UI/UX Design Principles",
    author: "Jessica White",
    subject: "Design",
    uploadedAt: "2024-02-12",
    fileSize: "9.1 MB",
    pages: 278,
    rating: 4.5,
    downloads: 743,
    thumbnail: "🎨",
    description: "Essential principles of user interface and user experience design.",
    tags: ["UI", "UX", "Design", "Principles"]
  }
];

interface Textbook {
  id: number;
  title: string;
  author: string;
  subject: string;
  uploadedAt: string;
  fileSize: string;
  pages: number;
  rating: number;
  downloads: number;
  thumbnail: string;
  description: string;
  tags: string[];
}

export default function LibraryPage() {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'downloads'>('newest');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    // Simulate loading textbooks
    setTimeout(() => {
      setTextbooks(dummyTextbooks);
      setLoading(false);
    }, 1000);
  }, []);

  // Get unique subjects for filter
  const subjects = Array.from(new Set(textbooks.map(book => book.subject)));

  // Filter and sort textbooks
  const filteredTextbooks = textbooks
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSubject = selectedSubject === "all" || book.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`${nunito.className} min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${nunito.className} min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-slate-600/40 text-slate-300 hover:bg-slate-700/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => window.location.href = '/roadmap'}
                variant="outline"
                className="border-blue-600/40 text-blue-300 hover:bg-blue-700/50 backdrop-blur-sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Roadmap
              </Button>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white backdrop-blur-sm shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Textbook
              </Button>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">
            Digital{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Library
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Browse, upload, and access textbooks for your learning journey. Build your personal digital library.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search textbooks, authors, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
                />
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600/40 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'downloads')}
                  className="bg-slate-700/50 border border-slate-600/40 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="downloads">Most Downloaded</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex bg-slate-700/50 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-500/20 backdrop-blur-sm border-blue-400/30">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{textbooks.length}</div>
              <div className="text-sm text-blue-300">Total Books</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/20 backdrop-blur-sm border-emerald-400/30">
            <CardContent className="p-4 text-center">
              <Download className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-white">
                {textbooks.reduce((sum, book) => sum + book.downloads, 0).toLocaleString()}
              </div>
              <div className="text-sm text-emerald-300">Downloads</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/20 backdrop-blur-sm border-purple-400/30">
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{subjects.length}</div>
              <div className="text-sm text-purple-300">Subjects</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/20 backdrop-blur-sm border-yellow-400/30">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white">
                {(textbooks.reduce((sum, book) => sum + book.rating, 0) / textbooks.length).toFixed(1)}
              </div>
              <div className="text-sm text-yellow-300">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Textbooks Grid/List */}
        {filteredTextbooks.length === 0 ? (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold text-white mb-2">No textbooks found</h3>
              <p className="text-slate-300 mb-6">
                {searchQuery || selectedSubject !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Be the first to upload a textbook to the library!"
                }
              </p>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload First Textbook
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredTextbooks.map((book) => (
              <Card 
                key={book.id} 
                className={`bg-slate-800/50 backdrop-blur-sm border-slate-600/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  viewMode === 'list' ? 'hover:scale-100' : ''
                }`}
              >
                <CardContent className={viewMode === 'grid' ? "p-6" : "p-4"}>
                  {viewMode === 'grid' ? (
                    <div>
                      {/* Thumbnail and Title */}
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-3">{book.thumbnail}</div>
                        <h3 className="font-bold text-lg text-white mb-1">{book.title}</h3>
                        <p className="text-slate-300 text-sm">by {book.author}</p>
                      </div>

                      {/* Subject Badge */}
                      <div className="flex justify-center mb-3">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                          {book.subject}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {book.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {book.pages} pages
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {book.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {book.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(book.uploadedAt)}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {book.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="text-3xl">{book.thumbnail}</div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-white truncate">{book.title}</h3>
                            <p className="text-slate-300 text-sm">by {book.author}</p>
                          </div>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 ml-2">
                            {book.subject}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                          {book.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {book.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {book.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {book.pages} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(book.uploadedAt)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm border-slate-600/40">
              <CardHeader>
                <CardTitle className="text-white">Upload Textbook</CardTitle>
                <CardDescription className="text-slate-300">
                  Share a textbook with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-600/40 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-slate-300 mb-2">Drop your PDF here or click to browse</p>
                  <p className="text-xs text-slate-400">Supports PDF files up to 50MB</p>
                  <Button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => {
                      // Handle upload logic here
                      setShowUploadModal(false);
                      // For now, just close modal
                    }}
                  >
                    Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
