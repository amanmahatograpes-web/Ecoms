import React from 'react';

const ImagesTab = ({ product, handleImageUpload }) => {
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Image *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "main")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        {product.mainImage && (
          <div className="mt-4">
            <img
              src={product.mainImage}
              alt="Main"
              className="w-40 h-40 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Images (Up to 6)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImageUpload(e, "additional")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {product.additionalImages.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`Additional ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Image Guidelines</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Amazon recommends square images (1000×1000px) for zoom support</li>
          <li>Main image should have pure white background (#FFFFFF)</li>
          <li>Images must cover at least 85% of the frame</li>
          <li>Supported formats: JPEG, PNG, GIF, TIFF</li>
        </ul>
      </div>
    </div>
  );
};

export default ImagesTab;