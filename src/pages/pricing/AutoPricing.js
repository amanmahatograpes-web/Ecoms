import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Share2, Facebook, Twitter, Instagram, Mail, MessageCircle, Copy, QrCode, Loader, AlertCircle, RefreshCw, CreditCard, Wallet, Smartphone, Banknote } from 'lucide-react';
import apiService from '../../services/api.service';

// ============= INLINE COMPONENTS (instead of separate files) =============

// 1. AutomationToggle Component
const AutomationToggle = ({ isActive, onToggle, isMobile, isLoading }) => (
  <button
    onClick={onToggle}
    disabled={isLoading}
    className={`flex items-center justify-center rounded-lg font-semibold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 hover:from-gray-400 hover:to-gray-500'
    } ${isMobile ? 'px-4 py-2 text-sm' : 'px-5 py-3'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {isLoading ? (
      <Loader className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} animate-spin mr-2`} />
    ) : (
      <div className="flex items-center">
        <span className="mr-2">{isActive ? '✓ Active' : 'Inactive'}</span>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-700'}`} />
      </div>
    )}
  </button>
);

// 2. RangeSlider Component
const RangeSlider = ({ label, value, min, max, step, onChange, unit, isMobile, formatIndianRupees, isLoading }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
        {label}
      </label>
      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-blue-600`}>
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={isLoading}
      className={`w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    />
    <div className="flex justify-between text-[10px] text-gray-500">
      <span>{min}{unit}</span>
      <span>{((max + min) / 2).toFixed(1)}{unit}</span>
      <span>{max}{unit}</span>
    </div>
  </div>
);

// 3. PaymentModal Component
// 3. PaymentModal Component (Updated)
const PaymentModal = ({ 
  isOpen, 
  onClose, 
  plan, 
  annualDiscount, 
  activeCoupons, 
  formatIndianRupees,
  displayWithTax,
  onPaymentSuccess 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    walletType: 'phonepe'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  // Get user from localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      return {};
    }
  });

  if (!isOpen) return null;

  const calculatePrice = (basePrice) => {
    const tax = displayWithTax ? basePrice * 0.18 : 0;
    return basePrice + tax;
  };

  const monthlyPrice = calculatePrice(plan.currentPrice);
  const annualPrice = calculatePrice(plan.currentPrice * 12 * (1 - annualDiscount / 100));
  
  const totalCouponDiscount = activeCoupons.reduce((sum, c) => sum + c.discount, 0);
  const finalPrice = monthlyPrice * (1 - totalCouponDiscount / 100);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setPaymentDetails(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setPaymentDetails(prev => ({ ...prev, expiryMonth: value }));
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.substring(0, 3);
    setPaymentDetails(prev => ({ ...prev, cvv: value }));
  };

  const validatePaymentDetails = () => {
    setPaymentError('');
    
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!paymentDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        setPaymentError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!paymentDetails.cardName.trim()) {
        setPaymentError('Please enter cardholder name');
        return false;
      }
      if (!paymentDetails.expiryMonth.match(/^\d{2}\/\d{2}$/)) {
        setPaymentError('Please enter expiry date in MM/YY format');
        return false;
      }
      if (!paymentDetails.cvv.match(/^\d{3}$/)) {
        setPaymentError('Please enter a valid 3-digit CVV');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentDetails.upiId.match(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/)) {
        setPaymentError('Please enter a valid UPI ID (e.g., name@upi)');
        return false;
      }
    } else if (paymentMethod === 'net_banking') {
      if (!paymentDetails.bankName) {
        setPaymentError('Please select a bank');
        return false;
      }
    }
    
    return true;
  };

  // In your PaymentModal component, update handlePaymentSubmit:
 // Replace the apiService calls with these safe versions:
const handlePaymentSubmit = async () => {
  if (!validatePaymentDetails()) return;

  setIsProcessing(true);
  setPaymentError('');

  try {
    const user = getUser();
    
    // For demo purposes - bypass API call if backend is not available
    const isBackendAvailable = await checkBackendAvailability();
    
    if (!isBackendAvailable) {
      // Show demo mode
      setShowOtpInput(true);
      setSuccessMessage('Demo mode: Simulating payment (backend not available)');
      setIsProcessing(false);
      return;
    }
    
    // Real API call
    const paymentResponse = await apiService.initializePayment({
      planId: plan._id,
      paymentMethod: paymentMethod,
      couponCode: activeCoupons.map(c => c.code).join(','),
      billingAddress: {
        name: paymentDetails.cardName || user?.name || 'Customer',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        country: user?.country || 'IN',
        pincode: user?.pincode || ''
      }
    });
    
    // ... rest of your code
  } catch (error) {
    console.error('Payment error:', error);
    // Show user-friendly error
    if (error.isNetworkError) {
      setPaymentError('Cannot connect to payment server. Please check your internet connection.');
    } else {
      setPaymentError(error.message || 'Payment failed. Please try again.');
    }
    setIsProcessing(false);
  }
};

// Add this helper function
const checkBackendAvailability = async () => {
  try {
    const response = await fetch('http://localhost:8000/health', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setPaymentError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Verify OTP with backend
      const response = await apiService.verifyOTP({
        paymentId: plan._id, // For demo, using plan ID
        otp: otp
      });

      if (response.success) {
        setPaymentSuccess(true);
        setShowOtpInput(false);
        setIsProcessing(false);
        
        // Call payment success callback
        onPaymentSuccess({
          plan,
          amount: finalPrice,
          paymentMethod,
          transactionId: `TXN${Date.now()}`,
          timestamp: new Date().toISOString()
        });
      } else {
        setPaymentError(response.message || 'Invalid OTP. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setPaymentError('OTP verification failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isProcessing}
            >
              ×
            </button>
          </div>

          {/* Payment Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span>{formatIndianRupees(plan.currentPrice)}</span>
              </div>
              {displayWithTax && (
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%):</span>
                  <span>{formatIndianRupees(plan.currentPrice * 0.18)}</span>
                </div>
              )}
              {totalCouponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({totalCouponDiscount}%):</span>
                  <span>-{formatIndianRupees(monthlyPrice * (totalCouponDiscount / 100))}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-bold text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-green-600">{formatIndianRupees(finalPrice)}</span>
              </div>
            </div>
          </div>

          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Your {plan.name} plan has been activated.</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : showOtpInput ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enter OTP</h3>
                <p className="text-gray-600 mb-6">We've sent a 6-digit OTP to your registered mobile number</p>
                
                <div className="mb-4">
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowOtpInput(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOtpSubmit}
                    disabled={otp.length !== 6 || isProcessing}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin inline mr-2" />
                        Verifying...
                      </>
                    ) : 'Verify OTP'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
                      paymentMethod === 'credit_card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-gray-700 mb-2" />
                    <span className="text-xs font-medium">Credit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('debit_card')}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
                      paymentMethod === 'debit_card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-gray-700 mb-2" />
                    <span className="text-xs font-medium">Debit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
                      paymentMethod === 'upi' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 text-gray-700 mb-2" />
                    <span className="text-xs font-medium">UPI</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('net_banking')}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center ${
                      paymentMethod === 'net_banking' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Banknote className="w-6 h-6 text-gray-700 mb-2" />
                    <span className="text-xs font-medium">Net Banking</span>
                  </button>
                </div>

                {/* Payment Form */}
                <div className="space-y-4">
                  {/* Card Payment Form */}
                  {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          maxLength="19"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.cardName}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardName: e.target.value }))}
                          placeholder="John Doe"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.expiryMonth}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.cvv}
                            onChange={handleCvvChange}
                            placeholder="123"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            maxLength="3"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* UPI Payment Form */}
                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.upiId}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
                        placeholder="yourname@upi"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Popular UPI Apps:</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentDetails(prev => ({ ...prev, walletType: 'googlepay' }))}
                            className={`flex-1 py-2 px-3 border rounded-lg flex items-center justify-center gap-2 ${
                              paymentDetails.walletType === 'googlepay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">G</span>
                            </div>
                            <span className="text-xs">Google Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentDetails(prev => ({ ...prev, walletType: 'phonepe' }))}
                            className={`flex-1 py-2 px-3 border rounded-lg flex items-center justify-center gap-2 ${
                              paymentDetails.walletType === 'phonepe' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-600">P</span>
                            </div>
                            <span className="text-xs">PhonePe</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentDetails(prev => ({ ...prev, walletType: 'paytm' }))}
                            className={`flex-1 py-2 px-3 border rounded-lg flex items-center justify-center gap-2 ${
                              paymentDetails.walletType === 'paytm' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                          >
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-yellow-600">P</span>
                            </div>
                            <span className="text-xs">Paytm</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Net Banking Form */}
                  {paymentMethod === 'net_banking' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Bank
                      </label>
                      <select
                        value={paymentDetails.bankName}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select your bank</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="yes">Yes Bank</option>
                      </select>
                      
                      {paymentDetails.bankName && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Number
                            </label>
                            <input
                              type="text"
                              value={paymentDetails.accountNumber}
                              onChange={(e) => setPaymentDetails(prev => ({ 
                                ...prev, 
                                accountNumber: e.target.value.replace(/\D/g, '') 
                              }))}
                              placeholder="Enter account number"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              IFSC Code
                            </label>
                            <input
                              type="text"
                              value={paymentDetails.ifscCode}
                              onChange={(e) => setPaymentDetails(prev => ({ 
                                ...prev, 
                                ifscCode: e.target.value.toUpperCase() 
                              }))}
                              placeholder="Enter IFSC code"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info Notice (if logged in) */}
              {user?.email && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Logged in as:</span> {user.email}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{paymentError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatIndianRupees(finalPrice)}`
                  )}
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <div className="text-xs text-gray-600">
                    <p className="font-medium mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We don't store your card details.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. PlanCard Component (updated with payment functionality)
const PlanCard = ({ 
  plan, 
  annualDiscount, 
  activeCoupons, 
  onSelectPlan, 
  isAutomated, 
  displayWithTax, 
  isMobile, 
  isTablet, 
  formatIndianRupees, 
  onShareTracked,
  onPaymentInitiated,
  isLoading = false 
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-8 bg-gray-300 rounded mb-6"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-3 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const calculatePrice = (basePrice) => {
    const tax = displayWithTax ? basePrice * 0.18 : 0;
    return basePrice + tax;
  };

  const monthlyPrice = calculatePrice(plan.currentPrice);
  const annualPrice = calculatePrice(plan.currentPrice * 12 * (1 - annualDiscount / 100));

  const handleShare = async (platform) => {
    if (onShareTracked) {
      onShareTracked(platform, plan);
    }
    
    // Track the share in the backend
    try {
      const shareData = {
        platform,
        planId: plan._id,
        planName: plan.name,
        price: monthlyPrice,
        timestamp: new Date().toISOString()
      };
      
      await apiService.trackShare(shareData);
      
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    if (onPaymentInitiated) {
      onPaymentInitiated(paymentData);
    }
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-lg border ${
        plan.popular ? 'border-blue-500' : 'border-gray-200'
      } p-4 sm:p-6 transition-transform hover:scale-[1.02] relative`}>
        {plan.popular && (
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold">
            POPULAR
          </div>
        )}
        
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 text-sm">{plan.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline mb-1">
            <span className="text-3xl font-bold text-gray-900">{formatIndianRupees(monthlyPrice)}</span>
            <span className="text-gray-600 ml-2">/month</span>
          </div>
          {displayWithTax && (
            <div className="text-xs text-gray-500">Includes 18% GST</div>
          )}
          <div className="text-sm text-gray-600 mt-2">
            Annual: {formatIndianRupees(annualPrice)} (Save {annualDiscount}%)
          </div>
        </div>

        <div className="mb-6">
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowPaymentModal(true)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              plan.popular 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Buy Now
          </button>

          <button
            onClick={() => onSelectPlan && onSelectPlan({
              ...plan,
              monthlyTotal: monthlyPrice,
              annualTotal: annualPrice,
              annualDiscount,
              totalCouponDiscount: activeCoupons.reduce((sum, c) => sum + c.discount, 0)
            })}
            className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex-1 py-2 px-3 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {!isMobile && 'Share'}
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex-1 py-2 px-3 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center"
            >
              <Facebook className="w-4 h-4 mr-1" />
              {!isMobile && 'Share'}
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex-1 py-2 px-3 bg-sky-100 text-sky-800 rounded-lg text-sm font-medium hover:bg-sky-200 transition-colors flex items-center justify-center"
            >
              <Twitter className="w-4 h-4 mr-1" />
              {!isMobile && 'Tweet'}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={plan}
        annualDiscount={annualDiscount}
        activeCoupons={activeCoupons}
        formatIndianRupees={formatIndianRupees}
        displayWithTax={displayWithTax}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

// 4. LoadingSpinner Component
const LoadingSpinner = ({ message, size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4`}></div>
      {message && <p className="text-gray-600 text-center">{message}</p>}
    </div>
  );
};

