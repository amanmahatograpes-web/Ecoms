import React, { useState, useEffect } from "react";
import { 
  Play, 
  BookOpen, 
  FileText, 
  Trophy, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Star, 
  Users,
  Award,
  TrendingUp,
  HelpCircle,
  Download,
  BarChart,
  Video,
  Bookmark,
  ExternalLink
} from "lucide-react";

// Mock data for courses
const COURSE_DATA = [
  {
    id: 1,
    title: "Getting Started on Amazon",
    description: "Learn the basics of setting up your Amazon seller account and listing your first products.",
    category: "Basics",
    level: "Beginner",
    duration: "2 hours",
    modules: 8,
    progress: 100,
    completed: true,
    rating: 4.8,
    enrolled: 12500,
    featured: true,
    badge: "Most Popular"
  },
  {
    id: 2,
    title: "Amazon SEO & Listing Optimization",
    description: "Master Amazon's search algorithm and optimize your listings for maximum visibility.",
    category: "Marketing",
    level: "Intermediate",
    duration: "3.5 hours",
    modules: 12,
    progress: 75,
    completed: false,
    rating: 4.9,
    enrolled: 8900,
    featured: true,
    badge: "Hot"
  },
  {
    id: 3,
    title: "Amazon PPC Advertising Mastery",
    description: "Complete guide to Amazon PPC advertising - from basic setup to advanced strategies.",
    category: "Advertising",
    level: "Advanced",
    duration: "5 hours",
    modules: 15,
    progress: 30,
    completed: false,
    rating: 4.7,
    enrolled: 6700,
    featured: false,
    badge: null
  },
  {
    id: 4,
    title: "Inventory Management Best Practices",
    description: "Learn how to effectively manage inventory to avoid stockouts and storage fees.",
    category: "Operations",
    level: "Intermediate",
    duration: "2.5 hours",
    modules: 10,
    progress: 0,
    completed: false,
    rating: 4.6,
    enrolled: 4500,
    featured: false,
    badge: null
  },
  {
    id: 5,
    title: "International Selling Guide",
    description: "Expand your business globally by learning how to sell on Amazon's international marketplaces.",
    category: "Expansion",
    level: "Advanced",
    duration: "4 hours",
    modules: 14,
    progress: 0,
    completed: false,
    rating: 4.9,
    enrolled: 3200,
    featured: true,
    badge: "New"
  },
  {
    id: 6,
    title: "Amazon Brand Registry & Protection",
    description: "Protect your brand and unlock powerful brand-building tools with Amazon Brand Registry.",
    category: "Branding",
    level: "Intermediate",
    duration: "3 hours",
    modules: 11,
    progress: 0,
    completed: false,
    rating: 4.8,
    enrolled: 5400,
    featured: false,
    badge: null
  },
];

// Quick start guides
const QUICK_GUIDES = [
  { id: 1, title: "Create Your First Listing", icon: "📦", time: "10 min", topic: "Basics" },
  { id: 2, title: "Set Up Amazon PPC Campaign", icon: "💰", time: "15 min", topic: "Advertising" },
  { id: 3, title: "Optimize Product Images", icon: "🖼️", time: "8 min", topic: "Listing" },
  { id: 4, title: "Handle Customer Returns", icon: "🔄", time: "12 min", topic: "Customer Service" },
];

// Learning paths
const LEARNING_PATHS = [
  { 
    id: 1, 
    title: "New Seller Path", 
    courses: 5, 
    duration: "12 hours",
    description: "From zero to first sale in 30 days"
  },
  { 
    id: 2, 
    title: "Advanced Advertising", 
    courses: 4, 
    duration: "15 hours",
    description: "Master Amazon PPC and external traffic"
  },
  { 
    id: 3, 
    title: "Brand Building", 
    courses: 6, 
    duration: "20 hours",
    description: "Build a recognizable and profitable brand"
  },
];

