// // AddProductsUpload.jsx
// import React, { useState } from 'react';
// import { Upload, Download, FileText, AlertCircle, CheckCircle2, Plus } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000/api';

// const AddProductsUpload = ({ onSuccess }) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadResult, setUploadResult] = useState(null);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
//       setUploadResult({
//         success: false,
//         message: 'Please upload a CSV or Excel file'
//       });
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);
//     setUploadResult(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       // fake loading bar
//       const interval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(interval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 200);

//       const result = await response.json();

//       clearInterval(interval);
//       setUploadProgress(100);

//       if (response.ok) {
//         setUploadResult({
//           success: true,
//           message: `Successfully uploaded ${result.processed} products`,
//           details: result
//         });
//       } else {
//         setUploadResult({
//           success: false,
//           message: result.message || 'Upload failed',
//           details: result
//         });
//       }
//     } catch (error) {
//       setUploadResult({
//         success: false,
//         message: 'Network error: Unable to upload file'
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const downloadTemplate = () => {
//     const templateData = [
//       ['title', 'sku', 'asin', 'brand', 'price', 'quantity', 'category', 'description'],
//       ['Product Title', 'SKU-001', 'B012345678', 'Brand Name', '29.99', '100', 'Electronics', 'Product description'],
//       ['Another Product', 'SKU-002', 'B098765432', 'Another Brand', '49.99', '50', 'Home & Kitchen', 'Another description']
//     ];

//     const csvContent = templateData.map(row => row.join(',')).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'product_upload_template.csv';
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Add Products via Upload</h1>
//         <p className="text-gray-600 mt-2">Upload a CSV or Excel file to add multiple products at once</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
//         {/* Left Section */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           {/* Upload Header */}
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold">Upload Products</h2>
//             <button
//               onClick={downloadTemplate}
//               className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               <Download size={16} />
//               <span>Download Template</span>
//             </button>
//           </div>

//           {/* Upload Box */}
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//             <div className="mt-4">
//               <label htmlFor="file-upload" className="cursor-pointer">
//                 <span className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700">
//                   Choose File
//                 </span>
//                 <input
//                   id="file-upload"
//                   name="file-upload"
//                   type="file"
//                   className="sr-only"
//                   accept=".csv,.xlsx,.xls"
//                   onChange={handleFileUpload}
//                   disabled={isUploading}
//                 />
//               </label>
//               <p className="text-xs text-gray-500 mt-2">CSV or Excel files only</p>
//             </div>
//           </div>

//           {/* Loading Bar */}
//           {isUploading && (
//             <div className="mt-4">
//               <div className="flex justify-between text-sm text-gray-600 mb-1">
//                 <span>Uploading...</span>
//                 <span>{uploadProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-orange-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${uploadProgress}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}

//           {/* Upload Result + BUTTONS ADDED HERE */}
//           {uploadResult && (
//             <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
//               uploadResult.success
//                 ? "bg-green-50 border border-green-200"
//                 : "bg-red-50 border border-red-200"
//             }`}
//             >
//               {uploadResult.success ? (
//                 <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
//               ) : (
//                 <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
//               )}

//               <div>
//                 <p className={`font-medium ${
//                   uploadResult.success ? "text-green-800" : "text-red-800"
//                 }`}>
//                   {uploadResult.message}
//                 </p>

//                 {/* ⭐ NEXT STEP + CREATE PRODUCT BUTTON (ADDED HERE) */}
//                 {uploadResult.success && (
//                   <div className="flex items-center space-x-3 mt-4">
                    
//                     {/* NEXT STEP BUTTON */}
//                     <button
//                       onClick={onSuccess}
//                       className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                     >
//                       Next Step
//                     </button>

//                     {/* CREATE PRODUCT BUTTON */}
//                     <button
//                       type="button"
//                       className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center space-x-2 transition-colors"
//                     >
//                       <Plus size={16} />
//                       <span>Create Product</span>
//                     </button>
//                   </div>
//                 )}

//                 {/* Error List */}
//                 {uploadResult.details?.errors && (
//                   <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
//                     {uploadResult.details.errors.slice(0, 5).map((error, index) => (
//                       <li key={index}>{error}</li>
//                     ))}
//                     {uploadResult.details.errors.length > 5 && (
//                       <li>...and {uploadResult.details.errors.length - 5} more errors</li>
//                     )}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Section (Instructions) */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h2 className="text-lg font-semibold mb-4">Upload Instructions</h2>

//           <div className="space-y-4">
//             <div className="flex items-start space-x-3">
//               <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
//               <div>
//                 <h3 className="font-medium text-gray-900">Required Fields</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   title, sku, brand, price, quantity, category
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start space-x-3">
//               <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
//               <div>
//                 <h3 className="font-medium text-gray-900">Optional Fields</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   asin, description, bullet points, weight, dimensions
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start space-x-3">
//               <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
//               <div>
//                 <h3 className="font-medium text-gray-900">File Format</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Use the template provided. Ensure all required fields are filled.
//                 </p>
//               </div>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h3 className="font-medium text-blue-900">Tips for Success</h3>
//               <ul className="text-sm text-blue-800 mt-2 list-disc list-inside space-y-1">
//                 <li>Use unique SKUs</li>
//                 <li>Price must be decimal (29.99)</li>
//                 <li>Quantity must be whole numbers</li>
//                 <li>Category must match existing categories</li>
//               </ul>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductsUpload;



// // const mongoose = require('mongoose');

// // const dimensionSchema = new mongoose.Schema({
// //   length: { type: Number, min: 0 },
// //   width: { type: Number, min: 0 },
// //   height: { type: Number, min: 0 }
// // });

// // const productSchema = new mongoose.Schema({
// //   title: {
// //     type: String,
// //     required: [true, 'Product title is required'],
// //     trim: true,
// //     maxlength: [500, 'Product title cannot exceed 500 characters']
// //   },
// //   sku: {
// //     type: String,
// //     required: [true, 'SKU is required'],
// //     unique: true,
// //     trim: true,
// //     maxlength: [40, 'SKU cannot exceed 40 characters'],
// //     match: [/^[A-Za-z0-9-_]+$/, 'SKU can only contain letters, numbers, hyphens, and underscores']
// //   },
// //   asin: {
// //     type: String,
// //     trim: true,
// //     match: [/^[A-Z0-9]{10}$/, 'ASIN must be exactly 10 uppercase letters and numbers']
// //   },
// //   brand: {
// //     type: String,
// //     required: [true, 'Brand is required'],
// //     trim: true,
// //     maxlength: [50, 'Brand name cannot exceed 50 characters']
// //   },
// //   price: {
// //     type: Number,
// //     required: [true, 'Price is required'],
// //     min: [0.01, 'Price must be at least 0.01'],
// //     max: [100000, 'Price cannot exceed 100,000']
// //   },
// //   quantity: {
// //     type: Number,
// //     required: [true, 'Quantity is required'],
// //     min: [0, 'Quantity cannot be negative'],
// //     max: [999999, 'Quantity cannot exceed 999,999']
// //   },
// //   category: {
// //     type: String,
// //     required: [true, 'Category is required'],
// //     trim: true
// //   },
// //   status: {
// //     type: String,
// //     enum: ['draft', 'active', 'inactive', 'out_of_stock'],
// //     default: 'draft'
// //   },
// //   fulfillment: {
// //     type: String,
// //     enum: ['FBM', 'FBA'],
// //     default: 'FBM'
// //   },
// //   description: {
// //     type: String,
// //     trim: true
// //   },
// //   bulletPoints: [{
// //     type: String,
// //     trim: true,
// //     maxlength: [500, 'Bullet point cannot exceed 500 characters']
// //   }],
// //   keywords: {
// //     type: String,
// //     trim: true
// //   },
// //   mainImage: {
// //     type: String,
// //     required: [true, 'Main image is required']
// //   },
// //   additionalImages: [String],
// //   weight: {
// //     type: Number,
// //     min: [0, 'Weight cannot be negative']
// //   },
// //   dimensions: dimensionSchema,
// //   packageDimensions: dimensionSchema,
// //   packageWeight: {
// //     type: Number,
// //     min: [0, 'Package weight cannot be negative']
// //   },
// //   hazardous: {
// //     type: Boolean,
// //     default: false
// //   },
// //   adultProduct: {
// //     type: Boolean,
// //     default: false
// //   },
// //   condition: {
// //     type: String,
// //     enum: ['New', 'Refurbished', 'UsedLikeNew', 'UsedVeryGood', 'UsedGood', 'UsedAcceptable'],
// //     default: 'New'
// //   },
// //   conditionNote: {
// //     type: String,
// //     trim: true
// //   },
// //   taxCode: {
// //     type: String,
// //     default: 'A_GEN_TAX'
// //   },
// //   productType: {
// //     type: String,
// //     enum: ['Physical', 'Digital', 'Service', ''],
// //     default: ''
// //   },
// //   variationTheme: {
// //     type: String,
// //     enum: ['', 'Size', 'Color', 'SizeColor', 'Style', 'Material'],
// //     default: ''
// //   },
// //   parentChild: {
// //     type: String,
// //     enum: ['', 'Parent', 'Child'],
// //     default: ''
// //   },
// //   parentSku: {
// //     type: String,
// //     trim: true
// //   },
// //   relationshipType: {
// //     type: String,
// //     trim: true
// //   },
// //   shippingType: {
// //     type: String,
// //     enum: ['Standard', 'Expedited', 'International', 'TwoDay', 'OneDay'],
// //     default: 'Standard'
// //   },
// //   batteryType: {
// //     type: String,
// //     enum: ['', 'LithiumIon', 'LithiumPolymer', 'Alkaline', 'NiMH', 'NiCd', 'LeadAcid', 'ButtonCell'],
// //     default: ''
// //   },
// //   manufacturer: {
// //     type: String,
// //     trim: true
// //   },
// //   lowStockThreshold: {
// //     type: Number,
// //     default: 10
// //   }
// // }, {
// //   timestamps: true
// // });

// // // Index for better query performance
// // productSchema.index({ sku: 1 });
// // productSchema.index({ category: 1 });
// // productSchema.index({ status: 1 });
// // productSchema.index({ brand: 1 });
// // productSchema.index({ createdAt: -1 });

// // // Virtual for checking if product is low stock
// // productSchema.virtual('isLowStock').get(function() {
// //   return this.quantity > 0 && this.quantity <= this.lowStockThreshold;
// // });

// // // Instance method to update stock
// // productSchema.methods.updateStock = function(newQuantity) {
// //   this.quantity = newQuantity;
  
// //   if (newQuantity === 0) {
// //     this.status = 'out_of_stock';
// //   } else if (this.status === 'out_of_stock') {
// //     this.status = 'active';
// //   }
  
// //   return this.save();
// // };

// // // Static method to find low stock products
// // productSchema.statics.findLowStock = function() {
// //   return this.find({
// //     quantity: { $gt: 0, $lte: '$lowStockThreshold' },
// //     status: 'active'
// //   });
// // };

// // module.exports = mongoose.model('Product', productSchema);



import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Plus,
  X,
  ChevronRight
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const AddProductsUpload = ({ onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showMobileInstructions, setShowMobileInstructions] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setUploadResult({
        success: false,
        message: 'Please upload a CSV or Excel file'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/products/upload`, {
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
          message: `Successfully uploaded ${result.processed || 0} product${result.processed !== 1 ? 's' : ''}`,
          details: result
        });
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
        message: 'Network error: Unable to upload file'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['title', 'sku', 'asin', 'brand', 'price', 'quantity', 'category', 'description'],
      ['Sample Product', 'SKU-001', 'B012345678', 'Brand Name', '29.99', '100', 'Electronics', 'Product description here'],
      ['Another Product', 'SKU-002', 'B098765432', 'Another Brand', '49.99', '50', 'Home & Kitchen', 'Another description']
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Bulk Product Upload
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Upload a CSV or Excel file to add multiple products at once
            </p>
          </div>
          
          {/* Template download button - always visible */}
          <button
            onClick={downloadTemplate}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium transition-colors w-full sm:w-auto"
          >
            {/* Fixed: Use className for responsive sizing */}
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Download Template</span>
          </button>
        </div>
      </div>

      {/* Mobile instructions toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileInstructions(!showMobileInstructions)}
          className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg"
        >
          <span className="font-medium text-gray-900">View Instructions</span>
          <ChevronRight className={`w-5 h-5 transform transition-transform ${showMobileInstructions ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
        {/* Main upload section - spans 2 columns on desktop */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 lg:p-8">
            {/* Upload header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Upload Products
              </h2>
              
              {/* File info for mobile */}
              {selectedFile && (
                <div className="sm:hidden flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium truncate max-w-[180px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 md:p-8 text-center transition-colors hover:border-orange-400">
              <div className="max-w-md mx-auto">
                {/* Fixed: Use className for responsive sizing */}
                <Upload className="mx-auto w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-gray-400 mb-3 sm:mb-4" />
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Choose File
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                    {selectedFile && (
                      <div className="hidden sm:block mt-3">
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">{selectedFile.name}</span>
                          <button
                            onClick={clearSelection}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-500">
                    Supports .csv, .xlsx, .xls files up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {isUploading && (
              <div className="mt-4 sm:mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Processing file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload result */}
            {uploadResult && (
              <div className={`mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl flex items-start gap-3 sm:gap-4 ${
                uploadResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}>
                {uploadResult.success ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <p className={`font-medium text-sm sm:text-base ${
                    uploadResult.success ? "text-green-800" : "text-red-800"
                  }`}>
                    {uploadResult.message}
                  </p>

                  {/* Success actions */}
                  {uploadResult.success && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={onSuccess}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 bg-orange-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-orange-700 transition-colors flex-1 text-center"
                      >
                        View Products
                      </button>
                      
                      <button
                        onClick={() => window.location.reload()}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors flex-1 text-center flex items-center justify-center gap-2"
                      >
                        {/* Fixed: Use className for responsive sizing */}
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Upload More</span>
                      </button>
                    </div>
                  )}

                  {/* Error details */}
                  {uploadResult.details?.errors && uploadResult.details.errors.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-red-700 mb-2 text-sm sm:text-base">
                        Found {uploadResult.details.errors.length} error{uploadResult.details.errors.length !== 1 ? 's' : ''}:
                      </p>
                      <div className="max-h-40 overflow-y-auto">
                        <ul className="text-xs sm:text-sm text-red-600 space-y-1">
                          {uploadResult.details.errors.slice(0, 5).map((error, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                          {uploadResult.details.errors.length > 5 && (
                            <li className="text-gray-500">
                              ...and {uploadResult.details.errors.length - 5} more error{uploadResult.details.errors.length - 5 !== 1 ? 's' : ''}
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

        {/* Instructions sidebar - hidden on mobile by default */}
        <div className={`lg:col-span-1 ${showMobileInstructions ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 lg:p-8 sticky top-6">
            {/* Close button for mobile */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
              <button
                onClick={() => setShowMobileInstructions(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 hidden lg:block">
              Upload Instructions
            </h2>

            <div className="space-y-4 sm:space-y-5">
              {/* Required fields */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-sm">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
                      Required Fields
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-800 mt-1">
                      title, sku, brand, price, quantity, category
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional fields */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      Optional Fields
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      asin, description, bullet points, weight, dimensions
                    </p>
                  </div>
                </div>
              </div>

              {/* File format */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      File Format
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Use the template provided. Ensure all required fields are filled correctly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips section */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
                <h3 className="font-semibold text-amber-900 text-sm sm:text-base mb-3">
                  📋 Tips for Successful Upload
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-amber-800">
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Use unique SKUs for each product</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Price must be decimal format (e.g., 29.99)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Quantity must be whole numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Category must match existing categories in your store</span>
                  </li>
                </ul>
              </div>

              {/* Quick stats - hidden on mobile */}
              <div className="hidden lg:block pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 text-sm mb-3">Recent Upload Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">95%</p>
                    <p className="text-xs text-green-600">Success Rate</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">100+</p>
                    <p className="text-xs text-blue-600">Products/Day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA for mobile */}
      <div className="lg:hidden mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Download our detailed guide for bulk uploads
          </p>
          <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Download Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductsUpload;