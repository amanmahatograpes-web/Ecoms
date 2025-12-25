// UploadVideos.jsx
import React, { useState, useRef } from 'react';
import { Upload, X, Video, Play, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const UploadVideos = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('videos', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/videos/upload`, {
        method: 'POST',
        body: formData,
      });

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await response.json();

      clearInterval(interval);
      setUploadProgress(100);

      if (response.ok) {
        setUploadResult({
          success: true,
          message: `Successfully uploaded ${result.uploaded.length} videos`,
          details: result
        });
        setUploadedVideos(prev => [...prev, ...result.uploaded]);
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
        message: 'Network error: Unable to upload videos'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeVideo = (videoId) => {
    setUploadedVideos(prev => prev.filter(video => video.id !== videoId));
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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload & Manage Videos</h1>
        <p className="text-gray-600 mt-2">Upload product videos to enhance your listings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors"
          >
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="video-upload" className="cursor-pointer">
                <span className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700">
                  Choose Videos
                </span>
                <input
                  id="video-upload"
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept="video/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                MP4, MOV, AVI up to 100MB each
              </p>
              <p className="text-sm text-gray-600 mt-2">
                or drag and drop videos here
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading videos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
              uploadResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {uploadResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${
                  uploadResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {uploadResult.message}
                </p>
                {uploadResult.details?.errors && (
                  <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
                    {uploadResult.details.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Video Guidelines</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Technical Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Maximum duration: 5 minutes</li>
                <li>Recommended resolution: 1080p</li>
                <li>MP4 format preferred</li>
                <li>Max file size: 100MB</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Content Guidelines</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Show product features clearly</li>
                <li>Professional quality only</li>
                <li>No watermarks or logos</li>
                <li>Clear audio (if applicable)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Best Practices</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Start with key benefits</li>
                <li>Demonstrate usage</li>
                <li>Good lighting and stability</li>
                <li>Keep it engaging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Videos Grid */}
      {uploadedVideos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Uploaded Videos ({uploadedVideos.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <video className="w-full h-full object-cover">
                    <source src={video.url} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-opacity">
                      <Play size={20} fill="white" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeVideo(video.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{video.filename}</h3>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{formatDuration(video.duration)}</span>
                    <span>{formatFileSize(video.size)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      video.status === 'processed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {video.status}
                    </span>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Assign to Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadVideos;