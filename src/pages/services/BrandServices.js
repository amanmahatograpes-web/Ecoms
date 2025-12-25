import React, { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Upload, Palette, Loader2, CheckCircle, Trash2, Globe, Layers } from "lucide-react";

export default function BrandServiceDashboard() {
  const [logos, setLogos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [brandAssets, setBrandAssets] = useState([]);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);

  useEffect(() => {
    fetchLogos();
    fetchBrandAssets();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await axios.get("/api/brand/logos");
      setLogos(response.data);
    } catch (error) {
      console.error("Error loading logos:", error);
    }
  };

  const fetchBrandAssets = async () => {
    try {
      const response = await axios.get("/api/brand/assets");
      setBrandAssets(response.data);
    } catch (error) {
      console.error("Error loading brand assets:", error);
    }
  };

  const handleLogoFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAssetFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedAsset(file);
      setAssetPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("logo", selectedFile);

    try {
      await axios.post("/api/brand/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setUploading(false);
      setSelectedFile(null);
      setPreview(null);
      fetchLogos();
    } catch (error) {
      console.error("Logo upload error:", error);
      setUploading(false);
    }
  };

  const uploadAsset = async () => {
    if (!selectedAsset) return;
    
    setUploadingAsset(true);
    const formData = new FormData();
    formData.append("asset", selectedAsset);

    try {
      await axios.post("/api/brand/upload-asset", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setUploadingAsset(false);
      setSelectedAsset(null);
      setAssetPreview(null);
      fetchBrandAssets();
    } catch (error) {
      console.error("Asset upload error:", error);
      setUploadingAsset(false);
    }
  };

  const deleteLogo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this logo?")) return;
    
    try {
      await axios.delete(`/api/brand/logos/${id}`);
      fetchLogos();
    } catch (error) {
      console.error("Delete logo failed:", error);
    }
  };

  const deleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand asset?")) return;
    
    try {
      await axios.delete(`/api/brand/assets/${id}`);
      fetchBrandAssets();
    } catch (error) {
      console.error("Delete asset failed:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full mx-auto max-w-7xl">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-4 sm:mb-0">
          <Palette className="w-7 h-7 text-green-600" /> Brand Identity & Assets
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="flex items-center gap-1">
            <Camera className="w-4 h-4" /> {logos.length} logos
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center gap-1">
            <Layers className="w-4 h-4" /> {brandAssets.length} assets
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Sections */}
        <div className="lg:col-span-1 space-y-8">
          {/* Logo Upload Card */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" /> Upload Brand Logos
            </h2>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleLogoFile} 
                disabled={uploading}
              />
              <Upload className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-gray-600 text-center">
                {selectedFile ? selectedFile.name : "Click to upload brand logo"}
              </p>
              <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG up to 10MB</p>
            </label>

            {preview && (
              <div className="mt-4">
                <img 
                  src={preview} 
                  alt="Logo preview" 
                  className="w-full h-48 object-contain rounded-xl bg-gray-50" 
                />
              </div>
            )}

            <button
              onClick={uploadLogo}
              disabled={uploading || !selectedFile}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Upload Logo
                </>
              )}
            </button>
          </div>

          {/* Brand Assets Upload Card */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" /> Upload Brand Assets
            </h2>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*,.pdf,.ai,.eps,.psd" 
                onChange={handleAssetFile}
                disabled={uploadingAsset}
              />
              <Upload className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-gray-600 text-center">
                {selectedAsset ? selectedAsset.name : "Click to upload brand asset"}
              </p>
              <p className="text-sm text-gray-500 mt-1">PDF, AI, EPS, PSD, images up to 20MB</p>
            </label>

            {assetPreview && assetPreview.includes("image") && (
              <div className="mt-4">
                <img 
                  src={assetPreview} 
                  alt="Asset preview" 
                  className="w-full h-48 object-contain rounded-xl bg-gray-50" 
                />
              </div>
            )}

            {assetPreview && !assetPreview.includes("image") && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Document Preview</p>
                <p className="text-sm text-gray-500">{selectedAsset?.name}</p>
              </div>
            )}

            <button
              onClick={uploadAsset}
              disabled={uploadingAsset || !selectedAsset}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {uploadingAsset ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Upload Asset
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Gallery Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Logos Gallery */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="w-6 h-6 text-green-600" /> Brand Logos
              </h2>
              <span className="text-sm text-gray-500">{logos.length} logos</span>
            </div>

            {logos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {logos.map((logo) => (
                  <div 
                    key={logo.id} 
                    className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
                      <img 
                        src={logo.url} 
                        alt={`Brand logo ${logo.id}`} 
                        className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                    <button
                      onClick={() => deleteLogo(logo.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Delete logo"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No brand logos uploaded yet.</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first brand logo using the form on the left</p>
              </div>
            )}
          </div>

          {/* Brand Assets Gallery */}
          <div className="p-5 rounded-xl border shadow bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Layers className="w-6 h-6 text-purple-600" /> Brand Assets
              </h2>
              <span className="text-sm text-gray-500">{brandAssets.length} assets</span>
            </div>

            {brandAssets.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brandAssets.map((asset) => (
                  <div 
                    key={asset.id} 
                    className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="h-40 bg-gray-50 flex flex-col items-center justify-center p-4">
                      {asset.type === "image" ? (
                        <img 
                          src={asset.url} 
                          alt={`Brand asset ${asset.id}`} 
                          className="max-w-full max-h-32 object-contain"
                        />
                      ) : (
                        <>
                          <Globe className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-600 truncate w-full text-center">
                            {asset.name}
                          </p>
                          <p className="text-xs text-gray-500 uppercase mt-1">
                            {asset.format}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                    <button
                      onClick={() => deleteAsset(asset.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Delete asset"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No brand assets uploaded yet.</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first brand asset using the form on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}