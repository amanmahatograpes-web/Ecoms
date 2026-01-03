import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  Printer,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  Smartphone,
  Tablet,
  
  Laptop,
  Monitor,
  Globe,
  X,
  Info,
  Upload,
  Package2,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Shield,
  Camera,
  FileText,
  ExternalLink,
} from "lucide-react";

// Breakpoints for responsive design
const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 640,
  lg: 768,
  xl: 1024,
  '2xl': 1280,
  '3xl': 1536,
  '4xl': 1920
};

// Custom hook for responsive design
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const [deviceType, setDeviceType] = useState('desktop');
  const [breakpoint, setBreakpoint] = useState('xl');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowSize({ width, height: window.innerHeight });

      let currentBreakpoint = 'xs';
      if (width >= BREAKPOINTS['4xl']) currentBreakpoint = '4xl';
      else if (width >= BREAKPOINTS['3xl']) currentBreakpoint = '3xl';
      else if (width >= BREAKPOINTS['2xl']) currentBreakpoint = '2xl';
      else if (width >= BREAKPOINTS.xl) currentBreakpoint = 'xl';
      else if (width >= BREAKPOINTS.lg) currentBreakpoint = 'lg';
      else if (width >= BREAKPOINTS.md) currentBreakpoint = 'md';
      else if (width >= BREAKPOINTS.sm) currentBreakpoint = 'sm';
      
      setBreakpoint(currentBreakpoint);

      if (width < BREAKPOINTS.md) setDeviceType('mobile');
      else if (width < BREAKPOINTS.lg) setDeviceType('tablet');
      else if (width < BREAKPOINTS.xl) setDeviceType('laptop');
      else if (width < BREAKPOINTS['3xl']) setDeviceType('desktop');
      else setDeviceType('large-desktop');
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  const isDesktop = deviceType === 'desktop';
  const isLargeDesktop = deviceType === 'large-desktop';

  return {
    windowSize,
    deviceType,
    breakpoint,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isLargeDesktop
  };
};