// 5. ErrorMessage Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start">
      <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800 font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);

// 6. SuccessMessage Component
const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-green-600 mr-2">✓</span>
        <p className="text-green-800 font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-600 hover:text-green-800 ml-4"
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  </div>
);

// ============= INLINE HOOKS =============

// 7. useResponsive Hook (inline implementation)
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  return {
    windowSize,
    isMobile: windowSize.width < breakpoints.md,
    isTablet: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    isLargeDesktop: windowSize.width >= breakpoints.xl
  };
};

// 8. usePricingCalculator Hook (inline implementation)
const usePricingCalculator = () => {
  const formatIndianRupees = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  return { formatIndianRupees };
};

// ============= INLINE CONSTANTS =============

// 9. Constants (inline definition)
const MARKET_CONDITIONS = {
  DEMAND_LEVELS: [
    { label: 'High Demand', value: 'high', multiplier: 1.1 },
    { label: 'Normal', value: 'normal', multiplier: 1.0 },
    { label: 'Low Demand', value: 'low', multiplier: 0.9 }
  ],
  SEASONS: [
    { label: 'Peak Season', value: 'peak', multiplier: 1.15 },
    { label: 'Regular', value: 'regular', multiplier: 1.0 },
    { label: 'Off Season', value: 'off', multiplier: 0.85 }
  ]
};

const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  NAME: 'Indian Rupees'
};

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// ============= MAIN COMPONENT =============

const PricingAutomationWithSharing = () => {
  const [plans, setPlans] = useState([]);
  const [automationSettings, setAutomationSettings] = useState({
    autoAdjust: false,
    demandFactor: 1.0,
    seasonalAdjustment: 0,
    competitorTracking: false,
    profitMargin: 30,
    taxInclusive: true
  });
  const [discounts, setDiscounts] = useState({
    annualDiscount: 20,
    couponCode: '',
    activeCoupons: []
  });
  const [marketConditions, setMarketConditions] = useState({
    demand: 'normal',
    season: 'regular',
    competitorPrice: 5500
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    platformStats: {},
    recentShares: []
  });
  const [automationStatus, setAutomationStatus] = useState(null);
  const [marketConditionsData, setMarketConditionsData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingAutomation, setIsLoadingAutomation] = useState(false);
  const [isLoadingShareStats, setIsLoadingShareStats] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const responsive = useResponsive();
  const { formatIndianRupees } = usePricingCalculator();
  
  // Get user from localStorage
  // In your main component:
// Get user from localStorage
const getUser = useCallback(() => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch (error) {
    return {};
  }
}, []);

// You can also add a state for user if needed
const [user, setUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch (error) {
    return {};
  }
});

