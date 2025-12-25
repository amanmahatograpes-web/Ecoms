import React, { useState, useEffect, useCallback } from 'react';

// Constants
const PAYMENT_GATEWAYS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  AMAZON_PAY: 'amazonPay',
  RAZORPAY: 'razorpay',
  CREDIT_CARD: 'creditCard',
  DEBIT_CARD: 'debitCard',
  NET_BANKING: 'netBanking',
  UPI: 'upi',
  CASH_ON_DELIVERY: 'cashOnDelivery'
};

const TRANSACTION_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending'
};

const CHECKOUT_STEPS = {
  CART: 'cart',
  ADDRESS: 'address',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation'
};

const PAYMENT_METHODS = [
  {
    id: PAYMENT_GATEWAYS.AMAZON_PAY,
    name: 'Amazon Pay',
    icon: '🟠',
    description: 'Pay with your Amazon balance',
    color: 'bg-orange-100 border-orange-200',
    available: true
  },
  {
    id: PAYMENT_GATEWAYS.CREDIT_CARD,
    name: 'Credit Card',
    icon: '💳',
    description: 'Visa, Mastercard, American Express',
    color: 'bg-blue-50 border-blue-100',
    available: true,
    cardTypes: ['Visa', 'Mastercard', 'American Express', 'Discover']
  },
  {
    id: PAYMENT_GATEWAYS.DEBIT_CARD,
    name: 'Debit Card',
    icon: '🏦',
    description: 'Linked to your bank account',
    color: 'bg-green-50 border-green-100',
    available: true,
    cardTypes: ['Visa', 'Mastercard', 'RuPay']
  },
  {
    id: PAYMENT_GATEWAYS.PAYPAL,
    name: 'PayPal',
    icon: '💙',
    description: 'Pay with your PayPal account',
    color: 'bg-blue-50 border-blue-200',
    available: true
  },
  {
    id: PAYMENT_GATEWAYS.UPI,
    name: 'UPI',
    icon: '📱',
    description: 'Instant payments with UPI',
    color: 'bg-purple-50 border-purple-100',
    available: true,
    upiApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM']
  },
  {
    id: PAYMENT_GATEWAYS.NET_BANKING,
    name: 'Net Banking',
    icon: '🏛️',
    description: 'Direct bank transfer',
    color: 'bg-indigo-50 border-indigo-100',
    available: true,
    banks: [
      'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank',
      'Kotak Mahindra Bank', 'Bank of Baroda', 'Punjab National Bank',
      'Canara Bank', 'Union Bank of India', 'Bank of India'
    ]
  },
  {
    id: PAYMENT_GATEWAYS.CASH_ON_DELIVERY,
    name: 'Cash on Delivery',
    icon: '💰',
    description: 'Pay when you receive your order',
    color: 'bg-yellow-50 border-yellow-100',
    available: true,
    note: 'Available for orders below $500'
  },
  {
    id: PAYMENT_GATEWAYS.STRIPE,
    name: 'Stripe',
    icon: '💳',
    description: 'Secure card payments via Stripe',
    color: 'bg-gray-50 border-gray-200',
    available: true
  },
  {
    id: PAYMENT_GATEWAYS.RAZORPAY,
    name: 'Razorpay',
    icon: '⚡',
    description: 'Instant payment processing',
    color: 'bg-pink-50 border-pink-100',
    available: true
  }
];

const REDIRECT_DELAY = 10000; // 10 seconds

// Mock Data
const MOCK_CART_ITEMS = [
  {
    id: 1,
    name: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
    price: 199.99,
    originalPrice: 249.99,
    quantity: 1,
    image: '🎧',
    inStock: true,
    deliveryDate: 'Friday, December 15',
    seller: 'Amazon.com'
  },
  {
    id: 2,
    name: 'Anker PowerCore 10000 Portable Charger',
    price: 25.99,
    originalPrice: 35.99,
    quantity: 2,
    image: '🔋',
    inStock: true,
    deliveryDate: 'Tomorrow, December 12',
    seller: 'Anker Direct'
  },
  {
    id: 3,
    name: 'Amazon Basics Microfiber Sheet Set, Queen, Charcoal Gray',
    price: 29.99,
    originalPrice: 39.99,
    quantity: 1,
    image: '🛏️',
    inStock: true,
    deliveryDate: 'Monday, December 18',
    seller: 'Amazon Basics'
  },
  {
    id: 4,
    name: 'Echo Dot (5th Gen) | Smart speaker with Alexa | Charcoal',
    price: 49.99,
    originalPrice: 59.99,
    quantity: 1,
    image: '🎵',
    inStock: true,
    deliveryDate: 'Thursday, December 14',
    seller: 'Amazon.com'
  },
  {
    id: 5,
    name: 'Kindle Paperwhite | 16GB | Now with a 6.8" display',
    price: 139.99,
    originalPrice: 169.99,
    quantity: 1,
    image: '📖',
    inStock: true,
    deliveryDate: 'Tuesday, December 19',
    seller: 'Amazon.com'
  }
];

