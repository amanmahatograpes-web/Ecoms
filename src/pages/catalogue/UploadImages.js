import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  FileImage,
  HardDrive,
  Palette,
  Camera,
  Trash2,
  Info,
  ChevronRight,
  Grid,
  List,
  Smartphone,
  Tablet,
  Monitor,
  Shield,
  Sparkles
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const UploadImages = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData,
      });

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await response.json();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        setUploadResult({
          success: true,
          message: `Successfully uploaded ${result.uploaded?.length || files.length} image${result.uploaded?.length !== 1 ? 's' : ''}`,
          details: result
        });
        const newImages = result.uploaded?.map(img => ({ 
          id: img.id || img.url, 
          url: img.url, 
          filename: img.filename || img.name || 'image.jpg',
          size: img.size,
          dimensions: img.dimensions
        })) || files.map(file => ({
          id: URL.createObjectURL(file),
          url: URL.createObjectURL(file),
          filename: file.name,
          size: file.size,
          dimensions: '1000x1000'
        }));
        setUploadedImages(prev => [...prev, ...newImages]);
      } else {
        setUploadResult({
          success: false,
          message: result.message || 'Upload failed',
          details: result
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Network error: Unable to upload images'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage === imageId) {
      setSelectedImage(null);
    }
  };

  const removeAllImages = () => {
    if (window.confirm('Are you sure you want to remove all uploaded images?')) {
      setUploadedImages([]);
      setSelectedImage(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect({ target: { files } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Upload Images
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Upload and manage product images for your listings
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {uploadedImages.length > 0 && (
              <>
                <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={removeAllImages}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-red-300 text-red-600 bg-white rounded-lg hover:bg-red-50 text-sm sm:text-base font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm sm:text-base font-medium transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>
        
        {/* Stats summary */}
        <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Images</span>
              <span className="text-lg font-bold text-gray-900">{uploadedImages.length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Size</span>
              <span className="text-lg font-bold text-blue-600">
                {formatFileSize(uploadedImages.reduce((acc, img) => acc + (img.size || 0), 0))}
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Max Size</span>
              <span className="text-lg font-bold text-green-600">10MB</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Supported</span>
              <span className="text-lg font-bold text-purple-600">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile guidelines toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-900">Image Guidelines</span>
          </div>
          <ChevronRight className={`w-5 h-5 transform transition-transform ${showGuidelines ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
        {/* Main upload section - spans 2 columns on desktop */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 lg:p-8">
            {/* Upload area header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Drag & Drop Images
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Upload product images from your computer
              </p>
            </div>

            {/* Upload area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 md:p-8 text-center hover:border-orange-400 transition-colors bg-gradient-to-b from-gray-50 to-white"
            >
              <div className="max-w-md mx-auto">
                <div className="relative inline-block">
                  <ImageIcon className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-orange-700 transition-colors">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                        Browse Files
                      </span>
                      <input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Supports JPG, PNG, GIF • Max 10MB per image
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-4 h-4" />
                      <span>Mobile</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tablet className="w-4 h-4" />
                      <span>Tablet</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Monitor className="w-4 h-4" />
                      <span>Desktop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="mt-4 sm:mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4 animate-pulse" />
                    Uploading {uploadedImages.length + 1} image{uploadedImages.length + 1 !== 1 ? 's' : ''}...
                  </span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload result */}
            {uploadResult && (
              <div className={`mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl flex items-start gap-3 sm:gap-4 ${
                uploadResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {uploadResult.success ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium text-sm sm:text-base ${
                    uploadResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {uploadResult.message}
                  </p>
                  
                  {uploadResult.details?.errors && uploadResult.details.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-red-700 mb-2 text-sm">
                        Found {uploadResult.details.errors.length} error{uploadResult.details.errors.length !== 1 ? 's' : ''}:
                      </p>
                      <div className="max-h-32 overflow-y-auto">
                        <ul className="text-xs sm:text-sm text-red-600 space-y-1">
                          {uploadResult.details.errors.slice(0, 3).map((error, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                          {uploadResult.details.errors.length > 3 && (
                            <li className="text-gray-500">
                              ...and {uploadResult.details.errors.length - 3} more error{uploadResult.details.errors.length - 3 !== 1 ? 's' : ''}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guidelines sidebar - hidden on mobile by default */}
        <div className={`lg:col-span-1 ${showGuidelines ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 lg:p-8 sticky top-6">
            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900">Guidelines</h2>
              <button
                onClick={() => setShowGuidelines(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 hidden lg:block">
              Image Guidelines
            </h2>

            <div className="space-y-4 sm:space-y-5">
              {/* Recommended Specs */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 text-sm sm:text-base mb-2">
                      Recommended Specs
                    </h3>
                    <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Minimum 1000×1000 pixels</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Square aspect ratio (1:1)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">•</span>
                        <span>RGB color mode</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">•</span>
                        <span>sRGB color profile</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* File Requirements */}
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 text-sm sm:text-base mb-2">
                      File Requirements
                    </h3>
                    <ul className="text-xs sm:text-sm text-green-800 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">•</span>
                        <span>PNG, JPG, or GIF format</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">•</span>
                        <span>Max file size: 10MB</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">•</span>
                        <span>No transparent backgrounds</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">•</span>
                        <span>High quality compression</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Content Guidelines */}
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Palette className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 text-sm sm:text-base mb-2">
                      Content Guidelines
                    </h3>
                    <ul className="text-xs sm:text-sm text-purple-800 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Product fills 85% of frame</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Professional lighting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600">•</span>
                        <span>No watermarks or text</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Clear background preferred</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Compliance badge */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-900 text-sm sm:text-base">
                      Compliance Check
                    </h3>
                    <p className="text-xs sm:text-sm text-orange-800 mt-1">
                      All uploaded images are automatically checked for compliance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Images Section */}
      {uploadedImages.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Uploaded Images
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} • {formatFileSize(uploadedImages.reduce((acc, img) => acc + (img.size || 0), 0))}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile view toggle */}
              <div className="sm:hidden flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={removeAllImages}
                className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {uploadedImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`relative group bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                    selectedImage === image.id ? 'border-orange-500 shadow-sm' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(selectedImage === image.id ? null : image.id)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  <div className="p-2 sm:p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {image.filename.length > 20 
                          ? image.filename.substring(0, 20) + '...' 
                          : image.filename}
                      </span>
                      <span className="text-xs text-gray-500">
                        {image.size ? formatFileSize(image.size) : '2.1MB'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {image.dimensions || '1000×1000'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {uploadedImages.map((image) => (
                  <div 
                    key={image.id} 
                    className={`p-4 sm:p-5 hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedImage === image.id ? 'bg-orange-50' : ''
                    }`}
                    onClick={() => setSelectedImage(selectedImage === image.id ? null : image.id)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {image.filename}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {image.dimensions || '1000×1000'}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {image.size ? formatFileSize(image.size) : '2.1MB'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FileImage className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>JPG</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Product Image</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state for no images */}
      {uploadedImages.length === 0 && !uploading && (
        <div className="mt-6 sm:mt-8 text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-300 mb-4">
            <ImageIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            No images uploaded yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto px-4 text-sm sm:text-base mb-6">
            Upload your first product image to get started
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Upload First Image
          </button>
        </div>
      )}

      {/* Image preview modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Image Preview
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.url || uploadedImages.find(img => img.id === selectedImage)?.url}
                alt="Preview"
                className="max-w-full max-h-[70vh] mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImages;