import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Settings, Maximize2, ChevronDown, Check, Clock, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

const TrainingVideoPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('12:00');
  const videoRef = useRef(null);

  // Amazon color palette
  const amazonColors = {
    primary: '#ff9900',
    secondary: '#146eb4',
    dark: '#232f3e',
    light: '#f7f7f7',
    gray: '#f0f2f2',
    text: '#0f1111'
  };

  const courseData = {
    title: "React.js Masterclass 2024",
    instructor: "Alex Johnson",
    rating: 4.7,
    totalRating: 15432,
    duration: "12 hours",
    level: "Intermediate",
    lastUpdated: "December 2024",
    lectures: "58 lectures",
    resources: "50 downloadable resources",
    access: "Full lifetime access"
  };

  const modules = [
    { id: 1, title: "Introduction to React", duration: "45:20", completed: true },
    { id: 2, title: "Components & Props", duration: "58:10", completed: true },
    { id: 3, title: "State & Lifecycle", duration: "1:12:30", completed: false },
    { id: 4, title: "Hooks Deep Dive", duration: "2:05:40", completed: false },
    { id: 5, title: "Context API", duration: "1:30:15", completed: false }
  ];

  const relatedCourses = [
    { id: 1, title: "Next.js Fundamentals", instructor: "Sarah Lee", rating: 4.8, price: "$89.99", thumbnail: "https://picsum.photos/300/170?random=1" },
    { id: 2, title: "Advanced React Patterns", instructor: "Mike Chen", rating: 4.9, price: "$94.99", thumbnail: "https://picsum.photos/300/170?random=2" },
    { id: 3, title: "React Performance", instructor: "Emma Davis", rating: 4.6, price: "$79.99", thumbnail: "https://picsum.photos/300/170?random=3" }
  ];

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = (e) => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100);
      
      // Format time display
      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      };
      
      setCurrentTime(formatTime(currentTime));
      setDuration(formatTime(duration));
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setShowSpeedMenu(false);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "fill-amber-500 text-amber-500" : "fill-gray-300 text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - Amazon Style */}
      <div className="bg-amazon-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amazon-primary rounded-sm flex items-center justify-center mr-2">
                  <span className="font-bold text-white">R</span>
                </div>
                <span className="text-xl font-bold">ReactTraining</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-amazon-primary transition-colors">Categories</a>
                <a href="#" className="hover:text-amazon-primary transition-colors">Courses</a>
                <a href="#" className="hover:text-amazon-primary transition-colors">Instructors</a>
                <a href="#" className="hover:text-amazon-primary transition-colors">Business</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-amazon-primary hover:bg-orange-600 rounded-sm font-medium transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <a href="#" className="hover:text-amazon-primary">Home</a>
            <span className="mx-2">›</span>
            <a href="#" className="hover:text-amazon-primary">Courses</a>
            <span className="mx-2">›</span>
            <a href="#" className="hover:text-amazon-primary">Web Development</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{courseData.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Video & Curriculum */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
              {/* Video Container */}
              <div className="relative bg-black">
                <div className="aspect-w-16 aspect-h-9">
                  <video
                    ref={videoRef}
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    poster="https://picsum.photos/800/450?random=4"
                    className="w-full h-full object-cover cursor-pointer"
                    onTimeUpdate={handleProgress}
                    onClick={handlePlayPause}
                  />
                  
                  {/* Video Overlay */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={handlePlayPause}
                  >
                    {!isPlaying && (
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <Play size={32} className="ml-1 text-amazon-dark" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Progress Bar */}
                    <div 
                      className="h-1.5 bg-gray-600 rounded-full mb-4 cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div 
                        className="h-full bg-amazon-primary rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePlayPause}
                          className="text-white hover:text-amazon-primary transition-colors"
                        >
                          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <span className="text-sm text-white">
                          {currentTime} / {duration}
                        </span>
                        
                        {/* Volume Control */}
                        <div className="flex items-center space-x-2">
                          <Volume2 size={18} className="text-white" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => {
                              setVolume(e.target.value);
                              if (videoRef.current) {
                                videoRef.current.volume = e.target.value;
                              }
                            }}
                            className="w-24 accent-amazon-primary"
                          />
                        </div>

                        {/* Speed Control */}
                        <div className="relative">
                          <button
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            className="text-white hover:text-amazon-primary transition-colors text-sm"
                          >
                            {speed}x <ChevronDown size={16} className="inline ml-1" />
                          </button>
                          
                          {showSpeedMenu && (
                            <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-sm shadow-lg z-10 min-w-[100px]">
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleSpeedChange(s)}
                                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                    speed === s ? 'bg-amazon-primary/10 text-amazon-primary' : 'text-gray-700'
                                  }`}
                                >
                                  {s}x speed
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button className="text-white hover:text-amazon-primary transition-colors">
                          <Settings size={18} />
                        </button>
                        <button 
                          onClick={handleFullscreen}
                          className="text-white hover:text-amazon-primary transition-colors"
                        >
                          <Maximize2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Details */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
                    <p className="text-gray-600 mb-4">
                      Learn how to manage component state and understand React's lifecycle methods in this comprehensive tutorial.
                    </p>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(courseData.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({courseData.totalRating.toLocaleString()} ratings)
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-1" />
                    {courseData.duration} total
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{courseData.level}</span>
                </div>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
                <p className="text-gray-600 mt-1">{modules.length} modules • {courseData.duration} total length</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {modules.map((module, index) => (
                  <div 
                    key={module.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      module.completed ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          module.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {module.completed ? <Check size={20} /> : <span>{index + 1}</span>}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{module.title}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-gray-500">{module.duration}</span>
                            {module.completed && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button className={`px-4 py-2 rounded-sm text-sm font-medium ${
                        module.completed
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-amazon-primary text-white hover:bg-orange-600'
                      } transition-colors`}>
                        {module.completed ? 'Review' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Info */}
          <div className="space-y-6">
            
            {/* Pricing Card */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 sticky top-6">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline mb-1">
                  <span className="text-3xl font-bold text-gray-900">$89.99</span>
                  <span className="ml-2 text-xl text-gray-500 line-through">$199.99</span>
                  <span className="ml-3 text-sm font-bold bg-red-100 text-red-800 px-2 py-1 rounded">
                    55% off
                  </span>
                </div>
                <p className="text-sm text-gray-600">Limited time offer</p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button className="w-full py-3 bg-amazon-primary hover:bg-orange-600 text-white font-bold rounded-sm transition-colors text-center">
                  Buy Now
                </button>
                <button className="w-full py-3 border-2 border-amazon-dark bg-amazon-dark hover:bg-gray-900 text-white font-medium rounded-sm transition-colors flex items-center justify-center">
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </button>
                <button className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-sm transition-colors flex items-center justify-center">
                  <Heart size={20} className="mr-2" />
                  Add to Wish List
                </button>
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-4 bg-gray-50 rounded-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <Check size={20} className="text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">30-Day Money-Back Guarantee</span>
                </div>
                <p className="text-sm text-gray-600">Full lifetime access. Certificate of completion.</p>
              </div>

              {/* Course Includes */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-3">This course includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                    {courseData.duration} on-demand video
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                    {courseData.resources}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                    {courseData.access}
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                    Access on mobile and TV
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                    Certificate of completion
                  </li>
                </ul>
              </div>

              {/* Training Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Instructor</span>
                    <span className="text-sm font-medium">{courseData.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium">{courseData.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-medium">Web Development</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Students also bought</h3>
              <div className="space-y-4">
                {relatedCourses.map((course) => (
                  <div key={course.id} className="flex space-x-3 p-3 border border-gray-200 rounded-sm hover:border-amazon-primary transition-colors cursor-pointer">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-20 h-12 object-cover rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{course.title}</h4>
                      <p className="text-xs text-gray-500">by {course.instructor}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          {renderStars(course.rating)}
                        </div>
                        <span className="font-bold text-gray-900">{course.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-amazon-secondary hover:text-blue-700 transition-colors">
                View more recommendations →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">ReactTraining</h4>
              <p className="text-sm text-gray-600">
                Learn React from industry experts with hands-on projects and real-world examples.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-amazon-primary">About Us</a></li>
                <li><a href="#" className="hover:text-amazon-primary">Careers</a></li>
                <li><a href="#" className="hover:text-amazon-primary">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-amazon-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-amazon-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-amazon-primary">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-amazon-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-amazon-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amazon-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
            © 2024 ReactTraining. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingVideoPage;