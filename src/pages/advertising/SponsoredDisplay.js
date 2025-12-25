import React, { useState, useMemo } from "react";
import { Search, Settings, Target, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function SponsoredDisplay() {
  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState(50);
  const [bidding, setBidding] = useState("cpc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleProducts = useMemo(() => [
    { id: 1, title: "Wireless Earbuds Pro", asin: "B0A12345XY", price: 49.99, category: "Electronics", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=160&h=160&fit=crop" },
    { id: 2, title: "Smartwatch Pro X", asin: "B0B65732AB", price: 299.99, category: "Wearables", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&h=160&fit=crop" },
    { id: 3, title: "Laptop Cooling Pad RGB", asin: "B0C98111CD", price: 34.99, category: "Accessories", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=160&h=160&fit=crop" },
    { id: 4, title: "Mechanical Keyboard", asin: "B0D45678EF", price: 89.99, category: "Accessories", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=160&h=160&fit=crop" },
    { id: 5, title: "Portable SSD 1TB", asin: "B0E23456GH", price: 119.99, category: "Storage", img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=160&h=160&fit=crop" },
    { id: 6, title: "USB-C Hub Multi-Port", asin: "B0F78901IJ", price: 29.99, category: "Accessories", img: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=160&h=160&fit=crop" }
  ], []);

  const filteredProducts = useMemo(() => {
    const searchLower = search.toLowerCase();
    return sampleProducts.filter(p =>
      p.title.toLowerCase().includes(searchLower) ||
      p.asin.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  }, [search, sampleProducts]);

  const toggleProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    if (errors.products) setErrors(prev => ({ ...prev, products: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!campaignName.trim()) newErrors.campaignName = "Campaign name is required";
    else if (campaignName.length < 3) newErrors.campaignName = "Campaign name must be at least 3 characters";
    if (budget < 5) newErrors.budget = "Minimum budget is $5";
    if (selectedProducts.length === 0) newErrors.products = "Please select at least one product";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCampaign = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const campaignData = {
      name: campaignName,
      budget,
      bidding,
      products: sampleProducts.filter(p => selectedProducts.includes(p.id)),
      createdAt: new Date().toISOString()
    };
    console.log("Campaign Created:", campaignData);
    alert(`✅ Campaign "${campaignName}" created successfully!`);
    setCampaignName(""); setBudget(50); setBidding("cpc"); setSelectedProducts([]); setSearch(""); setIsSubmitting(false);
  };

  const estimatedReach = useMemo(() => Math.floor(budget * 100 * (selectedProducts.length || 1)), [budget, selectedProducts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sponsored Display Campaign
          </h1>
          <p className="text-gray-600">Create and manage your Sponsored Display campaigns</p>
        </div>

        {/* Campaign Settings Card */}
        <div className="rounded-2xl shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Settings size={20}/> Campaign Settings</h2>
          </div>
          <div className="p-6 space-y-5">

            {/* Campaign Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Campaign Name *</label>
              <input 
                value={campaignName} 
                onChange={e => { setCampaignName(e.target.value); if(errors.campaignName) setErrors(prev => ({ ...prev, campaignName: null })); }}
                placeholder="e.g., Holiday Promo 2024" 
                className={`w-full px-3 py-2 border rounded-lg ${errors.campaignName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.campaignName && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.campaignName}</p>
              )}
            </div>

            {/* Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Daily Budget</label>
                <span className="text-xl font-bold text-blue-600">${budget}</span>
              </div>
              <input type="range" min={5} max={500} step={5} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full h-2 rounded-lg bg-blue-200"/>
              <div className="flex justify-between text-xs text-gray-500"><span>$5</span><span>$500</span></div>
              {errors.budget && (
                <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.budget}</p>
              )}
            </div>

            {/* Bidding Strategy */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Bidding Strategy</label>
              <select value={bidding} onChange={e => setBidding(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="cpc">CPC - Cost Per Click</option>
                <option value="vcpm">vCPM - Viewable Impressions</option>
              </select>
            </div>

            {/* Estimated Metrics */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Estimated Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Est. Daily Reach</p>
                  <p className="text-lg font-bold text-blue-600">{estimatedReach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Selected Products</p>
                  <p className="text-lg font-bold text-purple-600">{selectedProducts.length}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Product Targeting Card */}
        <div className="rounded-2xl shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Target size={20}/> Product Targeting</h2>
          </div>
          <div className="p-6 space-y-5">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/> 
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 w-full px-3 py-2 border rounded-lg border-gray-300"/>
            </div>

            {/* Selected Count */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <CheckCircle size={16}/> {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.length > 0 ? filteredProducts.map(p => {
                const isSelected = selectedProducts.includes(p.id);
                return (
                  <div key={p.id} className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${isSelected ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200'}`} onClick={() => toggleProduct(p.id)}>
                    <div className="flex items-center gap-4">
                      <img src={p.img} alt={p.title} className="w-20 h-20 rounded-lg object-cover border border-gray-200"/>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-500 mt-1">ASIN: {p.asin}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-bold text-green-600">${p.price}</span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{p.category}</span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="text-purple-600 flex-shrink-0" size={24}/>}
                    </div>
                  </div>
                );
              }) : <div className="col-span-2 text-center py-12 text-gray-500">No products found matching "{search}"</div>}
            </div>

            {errors.products && <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-lg"><AlertCircle size={16}/> {errors.products}</p>}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={() => { setCampaignName(""); setBudget(50); setBidding("cpc"); setSelectedProducts([]); setSearch(""); setErrors({}); }} className="rounded-xl px-6 py-5 text-base border border-gray-300 hover:bg-gray-100">Reset</button>
          <button onClick={handleCreateCampaign} disabled={isSubmitting} className="rounded-xl px-8 py-5 text-base shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 text-white">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <><Plus size={20}/> Create Campaign</>}
          </button>
        </div>

      </div>
    </div>
  );
}
