import React, { useState, useEffect } from 'react';

const AmazonPaymentSummary = () => {
  const [paymentMethod, setPaymentMethod] = useState('amazonPay');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [useGiftCard, setUseGiftCard] = useState(false);
  const [giftCardBalance, setGiftCardBalance] = useState(50);
  const [appliedGiftCard, setAppliedGiftCard] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [selectedBank, setSelectedBank] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Amazon-like cart data
  const cartItems = [
    { 
      id: 1, 
      name: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds', 
      price: 199.99, 
      quantity: 1,
      deliveryDate: 'Friday, December 15'
    },
    { 
      id: 2, 
      name: 'Anker PowerCore 10000 Portable Charger', 
      price: 25.99, 
      quantity: 2,
      deliveryDate: 'Tomorrow, December 12'
    },
    { 
      id: 3, 
      name: 'Amazon Basics Microfiber Sheet Set, Queen, Charcoal Gray', 
      price: 29.99, 
      quantity: 1,
      deliveryDate: 'Monday, December 18'
    }
  ];
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const beforeTotal = subtotal + shipping + tax;
  const total = beforeTotal - appliedGiftCard - promoDiscount;

  const paymentMethods = [
    { 
      id: 'amazonPay', 
      name: 'Amazon Pay', 
      icon: '🟠',
      description: 'Pay with your Amazon balance',
      available: true
    },
    { 
      id: 'creditCard', 
      name: 'Credit or debit card', 
      icon: '💳',
      description: 'Visa, Mastercard, American Express, Discover',
      available: true
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: '💙',
      description: 'Pay with your PayPal account',
      available: true
    },
    { 
      id: 'affirm', 
      name: 'Affirm', 
      icon: '💰',
      description: 'Pay over time with Affirm',
      available: true
    },
    { 
      id: 'amazonCard', 
      name: 'Amazon Store Card', 
      icon: '💳',
      description: 'Special financing available',
      available: true
    },
    { 
      id: 'netBanking', 
      name: 'Online Banking', 
      icon: '🏦',
      description: 'Pay directly from your bank account',
      available: true
    },
    { 
      id: 'cash', 
      name: 'Cash on Delivery', 
      icon: '💵',
      description: 'Pay when you receive your order',
      available: true
    }
  ];

  const banks = [
    'Bank of America', 'Chase', 'Wells Fargo', 'Citibank', 'Capital One',
    'US Bank', 'PNC Bank', 'TD Bank', 'HSBC', 'SunTrust'
  ];

  const handlePayment = () => {
    // Validation
    if (paymentMethod === 'creditCard') {
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        alert('Please enter all card details');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 13) {
        alert('Please enter a valid card number');
        return;
      }
    }

    if (paymentMethod === 'netBanking' && !selectedBank) {
      alert('Please select your bank');
      return;
    }

    // Amazon-like confirmation alert
    const confirmation = window.confirm(
      `Do you want to buy these items?\nTotal: $${total.toFixed(2)}\nPayment method: ${paymentMethods.find(p => p.id === paymentMethod)?.name}`
    );

    if (confirmation) {
      alert(`✓ Order placed successfully!\n\nOrder Details:\n• Total: $${total.toFixed(2)}\n• Payment: ${paymentMethods.find(p => p.id === paymentMethod)?.name}\n• Items: ${cartItems.length}\n\nThank you for shopping with us!`);
    }
  };

  const applyGiftCard = () => {
    if (giftCardBalance > 0) {
      const amountToApply = Math.min(giftCardBalance, beforeTotal - promoDiscount);
      setAppliedGiftCard(amountToApply);
      setGiftCardBalance(prev => prev - amountToApply);
    }
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim();
    
    if (!code) {
      alert('Please enter a promo code');
      return;
    }

    if (promoApplied) {
      alert('A promo code is already applied. Remove it first to apply a new one.');
      return;
    }

    // Multiple promo codes
    const promoCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME15': 15,
      'FREESHIP': 5.99
    };

    if (promoCodes[code]) {
      setPromoDiscount(promoCodes[code]);
      setPromoApplied(true);
      alert(`✓ Promo code "${code}" applied! You saved $${promoCodes[code].toFixed(2)}`);
    } else {
      alert('Invalid promo code. Try: SAVE10, SAVE20, WELCOME15, or FREESHIP');
    }
  };

  const removeGiftCard = () => {
    setGiftCardBalance(prev => prev + appliedGiftCard);
    setAppliedGiftCard(0);
  };

  const removePromoCode = () => {
    setPromoDiscount(0);
    setPromoApplied(false);
    setPromoCode('');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Amazon Header */}
      <header className="bg-gray-900 text-white py-3 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-xl md:text-2xl font-bold">Grapeskart</span>
            <span className="text-orange-400 text-xl md:text-2xl">.com</span>
          </div>
          <div className={`hidden sm:flex items-center space-x-2 md:space-x-4 text-xs md:text-sm`}>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">1</div>
              <span className="hidden md:inline">Cart</span>
            </div>
            <span className="text-gray-400">›</span>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">2</div>
              <span className="hidden md:inline">Address</span>
            </div>
            <span className="text-gray-400">›</span>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">3</div>
              <span className="font-semibold hidden md:inline">Payment</span>
            </div>
            <span className="text-gray-400">›</span>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <span className="text-gray-400 hidden md:inline">Review</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="flex-1 space-y-4 md:space-y-6">
          {/* Payment Method Selection */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Select a payment method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className={`border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all ${
                    paymentMethod === method.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-0.5 md:mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                        <span className="text-xl md:text-2xl">{method.icon}</span>
                        <span className="font-medium text-sm md:text-base truncate">{method.name}</span>
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 truncate">{method.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'creditCard' && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Enter card details</h3>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength="19"
                  />
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    <span>Visa</span>
                    <span>Mastercard</span>
                    <span>Amex</span>
                    <span>Discover</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="John Doe"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="saveCard" className="w-4 h-4" />
                  <label htmlFor="saveCard" className="text-xs md:text-sm">
                    Save card for future purchases <span className="text-gray-500">(Secured by Amazon)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Net Banking */}
          {paymentMethod === 'netBanking' && (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Select your bank</h3>
              <select 
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option value="">Choose your bank</option>
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
          )}

          {/* Gift Cards & Promo Codes */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Gift cards & promotional codes</h3>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useGiftCard"
                  className="w-4 h-4"
                  checked={useGiftCard}
                  onChange={(e) => setUseGiftCard(e.target.checked)}
                />
                <label htmlFor="useGiftCard" className="text-sm font-medium">Apply a gift card</label>
              </div>
              
              {useGiftCard && (
                <div className="pl-4 md:pl-6 space-y-3">
                  <p className="text-sm">
                    Gift card balance: <span className="font-semibold">${giftCardBalance.toFixed(2)}</span>
                  </p>
                  {appliedGiftCard > 0 ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                      <span className="text-xs md:text-sm text-green-700">Applied: ${appliedGiftCard.toFixed(2)}</span>
                      <button 
                        className="text-xs md:text-sm text-blue-600 hover:underline"
                        onClick={removeGiftCard}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="px-3 md:px-4 py-2 text-xs md:text-sm bg-orange-400 text-white rounded hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={applyGiftCard}
                      disabled={giftCardBalance === 0}
                    >
                      Apply Gift Card Balance
                    </button>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button 
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed sm:w-auto"
                  onClick={applyPromoCode}
                  disabled={promoApplied}
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                  <span className="text-xs md:text-sm text-green-700">✓ Promo code applied: -${promoDiscount.toFixed(2)}</span>
                  <button 
                    className="text-xs md:text-sm text-blue-600 hover:underline"
                    onClick={removePromoCode}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Notice */}
          {paymentMethod === 'amazonPay' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 flex gap-2 md:gap-3">
              <div className="text-blue-600 text-lg md:text-xl mt-0.5">ℹ️</div>
              <div className="min-w-0">
                <div className="font-semibold text-blue-900 text-sm md:text-base">Amazon Pay</div>
                <p className="text-xs md:text-sm text-blue-800 mt-1">
                  You'll complete your purchase on the Amazon Pay website. You can use the payment methods stored in your Amazon account.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className={`w-full lg:w-80 ${isMobile ? 'order-first' : ''}`}>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-6">
            <button 
              className="w-full bg-orange-400 text-white py-3 text-sm md:text-base rounded-lg font-semibold hover:bg-orange-500 mb-3 md:mb-4"
              onClick={handlePayment}
            >
              Place your order
            </button>
            
            <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-3 md:mb-4 max-h-48 md:max-h-60 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-2 md:gap-3 pb-3 border-b">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded flex items-center justify-center text-lg md:text-2xl flex-shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm font-medium line-clamp-2">{item.name}</div>
                    <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                    <div className="text-xs text-green-700">{item.deliveryDate}</div>
                  </div>
                  <div className="text-xs md:text-sm font-semibold whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm mb-3 md:mb-4 pt-3 md:pt-4 border-t">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {appliedGiftCard > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Gift card:</span>
                  <span>-${appliedGiftCard.toFixed(2)}</span>
                </div>
              )}
              {promoApplied && (
                <div className="flex justify-between text-green-700">
                  <span>Promo discount:</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base md:text-lg font-bold pt-2 md:pt-2 border-t">
                <span>Order total:</span>
                <span className="text-red-700">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-xs md:text-sm mb-3 md:mb-4 pb-3 md:pb-4 border-b">
              <div className="text-gray-600 mb-1">Payment method:</div>
              <div className="font-medium truncate">{paymentMethods.find(p => p.id === paymentMethod)?.name}</div>
            </div>
            
            <div className="text-xs md:text-sm mb-3 md:mb-4 pb-3 md:pb-4 border-b">
              <div className="font-semibold mb-1">Deliver to: John Doe</div>
              <div className="text-gray-600">
                123 Main St, Apt 4B<br />
                New York, NY 10001<br />
                United States
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
              <span className="text-green-600">🔒</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">Secure transaction</div>
                <div className="text-xs">Your payment is secure</div>
              </div>
            </div>
            
            <a href="#" className="text-xs text-blue-600 hover:underline">
              Need help? Contact Customer Service
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4 md:py-6 mt-6 md:mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:underline">Interest-Based Ads</a>
          <span className="hidden sm:inline">|</span>
          <span>© 1996-2024, Amazon.com, Inc.</span>
        </div>
      </footer>
    </div>
  );
};

export default AmazonPaymentSummary;