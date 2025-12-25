import React, { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Upload, Image as ImageIcon, Loader2, CheckCircle, XCircle, Trash2, Video } from "lucide-react";

export default function ProductPhotographyDashboard() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Video states
  const [videos, setVideos] = useState([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    fetchImages();
    fetchVideos();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("/api/photography/images");
      setImages(res.data);
    } catch (err) {
      console.error("Failed loading images", err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get("/api/photography/videos");
      setVideos(res.data);
    } catch (err) {
      console.error("Failed loading videos", err);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await axios.post("/api/photography/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploading(false);
      setSelectedFile(null);
      setPreview(null);
      fetchImages();
    } catch (err) {
      console.error("Upload error", err);
      setUploading(false);
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return;
    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("video", selectedVideo);

    try {
      await axios.post("/api/photography/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadingVideo(false);
      setSelectedVideo(null);
      setVideoPreview(null);
      fetchVideos();
    } catch (err) {
      console.error("Video upload error", err);
      setUploadingVideo(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await axios.delete(`/api/photography/images/${id}`);
      fetchImages();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    
    try {
      await axios.delete(`/api/photography/videos/${id}`);
      fetchVideos();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full mx-auto max-w-7xl">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-4 sm:mb-0">
          <Camera className="w-7 h-7 text-blue-600" /> Product Photography & Videography
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-4 h-4" /> {images.length} images
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center gap-1">
            <Video className="w-4 h-4" /> {videos.length} videos
          </span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Sections */}
        <div className="lg:col-span-1 space-y-8">
          {/* Image Upload Card */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" /> Upload Product Photos
            </h2>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFile} 
                disabled={uploading}
              />
              <Upload className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-gray-600 text-center">
                {selectedFile ? selectedFile.name : "Click to upload product photo"}
              </p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
            </label>

            {preview && (
              <div className="mt-4">
                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
              </div>
            )}

            <button
              onClick={uploadImage}
              disabled={uploading || !selectedFile}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Upload Image
                </>
              )}
            </button>
          </div>

          {/* Video Upload Card */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" /> Upload Product Videos
            </h2>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="file" 
                className="hidden" 
                accept="video/*" 
                onChange={handleVideo}
                disabled={uploadingVideo}
              />
              <Upload className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-gray-600 text-center">
                {selectedVideo ? selectedVideo.name : "Click to upload product video"}
              </p>
              <p className="text-sm text-gray-500 mt-1">MP4, MOV up to 50MB</p>
            </label>

            {videoPreview && (
              <div className="mt-4">
                <video controls className="w-full rounded-xl">
                  <source src={videoPreview} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <button
              onClick={uploadVideo}
              disabled={uploadingVideo || !selectedVideo}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {uploadingVideo ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Upload Video
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Gallery Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images Gallery */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-blue-600" /> Product Images
              </h2>
              <span className="text-sm text-gray-500">{images.length} items</span>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={img.url} 
                      alt="Product" 
                      className="object-cover w-full h-40 hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No product photos uploaded yet.</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first product image using the form on the left</p>
              </div>
            )}
          </div>

          {/* Videos Gallery */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Video className="w-6 h-6 text-purple-600" /> Product Videos
              </h2>
              <span className="text-sm text-gray-500">{videos.length} items</span>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((vid) => (
                  <div key={vid.id} className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <video className="object-cover w-full h-40">
                      <source src={vid.url} />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                    <button
                      onClick={() => deleteVideo(vid.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Delete video"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No product videos uploaded yet.</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first product video using the form on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}