// Stats
const STATS = [
  { label: "Total Courses", value: "45", icon: BookOpen, color: "bg-blue-500" },
  { label: "Hours of Content", value: "120+", icon: Clock, color: "bg-green-500" },
  { label: "Active Learners", value: "25K+", icon: Users, color: "bg-purple-500" },
  { label: "Completion Rate", value: "92%", icon: Trophy, color: "bg-yellow-500" },
];

const SellerUniversity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState([1, 2, 3]);
  const [bookmarkedCourses, setBookmarkedCourses] = useState([2, 5]);

  // Filter courses
  const filteredCourses = COURSE_DATA.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Calculate overall progress
  const overallProgress = COURSE_DATA.reduce((acc, course) => acc + course.progress, 0) / COURSE_DATA.length;

  // Handle bookmark toggle
  const toggleBookmark = (courseId) => {
    setBookmarkedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Categories for filter
  const categories = ["All", "Basics", "Marketing", "Advertising", "Operations", "Expansion", "Branding"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Seller University
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Master Amazon selling with expert-led courses, guides, and resources. 
              Everything you need to grow your business on Amazon.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Trophy size={18} />
              Your Certificates
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download size={18} />
              Resources
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
            <p className="text-blue-100 mb-4">
              Complete courses, earn certificates, and unlock new seller levels.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-300" />
                <span className="font-medium">3 Courses Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-yellow-300" />
                <span className="font-medium">2 Certificates Earned</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold">{Math.round(overallProgress)}%</span>
                  <div className="text-sm text-blue-100">Overall Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Courses */}
        <div className="lg:col-span-2">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recommended Courses</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map(course => (
                <div 
                  key={course.id} 
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden ${
                    course.featured ? 'ring-2 ring-blue-500 ring-opacity-20' : ''
                  }`}
                >
                  {/* Course Header */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level}
                        </span>
                        {course.badge && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {course.badge}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => toggleBookmark(course.id)}
                        className="text-gray-400 hover:text-yellow-500"
                      >
                        <Bookmark 
                          size={20} 
                          className={bookmarkedCourses.includes(course.id) ? 'fill-yellow-400 text-yellow-400' : ''}
                        />
                      </button>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    
                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{course.enrolled.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${course.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {course.completed ? (
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                          <CheckCircle size={18} />
                          Completed
                        </button>
                      ) : course.progress > 0 ? (
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                          <Play size={18} />
                          Continue Learning
                        </button>
                      ) : (
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                          <Play size={18} />
                          Start Course
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Structured Learning Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LEARNING_PATHS.map(path => (
                <div key={path.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1">{path.title}</h4>
                      <p className="text-gray-600 text-sm">{path.description}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{path.courses} courses</span>
                    <span>{path.duration}</span>
                  </div>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                    View Path <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Start Guides */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Quick Start Guides</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Beginner</span>
            </div>
            
            <div className="space-y-3">
              {QUICK_GUIDES.map(guide => (
                <div 
                  key={guide.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="text-2xl">{guide.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{guide.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{guide.time}</span>
                      <span>•</span>
                      <span>{guide.topic}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Guides →
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Completed "Getting Started on Amazon"</div>
                  <div className="text-sm text-gray-500">2 days ago • Certificate earned</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Play size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Started "Amazon SEO Mastery"</div>
                  <div className="text-sm text-gray-500">1 week ago • 75% complete</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Award size={18} className="text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Earned "Intermediate Seller" badge</div>
                  <div className="text-sm text-gray-500">2 weeks ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Resources</h3>
            
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Video size={18} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">Webinar Recordings</div>
                  <div className="text-sm text-gray-500">Latest expert webinars</div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
              </a>
              
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">Market Insights</div>
                  <div className="text-sm text-gray-500">Trends and analysis</div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
              </a>
              
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <HelpCircle size={18} className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">Help Center</div>
                  <div className="text-sm text-gray-500">FAQs and support</div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-3">Ready to Become an Amazon Expert?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Join 25,000+ sellers who have accelerated their Amazon business with Seller University.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg">
            Start Free Trial
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-lg transition">
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerUniversity;