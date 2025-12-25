import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const SponsoredBrands = () => {
  const [currentSlide, setCurrentSlide] = useState({});

  // Multi-vendor sponsored brand data
  const sponsoredBrands = [
    {
      id: 1,
      vendorName: "TechGear Pro",
      logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=80&fit=crop",
      tagline: "Premium Electronics & Accessories",
      products: [
        {
          id: 101,
          name: "Wireless Earbuds Pro",
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
          price: 79.99,
          originalPrice: 129.99,
          rating: 4.5,
          reviews: 2847
        },
        {
          id: 102,
          name: "Smart Watch Series X",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
          price: 199.99,
          originalPrice: 299.99,
          rating: 4.7,
          reviews: 1923
        },
        {
          id: 103,
          name: "Portable Charger 20000mAh",
          image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop",
          price: 34.99,
          originalPrice: 59.99,
          rating: 4.6,
          reviews: 3201
        },
        {
          id: 104,
          name: "USB-C Hub Adapter",
          image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop",
          price: 45.99,
          originalPrice: 69.99,
          rating: 4.4,
          reviews: 1456
        }
      ]
    },
    {
      id: 2,
      vendorName: "HomeStyle Essentials",
      logo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=80&fit=crop",
      tagline: "Transform Your Living Space",
      products: [
        {
          id: 201,
          name: "Modern Table Lamp",
          image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
          price: 42.99,
          originalPrice: 79.99,
          rating: 4.3,
          reviews: 892
        },
        {
          id: 202,
          name: "Decorative Throw Pillows Set",
          image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&h=300&fit=crop",
          price: 29.99,
          originalPrice: 49.99,
          rating: 4.5,
          reviews: 1567
        },
        {
          id: 203,
          name: "Wall Art Canvas Print",
          image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop",
          price: 54.99,
          originalPrice: 89.99,
          rating: 4.6,
          reviews: 723
        },
        {
          id: 204,
          name: "Ceramic Vase Set",
          image: "https://images.unsplash.com/photo-1578500351865-d99c7a65d2c5?w=300&h=300&fit=crop",
          price: 38.99,
          originalPrice: 64.99,
          rating: 4.4,
          reviews: 445
        }
      ]
    },
    {
      id: 3,
      vendorName: "FitLife Athletics",
      logo: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=80&fit=crop",
      tagline: "Elevate Your Fitness Journey",
      products: [
        {
          id: 301,
          name: "Yoga Mat Premium",
          image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop",
          price: 39.99,
          originalPrice: 69.99,
          rating: 4.7,
          reviews: 2134
        },
        {
          id: 302,
          name: "Resistance Bands Set",
          image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=300&h=300&fit=crop",
          price: 24.99,
          originalPrice: 44.99,
          rating: 4.5,
          reviews: 1678
        },
        {
          id: 303,
          name: "Dumbbell Set Adjustable",
          image: "https://images.unsplash.com/photo-1517344800994-a8f28fc4f517?w=300&h=300&fit=crop",
          price: 89.99,
          originalPrice: 149.99,
          rating: 4.8,
          reviews: 3456
        },
        {
          id: 304,
          name: "Foam Roller",
          image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=300&fit=crop",
          price: 27.99,
          originalPrice: 44.99,
          rating: 4.4,
          reviews: 987
        }
      ]
    }
  ];

  const nextSlide = (brandId) => {
    setCurrentSlide(prev => ({
      ...prev,
      [brandId]: ((prev[brandId] || 0) + 1) % Math.ceil(sponsoredBrands.find(b => b.id === brandId).products.length / 4)
    }));
  };

  const prevSlide = (brandId) => {
    const brand = sponsoredBrands.find(b => b.id === brandId);
    setCurrentSlide(prev => ({
      ...prev,
      [brandId]: ((prev[brandId] || 0) - 1 + Math.ceil(brand.products.length / 4)) % Math.ceil(brand.products.length / 4)
    }));
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {sponsoredBrands.map((brand) => {
          const slideIndex = currentSlide[brand.id] || 0;
          const visibleProducts = brand.products.slice(slideIndex * 4, (slideIndex * 4) + 4);
          
          return (
            <div key={brand.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Sponsored Label */}
              <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 font-medium">
                Sponsored
              </div>

              {/* Brand Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <img 
                    src={brand.logo} 
                    alt={brand.vendorName}
                    className="h-16 w-32 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{brand.vendorName}</h2>
                    <p className="text-gray-600 mt-1">{brand.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Products Carousel */}
              <div className="relative p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {visibleProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="group cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {calculateDiscount(product.originalPrice, product.price) > 0 && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            -{calculateDiscount(product.originalPrice, product.price)}%
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({product.reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Prime Badge */}
                      <div className="mt-2">
                        <span className="inline-flex items-center text-xs text-teal-700 font-medium">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                          </svg>
                          Prime
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {brand.products.length > 4 && (
                  <>
                    <button
                      onClick={() => prevSlide(brand.id)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
                      aria-label="Previous products"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => nextSlide(brand.id)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
                      aria-label="Next products"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* View Store Link */}
              <div className="px-6 pb-6">
                <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Visit {brand.vendorName} Store →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsoredBrands;