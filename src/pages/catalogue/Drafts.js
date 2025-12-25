import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  Search, 
  Filter,
  Loader,
  MoreVertical,
  Eye,
  ChevronRight,
  Download,
  AlertCircle,
  Clock
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const Drafts = ({ refreshTrigger }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchDrafts();
  }, [refreshTrigger]);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching drafts...');
      
      const response = await fetch(`${API_BASE_URL}/products?status=draft`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📦 API Response:', result);
      
      if (result.success && Array.isArray(result.data)) {
        setDrafts(result.data);
      } else {
        console.warn('Unexpected response format');
        setDrafts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching drafts:', error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchDrafts();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft');
    }
  };

  const exportDrafts = () => {
    const csvContent = [
      ['Title', 'SKU', 'Brand', 'Category', 'Status', 'Created Date'],
      ...drafts.map(draft => [
        draft.title,
        draft.sku,
        draft.brand,
        draft.category,
        draft.status,
        new Date(draft.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drafts_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || draft.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        {/* Header skeleton */}
        <div className="animate-pulse mb-6">
          <div className="h-7 sm:h-8 bg-gray-200 rounded w-3/4 sm:w-1/3 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full sm:w-1/2"></div>
        </div>
        
        {/* Search/filter skeleton */}
        <div className="animate-pulse mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
            <div className="w-full sm:w-48 h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Table skeleton */}
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Product Drafts
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Complete products you saved as drafts
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={exportDrafts}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium transition-colors"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <button
              onClick={fetchDrafts}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium transition-colors"
            >
              <Loader className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Stats summary */}
        <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-gray-900">{drafts.length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Draft</span>
              <span className="text-lg font-bold text-yellow-600">
                {drafts.filter(d => d.status === 'draft').length}
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Incomplete</span>
              <span className="text-lg font-bold text-blue-600">
                {drafts.filter(d => d.status === 'incomplete').length}
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Filtered</span>
              <span className="text-lg font-bold text-green-600">{filteredDrafts.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search drafts by title, SKU, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="incomplete">Incomplete</option>
                <option value="pending_review">Pending Review</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Drafts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile view toggle */}
        <div className="lg:hidden p-4 border-b border-gray-200">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
          >
            <span className="font-medium text-gray-900">
              View Options ({filteredDrafts.length} drafts)
            </span>
            <ChevronRight className={`w-5 h-5 transform transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {filteredDrafts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-gray-300 mb-4">
              <Calendar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              No drafts found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto px-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start creating products to see drafts here'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create First Product
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Desktop table header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 sm:p-5 md:p-6 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-4">Product</div>
              <div className="col-span-2">SKU</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Drafts list - mobile card view, desktop table view */}
            <div className="divide-y divide-gray-200">
              {filteredDrafts.map((draft) => (
                <div key={draft.id} className="p-4 sm:p-5 md:p-6 hover:bg-gray-50 transition-colors">
                  {/* Mobile/Tablet View */}
                  <div className="lg:hidden">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {draft.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                            draft.status === 'draft' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : draft.status === 'incomplete'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {draft.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">SKU:</span>
                            <span className="truncate">{draft.sku}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Brand:</span>
                            <span className="truncate">{draft.brand}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Category:</span>
                            <span className="truncate">{draft.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-3">
                        <button
                          onClick={() => setSelectedDraft(selectedDraft === draft.id ? null : draft.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Mobile action menu */}
                    {selectedDraft === draft.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {/* Edit */}}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteDraft(draft.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop View */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <Eye className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {draft.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {draft.category} • {new Date(draft.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <code className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {draft.sku}
                      </code>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm text-gray-700">{draft.brand}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        draft.status === 'draft' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : draft.status === 'incomplete'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {draft.status?.charAt(0).toUpperCase() + draft.status?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {/* Edit */}}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Draft"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Draft"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {/* View */}}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer stats and pagination */}
      {filteredDrafts.length > 0 && (
        <div className="mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{filteredDrafts.length}</span> of{' '}
              <span className="font-medium text-gray-700">{drafts.length}</span> drafts
            </div>
            
            {/* Pagination for larger screens */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">Page 1 of 1</span>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </div>
            
            {/* Mobile pagination */}
            <div className="sm:hidden flex items-center justify-between">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Load More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state guidance */}
      {drafts.length === 0 && !loading && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 text-sm sm:text-base">
                Getting Started with Product Drafts
              </h4>
              <ul className="mt-2 text-xs sm:text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Save products as drafts while creating them</li>
                <li>Drafts automatically appear here for completion</li>
                <li>Use bulk upload for multiple products at once</li>
                <li>Export drafts to CSV for offline editing</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drafts;