// Update user when localStorage changes
useEffect(() => {
  const handleStorageChange = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (error) {
      setUser({});
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);



// After successful login
const handleLogin = async (email, password) => {
  try {
    const response = await apiService.login({ email, password });
    if (response.success) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      // Update state
      setUser(response.data.user);
      
      // Redirect or show success message
      setSuccessMessage('Login successful!');
    }
  } catch (error) {
    setError('Login failed. Please try again.');
  }
};

// For demo purposes, you can create a mock user
const createDemoUser = () => {
  const demoUser = {
    _id: 'demo_user_123',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '9876543210',
    role: 'user',
    subscription: {
      plan: null,
      status: 'inactive',
      startDate: null,
      endDate: null,
      autoRenew: true
    },
    location: {
      country: 'IN',
      city: 'Mumbai',
      state: 'Maharashtra',
      timezone: 'Asia/Kolkata'
    },
    preferences: {
      currency: 'INR',
      taxInclusive: true
    }
  };
  
  localStorage.setItem('user', JSON.stringify(demoUser));
  setUser(demoUser);
  setSuccessMessage('Demo user created!');
};
  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch data in parallel
      await Promise.all([
        fetchPlans(),
        fetchAutomationStatus(),
        fetchShareStats(),
        fetchMarketConditions()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load pricing data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pricing plans from backend
  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const user = getUser();
      
      // Get location with fallback
      let location = { country: 'IN', city: 'Mumbai' };
      if (apiService.getUserLocation) {
        try {
          location = await apiService.getUserLocation();
        } catch (error) {
          console.warn('Could not get user location, using default:', error);
        }
      }
      
      // Call API with safe parameters
      const response = await apiService.getPlans({
        includeTax: automationSettings.taxInclusive,
        annualDiscount: discounts.annualDiscount,
        couponCodes: discounts.activeCoupons.map(c => c.code),
        userId: user?.id,
        location
      });
      
      if (response && response.success) {
        setPlans(response.data?.plans || []);
      } else {
        throw new Error(response?.error || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load pricing plans. Using default data.');
      // Use default plans as fallback
      setPlans([
        {
          _id: '1',
          name: 'Basic',
          basePrice: 1999,
          currentPrice: 1999,
          period: 'month',
          description: 'Perfect for small teams and startups',
          features: [
            'Up to 5 team members',
            '100GB cloud storage',
            'Basic analytics dashboard',
            'Email support (48h response)',
            'Basic API access (1000 calls/day)',
            'Single project management'
          ],
          popular: false,
          category: 'starter',
          taxPercentage: 18
        },
        {
          _id: '2',
          name: 'Professional',
          basePrice: 4999,
          currentPrice: 4999,
          period: 'month',
          description: 'For growing businesses and SMEs',
          features: [
            'Up to 20 team members',
            '500GB cloud storage',
            'Advanced analytics & reports',
            'Priority support (24h response)',
            'Custom API integrations',
            'Advanced API (10,000 calls/day)',
            'Multiple project management',
            'Team collaboration tools'
          ],
          popular: true,
          category: 'growth',
          taxPercentage: 18
        },
        {
          _id: '3',
          name: 'Enterprise',
          basePrice: 14999,
          currentPrice: 14999,
          period: 'month',
          description: 'For large organizations & enterprises',
          features: [
            'Unlimited team members',
            '2TB cloud storage',
            'Enterprise-grade analytics',
            '24/7 dedicated support',
            'Custom solutions & integrations',
            'White-label options',
            'SLA guarantee (99.9% uptime)',
            'Advanced security features',
            'Custom training sessions',
            'Personal account manager'
          ],
          popular: false,
          category: 'enterprise',
          taxPercentage: 18
        }
      ]);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  // Fetch automation status with fallback
  const fetchAutomationStatus = async () => {
    setIsLoadingAutomation(true);
    try {
      if (apiService.getAutomationStatus) {
        const response = await apiService.getAutomationStatus();
        if (response && response.success) {
          setAutomationStatus(response.data);
          setAutomationSettings(prev => ({
            ...prev,
            autoAdjust: response.data.isRunning
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching automation status:', error);
    } finally {
      setIsLoadingAutomation(false);
    }
  };
// Add this in your main component's return statement, near the top
{(!responsive.isMobile || !showMobileMenu) && (
  <div className="flex justify-between items-center mb-4">
    <div></div> {/* Empty div for spacing */}
    
    {/* User Status Display */}
    <div className="flex items-center space-x-2">
      {user?.email ? (
        <>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user.name || user.email}</p>
            <p className="text-xs text-gray-500">
              {user.subscription?.status === 'active' ? 'Premium User' : 'Free User'}
            </p>
          </div>
        </>
      ) : (
        <button
          onClick={createDemoUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Login as Demo User
        </button>
      )}
    </div>
  </div>
)}
  // Fetch share statistics with fallback
  const fetchShareStats = async () => {
    setIsLoadingShareStats(true);
    try {
      if (apiService.getShareAnalytics) {
        const response = await apiService.getShareAnalytics({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        });
        
        if (response && response.success) {
          setShareStats({
            totalShares: response.data.summary?.totalShares || 0,
            platformStats: response.data.platformStats?.reduce((acc, stat) => {
              acc[stat.platform] = stat.totalShares;
              return acc;
            }, {}) || {},
            recentShares: response.data.recentShares || []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching share stats:', error);
    } finally {
      setIsLoadingShareStats(false);
    }
  };

  // Fetch market conditions with fallback
  const fetchMarketConditions = async () => {
    try {
      if (apiService.getMarketConditions) {
        const response = await apiService.getMarketConditions();
        if (response && response.success) {
          setMarketConditionsData(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching market conditions:', error);
    }
  };

  // Handle automation toggle
  const handleToggleAutomation = useCallback(async () => {
    const newAutoAdjust = !automationSettings.autoAdjust;
    
    try {
      if (newAutoAdjust) {
        if (apiService.startAutomation) {
          await apiService.startAutomation();
        }
        setSuccessMessage('Automation engine started successfully');
      } else {
        if (apiService.stopAutomation) {
          await apiService.stopAutomation();
        }
        setSuccessMessage('Automation engine stopped');
      }
      
      setAutomationSettings(prev => ({
        ...prev,
        autoAdjust: newAutoAdjust
      }));
      
      // Refresh plans
      fetchPlans();
      
    } catch (error) {
      console.error('Error toggling automation:', error);
      setError(`Failed to ${newAutoAdjust ? 'start' : 'stop'} automation`);
    }
  }, [automationSettings.autoAdjust]);

  // Handle discount coupon application with validation fallback
  const handleApplyCoupon = useCallback(async () => {
    const code = discounts.couponCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setError(null);

    try {
      const user = getUser();
      
      // Validate coupon with fallback
      let validation = { valid: false, error: 'Invalid coupon code' };
      
      if (apiService.validateCoupon) {
        validation = await apiService.validateCoupon({
          code,
          userId: user?.id,
          planId: selectedPlan?._id,
          amount: selectedPlan?.currentPrice || 0
        });
      } else {
        // Mock validation for demo
        const validCoupons = ['WELCOME20', 'SAVE15', 'INDIAN10', 'STARTUP25'];
        if (validCoupons.includes(code)) {
          validation = {
            valid: true,
            coupon: {
              discountValue: code === 'WELCOME20' ? 20 : 
                           code === 'SAVE15' ? 15 : 
                           code === 'INDIAN10' ? 10 : 25,
              name: `${code} Discount`
            }
          };
        }
      }
      
      if (validation.valid) {
        const existingCoupon = discounts.activeCoupons.find(c => c.code === code);
        if (existingCoupon) {
          setError('This coupon has already been applied!');
          return;
        }

        const newCoupon = {
          code,
          discount: validation.coupon.discountValue,
          description: validation.coupon.name || 'Discount coupon',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          appliedAt: new Date().toISOString()
        };

        setDiscounts(prev => ({
          ...prev,
          activeCoupons: [...prev.activeCoupons, newCoupon],
          couponCode: ''
        }));
        
        setSuccessMessage(`Coupon "${code}" applied successfully! You get ${validation.coupon.discountValue}% off.`);
        
        // Refresh plans with new coupon
        fetchPlans();
      } else {
        setError(validation.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setError('Failed to apply coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [discounts.couponCode, discounts.activeCoupons, selectedPlan, getUser]);

  // Handle plan selection
  const handlePlanSelect = useCallback(async (planDetails) => {
    setSelectedPlan(planDetails);
    
    // Show mobile-friendly alert
    const summary = `Plan: ${planDetails.name}\nMonthly: ${formatIndianRupees(planDetails.monthlyTotal)}\nAnnual: ${formatIndianRupees(planDetails.annualTotal)}\nSave: ${planDetails.annualDiscount + planDetails.totalCouponDiscount}%`;
    
    // For demo purposes, show alert
    if (responsive.isMobile) {
      alert(summary);
    } else {
      setSuccessMessage(`Selected ${planDetails.name} plan: ${formatIndianRupees(planDetails.monthlyTotal)}/month`);
    }
    
    // Track plan selection analytics with safe check
    try {
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('Plan Selected', {
          planId: planDetails._id,
          planName: planDetails.name,
          price: planDetails.monthlyTotal,
          userId: getUser()?.id
        });
      }
    } catch (error) {
      console.error('Error tracking plan selection:', error);
    }
  }, [formatIndianRupees, responsive.isMobile, getUser]);

  // Handle share tracked - Updated to use API service
  const handleShareTracked = useCallback(async (platform, plan) => {
    // Refresh share stats when a new share is tracked
    fetchShareStats();
    
    // Show success message
    setSuccessMessage(`Shared ${plan.name} plan on ${platform}`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    // Track share in backend
    try {
      const shareData = {
        platform,
        planId: plan._id,
        planName: plan.name,
        price: plan.currentPrice,
        timestamp: new Date().toISOString()
      };
      
      await apiService.trackShare(shareData);
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  }, []);

  // Handle payment initiated
  const handlePaymentInitiated = useCallback(async (paymentData) => {
    setSuccessMessage(`Payment successful! ${paymentData.plan.name} plan activated.`);
    
    // Add to payment history
    setPaymentHistory(prev => [paymentData, ...prev.slice(0, 9)]);
    
    // Track payment in backend
    try {
      const user = getUser();
      await apiService.trackPayment({
        ...paymentData,
        userId: user?.id,
        userEmail: user?.email,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking payment:', error);
    }
    
    // Refresh plans to show updated subscription status
    fetchPlans();
  }, [getUser]);

  // Handle market condition change
  const handleMarketConditionChange = useCallback((type, value) => {
    setMarketConditions(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  // Handle automation setting change
  const handleAutomationSettingChange = useCallback((key, value) => {
    setAutomationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Refresh all data
  const handleRefresh = () => {
    fetchAllData();
    setSuccessMessage('Data refreshed successfully');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Clear success message
  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  // Calculate statistics
  const totalCouponDiscount = useMemo(() => 
    discounts.activeCoupons.reduce((total, coupon) => total + coupon.discount, 0),
    [discounts.activeCoupons]
  );

  const averagePriceChange = useMemo(() => {
    if (priceHistory.length === 0) return 0;
    const changes = priceHistory.map(change => 
      ((change.newPrice - change.oldPrice) / change.oldPrice) * 100
    );
    return (changes.reduce((a, b) => a + b, 0) / changes.length).toFixed(1);
  }, [priceHistory]);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Determine grid columns based on device
  const getGridCols = () => {
    if (responsive.isMobile) return 'grid-cols-1';
    if (responsive.isTablet) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  // Determine market conditions grid columns
  const getMarketConditionsCols = () => {
    if (responsive.isMobile) return 'grid-cols-1';
    if (responsive.isTablet) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  // Determine automation settings grid columns
  const getAutomationSettingsCols = () => {
    if (responsive.isMobile) return 'grid-cols-1';
    if (responsive.isTablet) return 'grid-cols-2';
    return 'grid-cols-4';
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner message="Loading pricing automation dashboard..." size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
      <div className={`mx-auto ${responsive.isLargeDesktop ? 'max-w-screen-2xl' : responsive.isDesktop ? 'max-w-7xl' : 'max-w-full'}`}>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} onRetry={clearError} />
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4">
            <SuccessMessage message={successMessage} onClose={clearSuccessMessage} />
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRefresh}
            disabled={isLoadingPlans || isLoadingAutomation || isLoadingShareStats}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPlans || isLoadingAutomation || isLoadingShareStats ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Mobile Header Menu */}
        {responsive.isMobile && (
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 mb-4">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <span className="text-xl font-bold text-blue-600">₹</span>
                </div>
                <h1 className="text-lg font-bold text-gray-900">Pricing</h1>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
            
            {showMobileMenu && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Auto Pricing</span>
                    <AutomationToggle 
                      isActive={automationSettings.autoAdjust} 
                      onToggle={handleToggleAutomation}
                      isMobile={true}
                      isLoading={isLoadingAutomation}
                    />
                  </div>
                  <div className="space-y-2">
                    <button className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
                      View Plans
                    </button>
                    <button className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium">
                      Market Conditions
                    </button>
                    <button className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium">
                      Discounts
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header - Hidden on mobile when menu is shown */}
        {(!responsive.isMobile || !showMobileMenu) && (
          <header className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">₹</span>
              </div>
              <h1 className={`font-bold ${responsive.isMobile ? 'text-2xl' : responsive.isTablet ? 'text-3xl' : 'text-4xl sm:text-5xl'} text-gray-900`}>
                {responsive.isMobile ? 'Smart Pricing' : 'Indian Pricing Automation'}
              </h1>
            </div>
            <p className={`${responsive.isMobile ? 'text-sm' : 'text-base sm:text-xl'} text-gray-600 max-w-3xl mx-auto px-2 sm:px-0`}>
              Smart pricing in Indian Rupees (₹) with GST compliance. Share plans on WhatsApp, Facebook, Twitter & more.
              {!responsive.isMobile && (
                <span className="block text-lg text-gray-500 mt-2">
                  Prices adjust automatically based on market conditions.
                </span>
              )}
            </p>
          </header>
        )}

        {/* Currency Info - Hidden on mobile menu */}
        {(!responsive.isMobile || !showMobileMenu) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm mr-3">
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">₹</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${responsive.isMobile ? 'text-sm' : ''} text-gray-900`}>Indian Rupees (INR)</h3>
                  <p className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>All prices include 18% GST</p>
                </div>
              </div>
              <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-700`}>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${automationSettings.autoAdjust ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                    {automationSettings.autoAdjust ? 'Auto' : 'Manual'}
                  </span>
                  {automationStatus && (
                    <span className="ml-2 text-xs text-gray-500">
                      {automationStatus.isRunning ? 'Engine running' : 'Engine stopped'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Hidden on mobile menu */}
        {(!responsive.isMobile || !showMobileMenu) && (
          <main className="space-y-4 sm:space-y-6 lg:space-y-8">
            
            {/* Automation Control Panel */}
            <section className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <div>
                  <h2 className={`font-bold ${responsive.isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} text-gray-900 mb-1 sm:mb-2`}>
                    Automation Dashboard
                  </h2>
                  <p className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                    Control your pricing automation in ₹
                  </p>
                </div>
                <AutomationToggle 
                  isActive={automationSettings.autoAdjust} 
                  onToggle={handleToggleAutomation}
                  isMobile={responsive.isMobile}
                  isLoading={isLoadingAutomation}
                />
              </div>

              <div className={`grid ${getAutomationSettingsCols()} gap-3 sm:gap-4 lg:gap-6`}>
                <RangeSlider
                  label="Demand Factor"
                  value={automationSettings.demandFactor}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  onChange={(value) => handleAutomationSettingChange('demandFactor', value)}
                  unit="x"
                  isMobile={responsive.isMobile}
                  formatIndianRupees={formatIndianRupees}
                  isLoading={isLoadingAutomation}
                />

                <RangeSlider
                  label="Seasonal Adj"
                  value={automationSettings.seasonalAdjustment}
                  min={-20}
                  max={30}
                  step={5}
                  onChange={(value) => handleAutomationSettingChange('seasonalAdjustment', value)}
                  unit="%"
                  isMobile={responsive.isMobile}
                  formatIndianRupees={formatIndianRupees}
                  isLoading={isLoadingAutomation}
                />

                <RangeSlider
                  label="Profit Margin"
                  value={automationSettings.profitMargin}
                  min={10}
                  max={50}
                  step={5}
                  onChange={(value) => handleAutomationSettingChange('profitMargin', value)}
                  unit="%"
                  isMobile={responsive.isMobile}


                  

                  
                  formatIndianRupees={formatIndianRupees}
                  isLoading={isLoadingAutomation}
                />

                <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <label className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
                      Competitor Track
                    </label>
                    <div className="relative inline-block w-10 sm:w-12 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={automationSettings.competitorTracking}
                        onChange={(e) => handleAutomationSettingChange('competitorTracking', e.target.checked)}
                        disabled={isLoadingAutomation}
                        className="sr-only"
                        id="competitor-toggle"
                      />
                      <label
                        htmlFor="competitor-toggle"
                        className={`block h-5 sm:h-6 w-10 sm:w-12 rounded-full cursor-pointer transition-colors duration-300 ${
                          automationSettings.competitorTracking ? 'bg-blue-600' : 'bg-gray-300'
                        } ${isLoadingAutomation ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white w-4 sm:w-5 h-4 sm:h-5 rounded-full transition-transform duration-300 ${
                            automationSettings.competitorTracking ? 'transform translate-x-5 sm:translate-x-6' : ''
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                  <div className={`${responsive.isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500`}>
                    Adjust based on competitor rates
                  </div>
                </div>
              </div>
            </section>

            {/* Market Conditions */}
            <section className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 lg:p-6">
              <h3 className={`font-bold ${responsive.isMobile ? 'text-lg' : 'text-xl'} text-gray-900 mb-3 sm:mb-4 lg:mb-6`}>
                Market Conditions
              </h3>
              
              <div className={`grid ${getMarketConditionsCols()} gap-3 sm:gap-4 lg:gap-6`}>
                {/* Demand Level */}
                <div>
                  <label className={`block ${responsive.isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 mb-2 sm:mb-3`}>
                    Market Demand
                  </label>
                  <div className="space-y-1.5 sm:space-y-2">
                    {MARKET_CONDITIONS.DEMAND_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => handleMarketConditionChange('demand', level.value)}
                        disabled={isLoadingAutomation}
                        className={`w-full p-2.5 sm:p-3 lg:p-4 rounded-lg text-left transition-all ${
                          marketConditions.demand === level.value
                            ? 'bg-blue-50 border border-blue-500 text-blue-700 shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-300'
                        } ${isLoadingAutomation ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`font-medium ${responsive.isMobile ? 'text-sm' : ''}`}>{level.label}</div>
                        <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-0.5`}>
                          {level.multiplier === 1.1 && '+10% price'}
                          {level.multiplier === 1.0 && 'Standard'}
                          {level.multiplier === 0.9 && '-10% price'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seasonal Factors */}
                <div>
                  <label className={`block ${responsive.isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 mb-2 sm:mb-3`}>
                    Seasonal Factors
                  </label>
                  <div className="space-y-1.5 sm:space-y-2">
                    {MARKET_CONDITIONS.SEASONS.map((season) => (
                      <button
                        key={season.value}
                        onClick={() => handleMarketConditionChange('season', season.value)}
                        disabled={isLoadingAutomation}
                        className={`w-full p-2.5 sm:p-3 lg:p-4 rounded-lg text-left transition-all ${
                          marketConditions.season === season.value
                            ? 'bg-green-50 border border-green-500 text-green-700 shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-300'
                        } ${isLoadingAutomation ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`font-medium ${responsive.isMobile ? 'text-sm' : ''}`}>
                          {responsive.isMobile && season.label.includes('Season') 
                            ? season.label.replace(' Season', '') 
                            : season.label}
                        </div>
                        <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-0.5`}>
                          {season.multiplier === 1.15 && '+15% price'}
                          {season.multiplier === 1.0 && 'Standard'}
                          {season.multiplier === 0.85 && '-15% price'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Competitor Price */}
                <div className={responsive.isMobile ? 'col-span-2' : ''}>
                  <label className={`block ${responsive.isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 mb-2 sm:mb-3`}>
                    Competitor: {formatIndianRupees(marketConditions.competitorPrice)}
                  </label>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <input
                      type="range"
                      min="3000"
                      max="8000"
                      step="500"
                      value={marketConditions.competitorPrice}
                      onChange={(e) => handleMarketConditionChange('competitorPrice', parseInt(e.target.value))}
                      disabled={isLoadingAutomation}
                      className={`w-full h-1.5 sm:h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 sm:h-5 [&::-webkit-slider-thumb]:w-4 sm:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 ${isLoadingAutomation ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <div className={`flex justify-between ${responsive.isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 mt-2 sm:mt-3`}>
                      <span>{formatIndianRupees(3000)}</span>
                      <span>{formatIndianRupees(5500)}</span>
                      <span>{formatIndianRupees(8000)}</span>
                    </div>
                    <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-2 sm:mt-4`}>
                      <div className="flex items-center justify-between">
                        <span>Professional Plan:</span>
                        <span className="font-semibold">{formatIndianRupees(4999)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Plans Grid */}
            <section className="mb-4 sm:mb-6 lg:mb-8">
              <div className={`flex ${responsive.isMobile ? 'flex-col' : 'justify-between items-center'} gap-3 sm:gap-4 mb-4 sm:mb-6`}>
                <h2 className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-gray-900`}>
                  Pricing Plans
                </h2>
                {!responsive.isMobile && (
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-sm text-gray-600">Display:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => handleAutomationSettingChange('taxInclusive', true)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                          automationSettings.taxInclusive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        With GST
                      </button>
                      <button
                        onClick={() => handleAutomationSettingChange('taxInclusive', false)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                          !automationSettings.taxInclusive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Ex GST
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {responsive.isMobile && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Display prices:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => handleAutomationSettingChange('taxInclusive', true)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        automationSettings.taxInclusive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      With GST
                    </button>
                    <button
                      onClick={() => handleAutomationSettingChange('taxInclusive', false)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        !automationSettings.taxInclusive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Ex GST
                    </button>
                  </div>
                </div>
              )}

              {isLoadingPlans ? (
                <div className={`grid ${getGridCols()} gap-4 sm:gap-5 lg:gap-6`}>
                  {[1, 2, 3].map((index) => (
                    <PlanCard
                      key={index}
                      plan={{}}
                      annualDiscount={discounts.annualDiscount}
                      activeCoupons={[]}
                      isLoading={true}
                    />
                  ))}
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
                  <p className="text-gray-600">Try adjusting your filters or check back later.</p>
                </div>
              ) : (
                <div className={`grid ${getGridCols()} gap-4 sm:gap-5 lg:gap-6`}>
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan._id || plan.id}
                      plan={plan}
                      annualDiscount={discounts.annualDiscount}
                      activeCoupons={discounts.activeCoupons}
                      onSelectPlan={handlePlanSelect}
                      isAutomated={automationSettings.autoAdjust}
                      displayWithTax={automationSettings.taxInclusive}
                      isMobile={responsive.isMobile}
                      isTablet={responsive.isTablet}
                      formatIndianRupees={formatIndianRupees}
                      onShareTracked={handleShareTracked}
                      onPaymentInitiated={handlePaymentInitiated}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Social Sharing Analytics */}
            <section className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 lg:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className={`font-bold ${responsive.isMobile ? 'text-lg' : 'text-xl'} text-gray-900`}>
                  Social Sharing Analytics
                </h3>
                <button
                  onClick={fetchShareStats}
                  disabled={isLoadingShareStats}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isLoadingShareStats ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              {isLoadingShareStats ? (
                <LoadingSpinner message="Loading share analytics..." size="medium" />
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-4">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-blue-600`}>
                        {shareStats.totalShares}
                      </div>
                      <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Total Shares</div>
                    </div>
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                      <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-green-600`}>
                        {shareStats.platformStats.whatsapp || 0}
                      </div>
                      <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>WhatsApp</div>
                    </div>
                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                      <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-purple-600`}>
                        {shareStats.platformStats.facebook || 0}
                      </div>
                      <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Facebook</div>
                    </div>
                    <div className="bg-sky-50 p-3 sm:p-4 rounded-lg">
                      <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-sky-600`}>
                        {shareStats.platformStats.twitter || 0}
                      </div>
                      <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Twitter</div>
                    </div>
                    <div className="bg-pink-50 p-3 sm:p-4 rounded-lg">
                      <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-pink-600`}>
                        {shareStats.platformStats.instagram || 0}
                      </div>
                      <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Instagram</div>
                    </div>
                  </div>

                  {/* Recent Shares */}
                  {shareStats.recentShares.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className={`font-semibold ${responsive.isMobile ? 'text-base' : 'text-lg'} text-gray-900 mb-3`}>
                        Recent Shares
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {shareStats.recentShares.slice(0, 5).map((share, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                share.platform === 'whatsapp' ? 'bg-green-100' :
                                share.platform === 'facebook' ? 'bg-blue-100' :
                                share.platform === 'twitter' ? 'bg-sky-100' :
                                'bg-pink-100'
                              }`}>
                                {share.platform === 'whatsapp' && <MessageCircle className="w-4 h-4 text-green-600" />}
                                {share.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                                {share.platform === 'twitter' && <Twitter className="w-4 h-4 text-sky-600" />}
                                {share.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{share.planName || 'Unknown Plan'}</div>
                                <div className="text-xs text-gray-500 capitalize">{share.platform}</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {share.timestamp ? new Date(share.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Payment History Section */}
            {paymentHistory.length > 0 && (
              <section className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 lg:p-6">
                <h3 className={`font-bold ${responsive.isMobile ? 'text-lg' : 'text-xl'} text-gray-900 mb-4 sm:mb-6`}>
                  Recent Payments
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">₹</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{payment.plan.name}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {payment.paymentMethod.replace('_', ' ')} • {formatIndianRupees(payment.amount)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {new Date(payment.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          {payment.transactionId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Discount Management */}
            <section className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
              <h3 className={`font-bold ${responsive.isMobile ? 'text-lg' : 'text-xl'} text-gray-900 mb-4 sm:mb-6`}>
                Discount Management
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Annual Discount */}
                <div>
                  <label className={`block ${responsive.isMobile ? 'text-sm' : 'text-sm font-semibold'} text-gray-700 mb-3 sm:mb-4`}>
                    Annual Discount
                  </label>
                  <div className="space-y-3 sm:space-y-4">
                    <RangeSlider
                      label="Discount Percentage"
                      value={discounts.annualDiscount}
                      min={0}
                      max={40}
                      step={5}
                      onChange={(value) => setDiscounts(prev => ({ ...prev, annualDiscount: value }))}
                      unit="%"
                      isMobile={responsive.isMobile}
                      formatIndianRupees={formatIndianRupees}
                    />
                    <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600 p-3 bg-blue-50 rounded-lg`}>
                      <div className="font-medium mb-1">Annual savings:</div>
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        <div>Professional:</div>
                        <div className="text-right">
                          <span className="line-through text-gray-500 mr-1 sm:mr-2 text-xs sm:text-sm">
                            {formatIndianRupees(4999 * 12)}
                          </span>
                          <span className="font-semibold text-green-600 text-xs sm:text-sm">
                            {formatIndianRupees(
                              4999 * 12 * (1 - discounts.annualDiscount / 100)
                            )}
                          </span>
                        </div>
                        <div>You save:</div>
                        <div className="text-right font-semibold text-green-700 text-xs sm:text-sm">
                          {formatIndianRupees(
                            4999 * 12 * (discounts.annualDiscount / 100)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Management */}
                <div>
                  <label className={`block ${responsive.isMobile ? 'text-sm' : 'text-sm font-semibold'} text-gray-700 mb-3 sm:mb-4`}>
                    Promotional Coupons
                  </label>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex">
                      <input
                        type="text"
                        value={discounts.couponCode}
                        onChange={(e) => setDiscounts(prev => ({ ...prev, couponCode: e.target.value }))}
                        placeholder="Coupon code..."
                        className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !discounts.couponCode.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-6 rounded-r-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplyingCoupon ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>

                    {discounts.activeCoupons.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Active Coupons:</div>
                        <div className="space-y-2">
                          {discounts.activeCoupons.map((coupon, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2 sm:p-3"
                            >
                              <div className="flex items-center">
                                <span className="font-mono font-bold text-green-800 text-xs sm:text-sm">{coupon.code}</span>
                                <span className="mx-1 sm:mx-2 text-green-600 font-semibold text-xs sm:text-sm">-{coupon.discount}%</span>
                              </div>
                              <button
                                onClick={() => setDiscounts(prev => ({
                                  ...prev,
                                  activeCoupons: prev.activeCoupons.filter((_, i) => i !== index)
                                }))}
                                className="text-red-500 hover:text-red-700 p-0.5 sm:p-1 text-lg"
                                aria-label="Remove coupon"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                      <div className="font-medium mb-1">Available codes:</div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">WELCOME20</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">SAVE15</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">INDIAN10</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">STARTUP25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistics & History */}
            <section className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 lg:p-6">
              <h3 className={`font-bold ${responsive.isMobile ? 'text-lg' : 'text-xl'} text-gray-900 mb-4 sm:mb-6`}>
                Pricing Analytics
              </h3>
              
              <div className={`grid ${responsive.isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8`}>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-blue-600`}>
                    {totalCouponDiscount}%
                  </div>
                  <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Coupon Discount</div>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-green-600`}>
                    {discounts.annualDiscount}%
                  </div>
                  <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Annual Discount</div>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-purple-600`}>
                    {automationSettings.autoAdjust ? 'AI' : 'Manual'}
                  </div>
                  <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Pricing Mode</div>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className={`font-bold ${responsive.isMobile ? 'text-xl' : 'text-2xl'} text-orange-600`}>
                    {paymentHistory.length}
                  </div>
                  <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Recent Payments</div>
                </div>
              </div>

              {/* Price History */}
              {priceHistory.length > 0 && (
                <div className="border-t pt-4 sm:pt-6">
                  <h4 className={`font-semibold ${responsive.isMobile ? 'text-base' : 'text-lg'} text-gray-900 mb-3 sm:mb-4`}>
                    Recent Price Changes
                  </h4>
                  <div className={`space-y-2 ${responsive.isMobile ? 'max-h-48' : 'max-h-60'} overflow-y-auto pr-2`}>
                    {priceHistory.slice().reverse().map((change, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className={`font-medium ${responsive.isMobile ? 'text-sm' : ''} text-gray-900`}>
                            {change.planName}
                          </div>
                          <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                            {new Date(change.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <span className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-500 line-through mr-1 sm:mr-2`}>
                              {formatIndianRupees(change.oldPrice)}
                            </span>
                            <span className={`font-bold ${responsive.isMobile ? 'text-sm' : ''} text-gray-900`}>
                              {formatIndianRupees(change.newPrice)}
                            </span>
                          </div>
                          <div className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} ${change.newPrice > change.oldPrice ? 'text-red-600' : 'text-green-600'}`}>
                            {change.newPrice > change.oldPrice ? '▲' : '▼'} 
                            {Math.abs(((change.newPrice - change.oldPrice) / change.oldPrice) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Indian Market Summary:</div>
                <ul className={`${responsive.isMobile ? 'text-xs' : 'text-sm'} text-gray-700 space-y-0.5 sm:space-y-1`}>
                  <li>• All prices in Indian Rupees (₹)</li>
                  <li>• 18% GST included</li>
                  <li>• Competitor tracking enabled</li>
                  <li>• Seasonal adjustments applied</li>
                  <li>• Share plans on WhatsApp, Facebook, Twitter, Instagram</li>
                  <li>• Secure payments: Credit/Debit Cards, UPI, Net Banking</li>
                  {!responsive.isMobile && <li>• Special discounts for Indian customers</li>}
                </ul>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-6 sm:mt-8 lg:mt-12 text-center text-gray-600 text-xs sm:text-sm">
              <p>All prices in {CURRENCY.NAME} (₹) | GST compliant | Share on social media | {new Date().getFullYear()} Pricing Automation</p>
              <p className="mt-1 sm:mt-2">
                {responsive.isMobile ? 'Responsive design' : 'Designed for all devices'} • 
                {responsive.windowSize.width < BREAKPOINTS.sm && ' Mobile'} 
                {responsive.windowSize.width >= BREAKPOINTS.sm && responsive.windowSize.width < BREAKPOINTS.md && ' Tablet'} 
                {responsive.windowSize.width >= BREAKPOINTS.md && responsive.windowSize.width < BREAKPOINTS.lg && ' Laptop'} 
                {responsive.windowSize.width >= BREAKPOINTS.lg && ' Desktop'}
              </p>
            </footer>
          </main>
        )}
      </div>
    </div>
  );
};

export default PricingAutomationWithSharing;