const MOCK_ADDRESSES = [
  {
    id: 1,
    name: 'John Doe',
    address1: '123 Main Street, Apt 4B',
    address2: 'Near Central Park',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true,
    type: 'Home'
  },
  {
    id: 2,
    name: 'John Doe',
    address1: '456 Office Tower, Suite 1200',
    address2: 'Financial District',
    city: 'New York',
    state: 'NY',
    zipCode: '10005',
    country: 'United States',
    phone: '+1 (555) 987-6543',
    isDefault: false,
    type: 'Office'
  },
  {
    id: 3,
    name: 'Jane Doe',
    address1: '789 Suburban Lane',
    address2: '',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    country: 'United States',
    phone: '+1 (555) 456-7890',
    isDefault: false,
    type: 'Home'
  }
];

const MOCK_ORDER_DATA = {
  orderId: '114-9520769-5162647',
  date: 'December 11, 2024',
  total: 280.96,
  items: [
    {
      id: 1,
      name: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
      price: 199.99,
      quantity: 1,
      image: '🎧',
      deliveryDate: 'Friday, December 15',
      status: 'Preparing for shipment'
    },
    {
      id: 2,
      name: 'Anker PowerCore 10000 Portable Charger',
      price: 25.99,
      quantity: 2,
      image: '🔋',
      deliveryDate: 'Tomorrow, December 12',
      status: 'Shipping now'
    },
    {
      id: 3,
      name: 'Amazon Basics Microfiber Sheet Set',
      price: 29.99,
      quantity: 1,
      image: '🛏️',
      deliveryDate: 'Monday, December 18',
      status: 'Order received'
    }
  ],
  shippingAddress: {
    name: 'John Doe',
    address1: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567'
  },
  paymentMethod: 'Amazon Pay',
  email: 'john.doe@email.com'
};