// Device Icon Component
const DeviceIcon = ({ deviceType, size = 20 }) => {
  const icons = {
    mobile: <Smartphone size={size} />,
    tablet: <Tablet size={size} />,
    laptop: <Laptop size={size} />,
    desktop: <Monitor size={size} />,
    'large-desktop': <Globe size={size} />
  };
  
  return icons[deviceType] || <Monitor size={size} />;
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md", responsive }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full"
  };

  const modalSize = responsive.isMobile ? "full" : size;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`relative inline-block w-full ${
          modalSize === 'full' ? 'h-full' : sizeClasses[modalSize]
        } p-4 sm:p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className={modalSize === 'full' ? 'h-[calc(100%-80px)] overflow-y-auto' : ''}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirm Shipment Form Component
const ConfirmShipmentForm = ({ order, isOpen, onClose, onConfirm, responsive }) => {
  const [formData, setFormData] = useState({
    trackingNumber: "",
    carrier: "DTDC",
    shippingMethod: "Standard",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: ""
    },
    notes: "",
    documents: []
  });

  const carriers = [
    { value: "DTDC", label: "DTDC Express", icon: "🚚" },
    { value: "BLUEDART", label: "Blue Dart", icon: "✈️" },
    { value: "DELHIVERY", label: "Delhivery", icon: "📦" },
    { value: "AMAZON", label: "Amazon Shipping", icon: "🏢" },
    { value: "FEDEX", label: "FedEx", icon: "🚀" },
    { value: "OTHERS", label: "Other Carrier", icon: "🚛" }
  ];

  const shippingMethods = [
    { value: "Standard", label: "Standard (5-7 days)", price: "₹50" },
    { value: "Express", label: "Express (2-3 days)", price: "₹120" },
    { value: "NextDay", label: "Next Day Delivery", price: "₹250" },
    { value: "SameDay", label: "Same Day Delivery", price: "₹400" }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(order.id, formData);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Confirm Shipment"
      size={responsive.isMobile ? "full" : "lg"}
      responsive={responsive}
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <img
                src={order.image}
                className="w-16 h-16 rounded-lg border object-cover"
                alt={order.product}
              />
              <div>
                <h4 className="font-medium text-gray-900">{order.product}</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Order ID:</span>
                    <code className="px-2 py-1 bg-gray-100 rounded text-blue-600">{order.id}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>{order.buyer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={14} />
                    <span>Quantity: {order.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatPrice(order.price)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                Status: Pending
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                order.fulfillment === 'FBA' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {order.fulfillment}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Truck size={18} />
              Shipping Information
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.trackingNumber}
                  onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter tracking number"
                />
              </div>

              {/* Carrier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier *
                </label>
                <select
                  required
                  value={formData.carrier}
                  onChange={(e) => handleInputChange('carrier', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {carriers.map((carrier) => (
                    <option key={carrier.value} value={carrier.value}>
                      {carrier.icon} {carrier.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipping Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Method
                </label>
                <select
                  value={formData.shippingMethod}
                  onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {shippingMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label} ({method.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.5"
                />
              </div>

              {/* Dimensions */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Length"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Height"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Upload size={18} />
              Upload Documents
            </h4>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="document-upload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="document-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload shipping documents
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Uploaded Files */}
            {formData.documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          documents: prev.documents.filter((_, i) => i !== index)
                        }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Any special instructions or notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Truck size={18} />
              Confirm Shipment
            </button>
          </div>

          {/* Help Text */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Important:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Tracking number is required to update order status</li>
                  <li>• Customer will receive automatic shipping notification</li>
                  <li>• Estimated delivery date will be calculated based on shipping method</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

// Cancel Order Form Component
const CancelOrderForm = ({ order, isOpen, onClose, onConfirm, responsive }) => {
  const [formData, setFormData] = useState({
    reason: "OUT_OF_STOCK",
    refundType: "FULL",
    additionalInfo: "",
    notifyCustomer: true,
    restockInventory: true
  });

  const cancellationReasons = [
    { value: "OUT_OF_STOCK", label: "Out of Stock", icon: "📦" },
    { value: "PRICE_ERROR", label: "Pricing Error", icon: "💰" },
    { value: "CUSTOMER_REQUEST", label: "Customer Request", icon: "👤" },
    { value: "ADDRESS_ISSUE", label: "Address Issue", icon: "📍" },
    { value: "FRAUD_SUSPECTED", label: "Fraud Suspected", icon: "🚨" },
    { value: "OTHER", label: "Other Reason", icon: "📝" }
  ];

  const refundOptions = [
    { value: "FULL", label: "Full Refund", description: "Refund entire order amount" },
    { value: "PARTIAL", label: "Partial Refund", description: "Refund specific amount" },
    { value: "NO_REFUND", label: "No Refund", description: "Order was already shipped" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(order.id, formData);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Cancel Order"
      size={responsive.isMobile ? "full" : "md"}
      responsive={responsive}
    >
      <div className="space-y-6">
        {/* Warning Alert */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Cancel Order #{order.id}</h4>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. The customer will be notified and the order will be permanently cancelled.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-start gap-3">
            <img
              src={order.image}
              className="w-16 h-16 rounded-lg border object-cover"
              alt={order.product}
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{order.product}</h4>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <div className="font-medium">Order Value</div>
                  <div className="font-bold text-gray-900">{formatPrice(order.price)}</div>
                </div>
                <div>
                  <div className="font-medium">Quantity</div>
                  <div>{order.quantity}</div>
                </div>
                <div>
                  <div className="font-medium">Buyer</div>
                  <div>{order.buyer}</div>
                </div>
                <div>
                  <div className="font-medium">Order Date</div>
                  <div>{new Date(order.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reason for Cancellation *
            </label>
            <div className="space-y-2">
              {cancellationReasons.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.reason === reason.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={formData.reason === reason.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="mt-1"
                    required
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {reason.icon} {reason.label}
                    </div>
                    {reason.value === "OTHER" && formData.reason === "OTHER" && (
                      <div className="mt-2">
                        <textarea
                          value={formData.additionalInfo}
                          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Please specify the reason..."
                          required
                        />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Refund Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Refund Options *
            </label>
            <div className="space-y-2">
              {refundOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.refundType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="refundType"
                    value={option.value}
                    checked={formData.refundType === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, refundType: e.target.value }))}
                    className="mt-1"
                    required
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyCustomer}
                onChange={(e) => setFormData(prev => ({ ...prev, notifyCustomer: e.target.checked }))}
                className="rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Notify Customer</div>
                <div className="text-sm text-gray-600">
                  Send cancellation email to customer
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.restockInventory}
                onChange={(e) => setFormData(prev => ({ ...prev, restockInventory: e.target.checked }))}
                className="rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Restock Inventory</div>
                <div className="text-sm text-gray-600">
                  Return quantity to available stock
                </div>
              </div>
            </label>
          </div>

          {/* Impact Summary */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Impact Summary:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Order will be marked as "Cancelled"</li>
                  {formData.refundType !== "NO_REFUND" && (
                    <li>• {formatPrice(order.price * order.quantity)} will be refunded to customer</li>
                  )}
                  {formData.restockInventory && (
                    <li>• {order.quantity} unit(s) will be restocked</li>
                  )}
                  <li>• Seller metrics may be affected</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={18} />
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

// Order Card Component for Mobile View
const OrderCard = ({ order, statusColors, onAction }) => {
  const responsive = useResponsive();
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (responsive.isMobile) {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-blue-700 text-sm">{order.id}</div>
          <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            order.fulfillment === 'FBA' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {order.fulfillment}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex gap-3 mb-4">
        <img
          src={order.image}
          className="w-16 h-16 rounded-lg border object-cover"
          alt={order.product}
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
            {order.product}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Qty:</span> {order.quantity}
            </div>
            <div className="text-sm font-bold text-gray-900">
              {formatPrice(order.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="mb-4 p-2 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500 mb-1">Buyer</div>
        <div className="font-medium text-gray-900">{order.buyer}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {
        order.actions.map((action, index) => {
          let Icon, className;
          switch (action) {
            case "Confirm Shipment":
              Icon = Truck;
              className = "bg-blue-50 text-blue-700 hover:bg-blue-100";
              break;
            case "Print Invoice":
              Icon = Printer;
              className = "bg-gray-50 text-gray-700 hover:bg-gray-100";
              break;
            case "Track Order":
              Icon = CheckCircle;
              className = "bg-green-50 text-green-700 hover:bg-green-100";
              break;
            case "View Details":
              Icon = Eye;
              className = "bg-purple-50 text-purple-700 hover:bg-purple-100";
              break;
            default:
              Icon = Eye;
              className = "bg-gray-50 text-gray-700 hover:bg-gray-100";
          }

          return (
            <button
              key={index}
              onClick={() => onAction?.(action, order)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${className}`}
            >
              <Icon size={14} />
              <span>{responsive.isMobile ? action.split(' ')[0] : action}</span>
            </button>
          );
        })}
        
        {/* Cancel button for pending orders */}
        {order.status === 'Pending' && (
          <button
            onClick={() => onAction?.("Cancel Order", order)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100"
          >
            <XCircle size={14} />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Desktop Filters Component (keep the existing one)
const DesktopFilters = ({ 
  search, 
  setSearch, 
  statusFilter, 
  setStatusFilter, 
  fulfillmentFilter, 
  setFulfillmentFilter, 
  dateFilter, 
  setDateFilter,
  deviceType
}) => {
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  
  const filterGridCols = isTablet ? 'grid-cols-2' : 
                       isLaptop ? 'grid-cols-3 lg:grid-cols-4' : 
                       'grid-cols-4';

  return (
    <div className={`grid ${filterGridCols} gap-3 mb-6`}>
      {/* Search */}
      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
        <Search size={18} className="text-gray-500 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search Order ID or Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">All Status</option>
        <option value="Pending">🟡 Pending</option>
        <option value="Shipped">🔵 Shipped</option>
        <option value="Delivered">🟢 Delivered</option>
        <option value="Cancelled">🔴 Cancelled</option>
        <option value="Returned">🟣 Returned</option>
      </select>

      {/* Fulfillment Filter */}
      <select
        value={fulfillmentFilter}
        onChange={(e) => setFulfillmentFilter(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">All Fulfillment</option>
        <option value="FBA">📦 Amazon FBA</option>
        <option value="FBM">🚚 Merchant FBM</option>
      </select>

      {/* Date Filter */}
      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      >
        <option value="all">📅 Any Date</option>
        <option value="today">Today</option>
        <option value="7days">Last 7 days</option>
        <option value="30days">Last 30 days</option>
        <option value="custom">Custom Range</option>
      </select>
    </div>
  );
};

// Enhanced Table Component
const OrderTable = ({ 
  orders, 
  statusColors, 
  onAction,
  deviceType,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}) => {
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isTablet) {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    return sortDirection === 'asc' ? 
      <span className="ml-1">↑</span> : 
      <span className="ml-1">↓</span>;
  };

  // Determine which columns to show based on device
  const getTableHeaders = () => {
    if (isTablet) {
      return [
        { key: 'id', label: 'Order ID' },
        { key: 'product', label: 'Product' },
        { key: 'buyer', label: 'Buyer' },
        { key: 'price', label: 'Price' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ];
    } else if (isLaptop) {
      return [
        { key: 'id', label: 'Order ID' },
        { key: 'product', label: 'Product' },
        { key: 'buyer', label: 'Buyer' },
        { key: 'quantity', label: 'Qty' },
        { key: 'price', label: 'Price' },
        { key: 'fulfillment', label: 'Fulfillment' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ];
    } else {
      return [
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'buyer', label: 'Buyer', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'fulfillment', label: 'Fulfillment', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions' },
        { key: 'date', label: 'Date', sortable: true }
      ];
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              {getTableHeaders().map((header) => (
                <th 
                  key={header.key} 
                  className={`p-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    header.key === 'actions' ? 'text-right' : ''
                  }`}
                >
                  <button
                    onClick={() => header.sortable && handleSort(header.key)}
                    className={`flex items-center ${header.sortable ? 'cursor-pointer hover:text-blue-600' : ''}`}
                  >
                    {header.label}
                    {header.sortable && <SortIcon field={header.key} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Order ID */}
                <td className="p-3">
                  <div className="font-semibold text-blue-700 text-sm">{order.id}</div>
                  <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
                </td>

                {/* Product */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.image}
                      className="w-10 h-10 rounded border object-cover"
                      alt={order.product}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm line-clamp-2">
                        {order.product}
                      </div>
                      {isTablet && (
                        <div className="text-xs text-gray-500 mt-1">
                          Qty: {order.quantity} • {formatPrice(order.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Buyer - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{order.buyer}</div>
                  </td>
                )}

                {/* Quantity - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{order.quantity}</div>
                  </td>
                )}

                {/* Price */}
                <td className="p-3">
                  <div className="font-bold text-gray-900">{formatPrice(order.price)}</div>
                </td>

                {/* Fulfillment - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.fulfillment === 'FBA' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.fulfillment}
                    </span>
                  </td>
                )}

                {/* Status */}
                <td className="p-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    {order.actions.map((action, index) => {
                      let Icon, className;
                      switch (action) {
                        case "Confirm Shipment":
                          Icon = Truck;
                          className = "text-blue-600 hover:text-blue-800";
                          break;
                        case "Print Invoice":
                          Icon = Printer;
                          className = "text-gray-600 hover:text-gray-800";
                          break;
                        case "Track Order":
                          Icon = CheckCircle;
                          className = "text-green-600 hover:text-green-800";
                          break;
                        case "View Details":
                          Icon = Eye;
                          className = "text-purple-600 hover:text-purple-800";
                          break;
                        default:
                          Icon = Eye;
                          className = "text-gray-600 hover:text-gray-800";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => onAction?.(action, order)}
                          className={`flex items-center gap-1 text-xs font-medium hover:underline ${className}`}
                        >
                          <Icon size={12} />
                          <span>{isTablet ? action.split(' ')[0] : action}</span>
                        </button>
                      );
                    })}
                    
                    {/* Cancel button for pending orders */}
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => onAction?.("Cancel Order", order)}
                        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
                      >
                        <XCircle size={12} />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </td>

                {/* Date - Only on desktop */}
                {!isTablet && !isLaptop && (
                  <td className="p-3">
                    <div className="text-sm text-gray-600">{formatDate(order.date)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManageOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Modal states
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const responsive = useResponsive();
  const ordersPerPage = responsive.isMobile ? 5 : 
                       responsive.isTablet ? 8 : 
                       responsive.isLaptop ? 10 : 15;

  // Mock data
  const orders = useMemo(() => [
    {
      id: "112-4455677-998877",
      product: "Wireless Bluetooth Earbuds with Noise Cancellation",
      image: "https://m.media-amazon.com/images/I/61kRB0kmQOL._AC_UL320_.jpg",
      buyer: "Aman Kumar",
      price: 1299,
      date: "2025-12-01",
      quantity: 1,
      fulfillment: "FBA",
      status: "Shipped",
      actions: ["Print Invoice", "Track Order"],
    },
    {
      id: "113-7788990-221133",
      product: "USB-C Fast Charger 25W Power Adapter",
      image: "https://m.media-amazon.com/images/I/61rZyL1ZtCL._AC_UL320_.jpg",
      buyer: "Ravi Singh",
      price: 699,
      quantity: 2,
      date: "2025-11-29",
      fulfillment: "FBM",
      status: "Pending",
      actions: ["Confirm Shipment"],
    },
    // ... other orders (same as before)
  ], []);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Shipped: "bg-blue-100 text-blue-700 border border-blue-200",
    Delivered: "bg-green-100 text-green-700 border border-green-200",
    Cancelled: "bg-red-100 text-red-700 border border-red-200",
    Returned: "bg-purple-100 text-purple-700 border border-purple-200",
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch = 
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillment === fulfillmentFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order.date);
        const today = new Date();
        
        switch (dateFilter) {
          case "today":
            matchesDate = orderDate.toDateString() === today.toDateString();
            break;
          case "7days":
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            matchesDate = orderDate >= sevenDaysAgo;
            break;
          case "30days":
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            matchesDate = orderDate >= thirtyDaysAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesFulfillment && matchesDate;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, search, statusFilter, fulfillmentFilter, dateFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Handle order action
  const handleOrderAction = (action, order) => {
    console.log(`Action: ${action} for order: ${order.id}`);
    
    if (action === "Confirm Shipment") {
      setSelectedOrder(order);
      setShowShipmentModal(true);
    } else if (action === "Cancel Order") {
      setSelectedOrder(order);
      setShowCancelModal(true);
    } else {
      alert(`${action} clicked for order ${order.id}`);
    }
  };

  // Handle shipment confirmation
  const handleShipmentConfirm = (orderId, shipmentData) => {
    console.log(`Shipment confirmed for ${orderId}:`, shipmentData);
    alert(`Shipment confirmed for order ${orderId}!\nTracking: ${shipmentData.trackingNumber}`);
    // Here you would typically make an API call to update the order status
  };

  // Handle order cancellation
  const handleOrderCancel = (orderId, cancellationData) => {
    console.log(`Order ${orderId} cancelled:`, cancellationData);
    alert(`Order ${orderId} has been cancelled!\nReason: ${cancellationData.reason}`);
    // Here you would typically make an API call to cancel the order
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      alert("Please select orders first");
      return;
    }
    console.log(`Bulk ${action} for orders:`, selectedOrders);
    alert(`Bulk ${action} for ${selectedOrders.length} orders`);
  };

  // Export orders
  const handleExport = () => {
    alert(`Exporting ${filteredOrders.length} orders`);
  };

  // Refresh orders
  const handleRefresh = () => {
    setSearch("");
    setStatusFilter("all");
    setFulfillmentFilter("all");
    setDateFilter("all");
    setSelectedOrders([]);
  };

  return (
    <div className={`${responsive.isMobile ? 'p-3' : 'p-4 lg:p-6'} bg-white rounded-xl shadow-lg`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 ${responsive.isMobile ? 'p-1.5' : ''}`}>
            <Package className={`text-white ${responsive.isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-3xl'} text-gray-900`}>
              Manage Orders
            </h2>
            <p className={`text-gray-600 ${responsive.isMobile ? 'text-xs' : 'text-sm'}`}>
              {filteredOrders.length} orders • Amazon-style dashboard
            </p>
          </div>
        </div>

        {/* Device Indicator & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {!responsive.isMobile && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
              <DeviceIcon deviceType={responsive.deviceType} size={12} />
              <span className="text-gray-700">{responsive.deviceType.toUpperCase()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${responsive.isMobile ? 'p-1.5' : ''}`}
              title="Refresh"
            >
              <RefreshCw className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>
            
            <button
              onClick={handleExport}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${responsive.isMobile ? 'p-1.5' : ''}`}
              title="Export"
            >
              <Download className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!responsive.isMobile && (
        <div className={`grid ${responsive.isTablet ? 'grid-cols-2' : 'grid-cols-4'} gap-3 mb-6`}>
          {[
            { label: 'Total Orders', value: filteredOrders.length, color: 'bg-blue-50 text-blue-700', icon: Package },
            { label: 'Pending', value: filteredOrders.filter(o => o.status === 'Pending').length, color: 'bg-yellow-50 text-yellow-700', icon: AlertCircle },
            { label: 'Shipped', value: filteredOrders.filter(o => o.status === 'Shipped').length, color: 'bg-blue-50 text-blue-700', icon: Truck },
            { label: 'Delivered', value: filteredOrders.filter(o => o.status === 'Delivered').length, color: 'bg-green-50 text-green-700', icon: CheckCircle },
          ].map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${stat.color} flex items-center justify-between`}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
              </div>
              <stat.icon className="w-10 h-10 opacity-20" />
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {!responsive.isMobile && (
        <DesktopFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          fulfillmentFilter={fulfillmentFilter}
          setFulfillmentFilter={setFulfillmentFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          deviceType={responsive.deviceType}
        />
      )}

      {/* Orders Display */}
      {responsive.isMobile ? (
        // Mobile: Card View
        <div className="mb-6">
          {paginatedOrders.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
              <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  statusColors={statusColors}
                  onAction={handleOrderAction}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Tablet & Desktop: Table View
        <OrderTable
          orders={paginatedOrders}
          statusColors={statusColors}
          onAction={handleOrderAction}
          deviceType={responsive.deviceType}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft size={16} />
            {responsive.isMobile ? 'Prev' : 'Previous'}
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {responsive.isMobile ? 'Next' : 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <ConfirmShipmentForm
            order={selectedOrder}
            isOpen={showShipmentModal}
            onClose={() => {
              setShowShipmentModal(false);
              setSelectedOrder(null);
            }}
            onConfirm={handleShipmentConfirm}
            responsive={responsive}
          />
          
          <CancelOrderForm
            order={selectedOrder}
            isOpen={showCancelModal}
            onClose={() => {
              setShowCancelModal(false);
              setSelectedOrder(null);
            }}
            onConfirm={handleOrderCancel}
            responsive={responsive}
          />
        </>
      )}
    </div>
  );
}; 

export default ManageOrders;