// Payment Service
class PaymentService {
  static async processPayment(gateway, orderData, paymentDetails = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const timestamp = Date.now();
    const responses = {
      [PAYMENT_GATEWAYS.STRIPE]: {
        success: true,
        transactionId: `pi_${timestamp}_mock`,
        status: 'succeeded',
        gateway: 'Stripe'
      },
      [PAYMENT_GATEWAYS.PAYPAL]: {
        success: true,
        transactionId: `PAYPAL-${timestamp}`,
        status: 'COMPLETED',
        gateway: 'PayPal'
      },
      [PAYMENT_GATEWAYS.AMAZON_PAY]: {
        success: true,
        transactionId: `S01-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'Authorized',
        gateway: 'Amazon Pay'
      },
      [PAYMENT_GATEWAYS.RAZORPAY]: {
        success: true,
        transactionId: `order_${timestamp}`,
        status: 'paid',
        gateway: 'Razorpay'
      },
      [PAYMENT_GATEWAYS.CREDIT_CARD]: {
        success: true,
        transactionId: `CC_${timestamp}`,
        status: 'succeeded',
        gateway: 'Credit Card',
        last4: paymentDetails.cardNumber?.slice(-4) || '4242'
      },
      [PAYMENT_GATEWAYS.DEBIT_CARD]: {
        success: true,
        transactionId: `DC_${timestamp}`,
        status: 'succeeded',
        gateway: 'Debit Card',
        last4: paymentDetails.cardNumber?.slice(-4) || '4242'
      },
      [PAYMENT_GATEWAYS.UPI]: {
        success: true,
        transactionId: `UPI_${timestamp}`,
        status: 'completed',
        gateway: 'UPI',
        upiId: paymentDetails.upiId || 'user@upi'
      },
      [PAYMENT_GATEWAYS.NET_BANKING]: {
        success: true,
        transactionId: `NB_${timestamp}`,
        status: 'processed',
        gateway: 'Net Banking',
        bank: paymentDetails.bank || 'HDFC Bank'
      },
      [PAYMENT_GATEWAYS.CASH_ON_DELIVERY]: {
        success: true,
        transactionId: `COD_${timestamp}`,
        status: 'pending',
        gateway: 'Cash on Delivery'
      }
    };
    
    // 10% chance of failure for simulation
    const shouldFail = Math.random() < 0.1;
    
    if (shouldFail) {
      return {
        success: false,
        transactionId: `FAILED_${timestamp}`,
        status: 'failed',
        gateway: PAYMENT_METHODS.find(m => m.id === gateway)?.name || gateway,
        error: 'Payment declined. Please try another payment method.'
      };
    }
    
    return responses[gateway] || responses[PAYMENT_GATEWAYS.AMAZON_PAY];
  }
}

// Utility functions
const generateOrderId = () => {
  return `114-${Math.floor(Math.random() * 10000000)}-${Math.floor(Math.random() * 1000000)}`;
};

const generateTransactionId = () => {
  return `TXN${Date.now()}`;
};

const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const formatDateTime = () => {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  for (let i = 0; i < match.length; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  return parts.length ? parts.join(' ') : value;
};

const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
  }
  return v;
};

// Cart View Component
const CartView = ({ cartItems, onUpdateQuantity, onRemoveItem, onProceedToAddress, isMobile }) => {
  const subtotal = calculateSubtotal(cartItems);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Cart Items ({cartItems.length})</h2>
              <span className="text-sm text-gray-600">Price</span>
            </div>
            
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Sold by: {item.seller}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Qty:</span>
                            <select 
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                              value={item.quantity}
                              onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                            >
                              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                        {item.originalPrice > item.price && (
                          <div className="text-sm text-gray-500 line-through">${(item.originalPrice * item.quantity).toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="text-sm text-green-700 font-medium">
                        <span className="mr-2">📦</span>
                        {item.deliveryDate}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({cartItems.length}):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Order Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onProceedToAddress}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold mb-4 transition-colors"
              disabled={cartItems.length === 0}
            >
              Proceed to checkout
            </button>
            
            <div className="text-xs text-gray-600">
              <p className="mb-2">By placing your order, you agree to Amazon's:</p>
              <ul className="space-y-1">
                <li><a href="#" className="text-blue-600 hover:underline">Conditions of Use</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Privacy Notice</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Address View Component
const AddressView = ({ addresses, onSelectAddress, onProceedToPayment, isMobile, onAddNewAddress }) => {
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    type: 'Home'
  });

  const handleSubmitAddress = () => {
    if (!newAddress.name || !newAddress.address1 || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.phone) {
      alert('Please fill all required fields');
      return;
    }
    
    // In real app, you would save the address to backend
    alert('Address added successfully!');
    setShowAddForm(false);
    setNewAddress({
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      type: 'Home'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Select Delivery Address</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold">Your Addresses</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium text-sm"
              >
                + Add New Address
              </button>
            </div>
            
            {showAddForm ? (
              <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Add New Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.address1}
                      onChange={(e) => setNewAddress({...newAddress, address1: e.target.value})}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address Line 2</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.address2}
                      onChange={(e) => setNewAddress({...newAddress, address2: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newAddress.country}
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleSubmitAddress}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
                  >
                    Save Address
                  </button>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(address => (
                <div 
                  key={address.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedAddressId === address.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{address.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{address.type}</span>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Default</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{address.address1}</p>
                        {address.address2 && <p>{address.address2}</p>}
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                        <p className="mt-2">📞 {address.phone}</p>
                      </div>
                    </div>
                    {selectedAddressId === address.id && (
                      <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
            >
              ← Back to Cart
            </button>
            <button 
              onClick={() => onProceedToPayment(selectedAddressId)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
            >
              Continue to Payment
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Free delivery on orders over $35</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Fast delivery with Amazon Prime</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Easy returns within 30 days</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-gray-600">Need help with delivery?</p>
                <a href="#" className="text-blue-600 hover:underline text-sm">Contact customer service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Form Components
const CreditCardForm = ({ onCardDetailsChange, isMobile, isDebit = false }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    const detectCardType = (number) => {
      const num = number.replace(/\s/g, '');
      if (/^4/.test(num)) return 'Visa';
      if (/^5[1-5]/.test(num)) return 'Mastercard';
      if (/^3[47]/.test(num)) return 'American Express';
      if (/^6(?:011|5)/.test(num)) return 'Discover';
      return '';
    };

    const type = detectCardType(cardNumber);
    setCardType(type);
    onCardDetailsChange({ cardNumber, expiryDate, cvv, nameOnCard, cardType: type });
  }, [cardNumber, expiryDate, cvv, nameOnCard, onCardDetailsChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Card number</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength="19"
        />
        {cardType && (
          <div className="mt-1 text-xs text-gray-600">Detected: {cardType}</div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expiration (MM/YY)</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            maxLength="5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            maxLength="4"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Name on card</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="John Doe"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="saveCard" className="w-4 h-4" defaultChecked />
        <label htmlFor="saveCard" className="text-sm">
          Save this {isDebit ? 'debit' : 'credit'} card for future purchases
        </label>
      </div>
    </div>
  );
};

const UPIForm = ({ onUpiDetailsChange, isMobile }) => {
  const [upiId, setUpiId] = useState('');
  const [selectedApp, setSelectedApp] = useState('');

  useEffect(() => {
    onUpiDetailsChange({ upiId, upiApp: selectedApp });
  }, [upiId, selectedApp, onUpiDetailsChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">UPI ID</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="username@bank"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">Example: john.doe@icici</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Select UPI App</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
            <button
              key={app}
              type="button"
              className={`px-3 py-3 border rounded text-sm flex flex-col items-center justify-center gap-1 ${
                selectedApp === app 
                  ? 'border-orange-500 bg-orange-50 text-orange-700' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setSelectedApp(app)}
            >
              <span className="text-lg">{app === 'Google Pay' ? 'G' : app === 'PhonePe' ? 'P' : app === 'Paytm' ? 'P' : 'B'}</span>
              <span>{app}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          You'll be redirected to your UPI app to complete the payment. Please have your UPI PIN ready.
        </p>
      </div>
    </div>
  );
};

const NetBankingForm = ({ onBankDetailsChange, isMobile }) => {
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    onBankDetailsChange({ bank: selectedBank });
  }, [selectedBank, onBankDetailsChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select your bank</label>
        <select 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          <option value="">Choose your bank</option>
          {[
            'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank',
            'Kotak Mahindra Bank', 'Bank of Baroda', 'Punjab National Bank',
            'Canara Bank', 'Union Bank of India', 'Bank of India'
          ].map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          You'll be redirected to your bank's secure portal to complete the payment.
        </p>
      </div>
    </div>
  );
};

const CashOnDeliveryForm = () => (
  <div className="space-y-4">
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <span className="text-yellow-600 text-xl">ℹ️</span>
        <div>
          <h4 className="font-medium text-yellow-900">Cash on Delivery</h4>
          <p className="text-sm text-yellow-800 mt-1">
            You'll pay cash when your order arrives. A delivery executive will collect the payment.
            Please keep exact change ready.
          </p>
          <div className="mt-2 text-sm">
            <p className="font-medium">Important Notes:</p>
            <ul className="list-disc list-inside text-yellow-800 space-y-1">
              <li>Available for orders below $500</li>
              <li>Delivery executive will provide a receipt</li>
              <li>Return policy applies as usual</li>
              <li>Some items may not be eligible for COD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Payment Method Selection Component
const PaymentMethodSelection = ({ 
  selectedMethod, 
  onMethodSelect, 
  onPaymentDetailsChange,
  isMobile,
  cartTotal 
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4 text-gray-900`}>
        Select Payment Method
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {PAYMENT_METHODS.map(method => (
          <div 
            key={method.id}
            className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedMethod === method.id 
                ? 'border-orange-500 bg-orange-50 shadow-sm' 
                : `border-gray-200 hover:border-gray-300 ${method.color}`
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-white' : 'bg-white/50'}`}>
                <span className="text-2xl">{method.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm sm:text-base">{method.name}</span>
                  {selectedMethod === method.id && (
                    <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{method.description}</p>
                {method.note && (
                  <p className="text-xs text-yellow-600 mt-1">{method.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedMethod === PAYMENT_GATEWAYS.CREDIT_CARD && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Enter Credit Card Details</h3>
          <CreditCardForm onCardDetailsChange={onPaymentDetailsChange} isMobile={isMobile} />
        </div>
      )}
      
      {selectedMethod === PAYMENT_GATEWAYS.DEBIT_CARD && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Enter Debit Card Details</h3>
          <CreditCardForm onCardDetailsChange={onPaymentDetailsChange} isMobile={isMobile} isDebit={true} />
        </div>
      )}
      
      {selectedMethod === PAYMENT_GATEWAYS.UPI && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">UPI Payment</h3>
          <UPIForm onUpiDetailsChange={onPaymentDetailsChange} isMobile={isMobile} />
        </div>
      )}
      
      {selectedMethod === PAYMENT_GATEWAYS.NET_BANKING && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Net Banking</h3>
          <NetBankingForm onBankDetailsChange={onPaymentDetailsChange} isMobile={isMobile} />
        </div>
      )}
      
      {selectedMethod === PAYMENT_GATEWAYS.CASH_ON_DELIVERY && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Cash on Delivery</h3>
          <CashOnDeliveryForm />
        </div>
      )}
      
      {[PAYMENT_GATEWAYS.PAYPAL, PAYMENT_GATEWAYS.STRIPE, PAYMENT_GATEWAYS.RAZORPAY].includes(selectedMethod) && (
        <div className="mt-4 pt-4 border-t">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <div className="text-blue-600 text-xl">↗️</div>
            <div>
              <div className="font-semibold text-blue-900">
                {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}
              </div>
              <p className="text-sm text-blue-800 mt-1">
                You'll be redirected to the {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name} website
                to complete your payment securely.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Payment View Component
const PaymentView = ({ 
  cartItems, 
  selectedAddress, 
  onProceedToConfirmation, 
  isMobile, 
  onBackToAddress 
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_GATEWAYS.AMAZON_PAY);
  const [paymentDetails, setPaymentDetails] = useState({});
  
  const subtotal = calculateSubtotal(cartItems);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleProceedToPayment = () => {
    // Validate payment details based on selected method
    if ([PAYMENT_GATEWAYS.CREDIT_CARD, PAYMENT_GATEWAYS.DEBIT_CARD].includes(selectedPaymentMethod)) {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.nameOnCard) {
        alert('Please enter all card details');
        return;
      }
    }
    
    if (selectedPaymentMethod === PAYMENT_GATEWAYS.NET_BANKING && !paymentDetails.bank) {
      alert('Please select your bank');
      return;
    }
    
    if (selectedPaymentMethod === PAYMENT_GATEWAYS.UPI && !paymentDetails.upiId) {
      alert('Please enter your UPI ID');
      return;
    }
    
    onProceedToConfirmation(selectedPaymentMethod, paymentDetails);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Payment Method</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentMethodSelection
            selectedMethod={selectedPaymentMethod}
            onMethodSelect={setSelectedPaymentMethod}
            onPaymentDetailsChange={setPaymentDetails}
            isMobile={isMobile}
            cartTotal={total}
          />
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
              <div className="text-gray-700">
                <p className="font-semibold">{selectedAddress.name}</p>
                <p>{selectedAddress.address1}</p>
                {selectedAddress.address2 && <p>{selectedAddress.address2}</p>}
                <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                <p>{selectedAddress.country}</p>
                <p className="pt-2">Phone: {selectedAddress.phone}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Order Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button 
              onClick={onBackToAddress}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
            >
              ← Back to Address
            </button>
            <button 
              onClick={handleProceedToPayment}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
            >
              Place Your Order
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Secure Payment</h3>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-xl">🔒</span>
                <div>
                  <div className="font-medium">Secure Transaction</div>
                  <div className="text-gray-600">Your payment information is protected</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-xl">✓</span>
                <div>
                  <div className="font-medium">100% Safe</div>
                  <div className="text-gray-600">SSL encrypted connection</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 text-xl">🛡️</span>
                <div>
                  <div className="font-medium">Fraud Protection</div>
                  <div className="text-gray-600">Advanced security measures</div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Accepted Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Mastercard', 'Amex', 'Discover', 'PayPal', 'UPI'].map(method => (
                  <span key={method} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation View Component
const ConfirmationView = ({ 
  orderDetails, 
  paymentMethod, 
  paymentDetails, 
  onRetryPayment,
  isMobile,
  isTablet 
}) => {
  const [transactionStatus, setTransactionStatus] = useState(TRANSACTION_STATUS.PROCESSING);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(10);
  const [transactionResult, setTransactionResult] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Define responsive breakpoints locally
  const isDesktop = windowWidth >= 1024 && windowWidth < 1280;
  const isLargeDesktop = windowWidth >= 1280;

  const processPayment = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await PaymentService.processPayment(
        paymentMethod,
        orderDetails,
        paymentDetails
      );
      
      setTransactionResult(response);
      
      if (response.success) {
        setTransactionStatus(TRANSACTION_STATUS.COMPLETED);
      } else {
        setTransactionStatus(TRANSACTION_STATUS.FAILED);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setTransactionStatus(TRANSACTION_STATUS.FAILED);
      setTransactionResult({
        success: false,
        error: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [orderDetails, paymentMethod, paymentDetails]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      processPayment();
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [processPayment]);

  useEffect(() => {
    if (!isLoading && transactionStatus === TRANSACTION_STATUS.COMPLETED) {
      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isLoading, transactionStatus]);

  const handlePrintInvoice = () => window.print();
  const handleTrackPackage = () => {
    window.open(`https://www.amazon.com/gp/your-account/order-details?orderID=${orderDetails.orderId}`, '_blank');
  };
  const handleContactSupport = () => {
    window.open('https://www.amazon.com/gp/help/customer/display.html', '_blank');
  };

  // Loading Spinner Component
  const LoadingSpinner = ({ isMobile }) => (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      <div className="text-center sm:text-left">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-800">Processing your order...</h1>
        <p className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
          Please wait while we confirm your payment
        </p>
      </div>
    </div>
  );

  // Success Header Component
  const SuccessHeader = ({ orderId, date, isMobile, isTablet }) => (
    <div className="text-center sm:text-left">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl mb-3 sm:mb-4 mx-auto sm:mx-0">
        ✓
      </div>
      <h1 className={`${isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
        Thank you, your order has been placed!
      </h1>
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mb-3 sm:mb-4`}>
        Order #{orderId} • {date}
      </p>
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700`}>
        We'll send a confirmation when your items ship. 
        You can track your order in{' '}
        <a href="/orders" className="text-blue-600 hover:text-blue-800 underline">
          Your Orders
        </a>.
      </p>
    </div>
  );

  // Error Header Component
  const ErrorHeader = ({ orderId, error, isMobile, isTablet }) => (
    <div className="text-center sm:text-left">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl mb-3 sm:mb-4 mx-auto sm:mx-0">
        ✗
      </div>
      <h1 className={`${isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'} font-bold text-red-600 mb-2`}>
        Payment Failed
      </h1>
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mb-2`}>
        We couldn't process your payment for order #{orderId}
      </p>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded mb-3">{error}</p>
      )}
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700`}>
        Please try again or use a different payment method.
      </p>
    </div>
  );

  // Transaction Details Component
  const TransactionDetails = ({ transactionId, paymentMethod, status, gateway, isMobile, paymentDetails }) => (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-3 sm:mb-4 text-gray-900`}>
        Transaction Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <span className="text-gray-600 text-xs sm:text-sm">Transaction ID:</span>
          <p className="font-mono text-xs sm:text-sm text-gray-900 break-all">{transactionId}</p>
        </div>
        <div>
          <span className="text-gray-600 text-xs sm:text-sm">Payment Method:</span>
          <p className="text-gray-900 text-sm sm:text-base">{paymentMethod}</p>
          {gateway && (
            <p className="text-xs text-gray-500">via {gateway}</p>
          )}
        </div>
        <div>
          <span className="text-gray-600 text-xs sm:text-sm">Status:</span>
          <span className={`inline-block px-2 py-1 ${isMobile ? 'text-xs' : 'text-sm'} rounded-full font-medium ${
            status === TRANSACTION_STATUS.COMPLETED ? 'bg-green-100 text-green-800' :
            status === TRANSACTION_STATUS.PROCESSING ? 'bg-yellow-100 text-yellow-800' :
            status === TRANSACTION_STATUS.PENDING ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status === TRANSACTION_STATUS.COMPLETED ? 'Paid' : 
             status === TRANSACTION_STATUS.PROCESSING ? 'Processing' : 
             status === TRANSACTION_STATUS.PENDING ? 'Pending' : 'Failed'}
          </span>
        </div>
        <div>
          <span className="text-gray-600 text-xs sm:text-sm">Date & Time:</span>
          <p className="text-gray-900 text-xs sm:text-sm">{formatDateTime()}</p>
        </div>
        {paymentDetails?.last4 && (
          <div className="sm:col-span-2">
            <span className="text-gray-600 text-xs sm:text-sm">Card ending in:</span>
            <p className="text-gray-900 text-sm sm:text-base">•••• {paymentDetails.last4}</p>
          </div>
        )}
        {paymentDetails?.upiId && (
          <div className="sm:col-span-2">
            <span className="text-gray-600 text-xs sm:text-sm">UPI ID:</span>
            <p className="text-gray-900 text-sm sm:text-base">{paymentDetails.upiId}</p>
          </div>
        )}
        {paymentDetails?.bank && (
          <div className="sm:col-span-2">
            <span className="text-gray-600 text-xs sm:text-sm">Bank:</span>
            <p className="text-gray-900 text-sm sm:text-base">{paymentDetails.bank}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Order Item Component
  const OrderItem = ({ item, isMobile }) => (
    <div className="flex gap-3 sm:gap-4 py-3 sm:py-4 border-b border-gray-200 last:border-b-0">
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 rounded flex items-center justify-center text-xl sm:text-2xl md:text-3xl flex-shrink-0">
        {item.image}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-900 mb-1 line-clamp-2`}>
          {item.name}
        </h3>
        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mb-1 sm:mb-2 flex flex-wrap gap-1`}>
          <span>Qty: {item.quantity}</span>
          <span className="hidden sm:inline">•</span>
          <span className="block sm:inline">{item.status}</span>
        </div>
        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700`}>
          <strong>Estimated delivery:</strong> {item.deliveryDate}
        </div>
      </div>
      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 whitespace-nowrap`}>
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );

  // Order Summary Component
  const OrderSummary = ({ items, total, isMobile }) => {
    const subtotal = calculateSubtotal(items);
    const tax = 22.00;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-3 sm:mb-4 text-gray-900`}>
          Order Summary
        </h2>
        <div className="mb-3 sm:mb-4 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
          {items.map(item => <OrderItem key={item.id} item={item} isMobile={isMobile} />)}
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex justify-between text-gray-700 text-sm sm:text-base">
            <span>Items:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm sm:text-base">
            <span>Shipping & handling:</span>
            <span className="text-green-600 font-medium">FREE</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm sm:text-base">
            <span>Estimated tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-2 border-t border-gray-300">
            <span>Order total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Shipping Address Component
  const ShippingAddress = ({ address, isMobile }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-3 sm:mb-4 text-gray-900`}>
        Shipping Address
      </h2>
      <div className={`text-gray-700 space-y-1 ${isMobile ? 'text-sm' : 'text-base'}`}>
        <p className="font-semibold">{address.name}</p>
        <p>{address.address1}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        <p className="pt-2">Phone: {address.phone}</p>
      </div>
    </div>
  );

  // Action Buttons Component
  const ActionButtons = ({ onTrack, onPrint, onSupport, onRetry, isMobile, isTablet, showRetry }) => (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
      <button 
        onClick={onTrack}
        className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors`}
      >
        Track Package
      </button>
      <button 
        onClick={onPrint}
        className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors`}
      >
        Print Invoice
      </button>
      <button 
        onClick={onSupport}
        className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} flex-1 sm:flex-none border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-colors`}
      >
        Contact Support
      </button>
      {showRetry && (
        <button 
          onClick={onRetry}
          className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors`}
        >
          Try Another Payment
        </button>
      )}
    </div>
  );

  // Next Steps Panel Component
  const NextStepsPanel = ({ email, timer, isMobile, paymentMethod }) => {
    const steps = [
      { icon: '📧', title: 'Order Confirmation Email', desc: `We've sent a confirmation to ${email}` },
      { icon: '🚚', title: 'Shipping Updates', desc: "We'll notify you when items ship" },
      { icon: '📦', title: 'Delivery Day', desc: 'Track your package with Amazon Logistics' },
      { icon: '💳', title: 'Payment Confirmation', desc: `Your ${paymentMethod} will be charged` },
      { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy on most items' }
    ];
    
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 sm:mb-4 text-gray-900`}>
            What's Next?
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2 sm:gap-3">
                <div className="text-xl sm:text-2xl flex-shrink-0">{step.icon}</div>
                <div className="min-w-0">
                  <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>{step.title}</h4>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 sm:p-4 text-center">
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 mb-2`}>
            Redirecting to your orders in{' '}
            <strong className="text-blue-600">{timer}</strong> seconds...
          </p>
          <a 
            href="/" 
            className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-600 hover:text-blue-800 underline`}
          >
            ← Continue Shopping on Amazon
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Order Confirmation</h1>
      
      <div className={`grid grid-cols-1 ${
        isLargeDesktop ? 'lg:grid-cols-3 gap-8' : 
        isDesktop ? 'lg:grid-cols-3 gap-6' : 
        isTablet ? 'lg:grid-cols-3 gap-5' : 
        'gap-4'
      }`}>
        {/* Left Panel - Order Confirmation */}
        <div className={`${
          isLargeDesktop ? 'lg:col-span-2' : 
          isDesktop ? 'lg:col-span-2' : 
          isTablet ? 'lg:col-span-2' : 
          ''
        }`}>
          <div className={`bg-white rounded-lg border border-gray-200 ${
            isMobile ? 'p-4' : 
            isTablet ? 'p-5' : 
            'p-6 md:p-8'
          } mb-4 sm:mb-5 md:mb-6`}>
            {isLoading ? (
              <div className={`py-6 sm:py-8 ${isMobile ? 'text-center' : ''}`}>
                <LoadingSpinner isMobile={isMobile} />
                <p className={`mt-3 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 ${isMobile ? 'text-center' : ''}`}>
                  Processing your {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name} payment...
                </p>
              </div>
            ) : transactionStatus === TRANSACTION_STATUS.COMPLETED ? (
              <SuccessHeader 
                orderId={orderDetails.orderId} 
                date={orderDetails.date} 
                isMobile={isMobile}
                isTablet={isTablet}
              />
            ) : (
              <ErrorHeader 
                orderId={orderDetails.orderId}
                error={transactionResult?.error}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            )}
          </div>

          {transactionResult && (
            <TransactionDetails 
              transactionId={transactionResult.transactionId}
              paymentMethod={PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || paymentMethod}
              status={transactionStatus}
              gateway={transactionResult.gateway}
              isMobile={isMobile}
              paymentDetails={paymentDetails}
            />
          )}

          <OrderSummary 
            items={orderDetails.items} 
            total={orderDetails.total} 
            isMobile={isMobile}
          />

          <ShippingAddress 
            address={orderDetails.shippingAddress} 
            isMobile={isMobile}
          />

          <ActionButtons
            onTrack={handleTrackPackage}
            onPrint={handlePrintInvoice}
            onSupport={handleContactSupport}
            onRetry={onRetryPayment}
            isMobile={isMobile}
            isTablet={isTablet}
            showRetry={transactionStatus === TRANSACTION_STATUS.FAILED}
          />
        </div>

        {/* Right Panel - Next Steps */}
        <div className={`${
          isLargeDesktop ? 'lg:col-span-1' : 
          isDesktop ? 'lg:col-span-1' : 
          isTablet ? 'lg:col-span-1' : 
          ''
        }`}>
          <NextStepsPanel 
            email={orderDetails.email} 
            timer={timer} 
            isMobile={isMobile}
            paymentMethod={PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || paymentMethod}
          />
        </div>
      </div>
    </div>
  );
};

// Main Component
const ECommerceFlow = () => {
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.CART);
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_GATEWAYS.AMAZON_PAY);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [orderDetails, setOrderDetails] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Responsive breakpoints
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024 && windowWidth < 1280;
  const isLargeDesktop = windowWidth >= 1280;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleProceedToAddress = () => {
    setCurrentStep(CHECKOUT_STEPS.ADDRESS);
  };

  const handleProceedToPayment = (addressId) => {
    const address = addresses.find(addr => addr.id === addressId);
    setSelectedAddress(address);
    setCurrentStep(CHECKOUT_STEPS.PAYMENT);
  };

  const handleBackToAddress = () => {
    setCurrentStep(CHECKOUT_STEPS.ADDRESS);
  };

  const handleProceedToConfirmation = (paymentMethod, details) => {
    setSelectedPaymentMethod(paymentMethod);
    setPaymentDetails(details);
    
    // Create order details
    const subtotal = calculateSubtotal(cartItems);
    const shipping = subtotal > 35 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    const orderData = {
      orderId: generateOrderId(),
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      total: total,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        deliveryDate: item.deliveryDate,
        status: 'Order received'
      })),
      shippingAddress: selectedAddress,
      paymentMethod: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || paymentMethod,
      email: 'john.doe@email.com'
    };
    
    setOrderDetails(orderData);
    setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
  };

  const handleRetryPayment = () => {
    setCurrentStep(CHECKOUT_STEPS.PAYMENT);
  };

  const getStepNumber = (step) => {
    const steps = Object.values(CHECKOUT_STEPS);
    return steps.indexOf(step) + 1;
  };

  const getStepTitle = (step) => {
    const titles = {
      [CHECKOUT_STEPS.CART]: 'Cart',
      [CHECKOUT_STEPS.ADDRESS]: 'Address',
      [CHECKOUT_STEPS.PAYMENT]: 'Payment',
      [CHECKOUT_STEPS.CONFIRMATION]: 'Confirmation'
    };
    return titles[step];
  };

  const renderStep = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.CART:
        return (
          <CartView 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToAddress={handleProceedToAddress}
            isMobile={isMobile}
          />
        );
      case CHECKOUT_STEPS.ADDRESS:
        return (
          <AddressView 
            addresses={addresses}
            onSelectAddress={setSelectedAddress}
            onProceedToPayment={handleProceedToPayment}
            isMobile={isMobile}
            onAddNewAddress={() => {}}
          />
        );
      case CHECKOUT_STEPS.PAYMENT:
        return (
          <PaymentView 
            cartItems={cartItems}
            selectedAddress={selectedAddress}
            onProceedToConfirmation={handleProceedToConfirmation}
            isMobile={isMobile}
            onBackToAddress={handleBackToAddress}
          />
        );
      case CHECKOUT_STEPS.CONFIRMATION:
        return (
          <ConfirmationView 
            orderDetails={orderDetails}
            paymentMethod={selectedPaymentMethod}
            paymentDetails={paymentDetails}
            onRetryPayment={handleRetryPayment}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white py-3 sm:py-4 px-4 sm:px-6 mb-4 sm:mb-5 md:mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold flex items-center">
            <span className="text-orange-500">Amazon</span>
            <span className="hidden xs:inline">.com</span>
          </div>
          
          {/* Desktop Progress Steps */}
          <div className={`hidden sm:flex items-center space-x-1 md:space-x-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {Object.values(CHECKOUT_STEPS).map((step, index) => (
              <React.Fragment key={step}>
                <span className="flex items-center">
                  <span className={`rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mr-1 ${
                    getStepNumber(step) <= getStepNumber(currentStep)
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-900'
                  }`}>
                    {getStepNumber(step)}
                  </span>
                  <span className="hidden md:inline">{getStepTitle(step)}</span>
                </span>
                {index < Object.values(CHECKOUT_STEPS).length - 1 && (
                  <span className="text-gray-400">›</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Progress Bar */}
      {isMobile && (
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between">
            {Object.values(CHECKOUT_STEPS).map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
                  getStepNumber(step) <= getStepNumber(currentStep)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {getStepNumber(step)}
                </div>
                <span className="text-xs text-gray-600">{getStepTitle(step)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Step Content */}
      {renderStep()}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4 sm:py-6 px-4 sm:px-6 mt-8 sm:mt-12 print:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <a href="#" className="hover:text-white transition-colors">Conditions of Use</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Notice</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors">Interest-Based Ads</a>
          </div>
          <span className="block text-center text-xs sm:text-sm mt-2 sm:mt-3">
            © 1996-2024, Amazon.com, Inc. or its affiliates
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ECommerceFlow;