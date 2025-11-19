import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Clock, CreditCard, Link } from 'lucide-react';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Please connect machine');
  const writerRef = useRef(null);

  const handleConnect = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const encoder = new TextEncoderStream();
      encoder.readable.pipeTo(port.writable);
      const writer = encoder.writable.getWriter();

      writerRef.current = writer;
      setIsConnected(true);
      setStatusMessage('✅ Machine connected');
    } catch (err) {
      setStatusMessage(`❌ ${err.message}`);
    }
  };

  // Automatically send QR when both amount and upiId are set
  useEffect(() => {
    const sendIfReady = async () => {
      if (isConnected && amount && upiId) {
        const upiLink = `upi://pay?pa=${upiId}&pn=Bumppy&am=${amount}&cu=INR`;
        const q = `${upiLink}::${amount}`;

        try {
          await writerRef.current.write(q + '\n');
          setIsWaiting(true);
          setStatusMessage('QR sent, waiting for payment...');
        } catch (err) {
          setStatusMessage(`Failed to send QR: ${err.message}`);
        }
      }
    };

    sendIfReady();
  }, [amount, upiId, isConnected]);

  const handleShowSuccess = async () => {
    if (!amount) return alert('Enter amount');
    setIsSuccess(true);
    setIsWaiting(false);
    setStatusMessage('Showing success');

    try {
      if (writerRef.current) {
        await writerRef.current.write('success\n');
      } else {
        setStatusMessage('Arduino not connected');
      }
    } catch (err) {
      setStatusMessage(`Failed to notify Arduino: ${err.message}`);
    }
  };

  // Auto-reset after success screen
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setAmount('');
        setUpiId('');
        setIsWaiting(false);
        setStatusMessage('Ready for next payment');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Success screen
  if (isSuccess) {
    return (
      <div className="full-screen success-screen">
        <CheckCircle size={72} strokeWidth={1.5} />
        <div className="screen-title">Payment Successful</div>
        <div className="amount-large">₹{amount}</div>
      </div>
    );
  }

  // Waiting for payment screen
  if (isWaiting) {
    return (
      <div className="full-screen waiting-screen">
        <Clock size={72} strokeWidth={1.5} />
        <div className="screen-title">Waiting for Payment</div>
        <div className="amount-large">₹{amount}</div>
        <button
          className="cancel-button"
          onClick={() => {
            setIsWaiting(false);
            setAmount('');
            setUpiId('');
            setStatusMessage('Payment cancelled');
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // Main screen
  return (
    <div className="main-container">
      <div className="icon-title">
        <CreditCard size={48} strokeWidth={1.5} />
        <h2 className="title">Bumppy QR Billing</h2>
      </div>

      <div className="status-text">{statusMessage}</div>

      <button
        className={`connect-button ${isConnected ? 'connected' : ''}`}
        onClick={handleConnect}
      >
        <Link size={20} style={{ marginRight: '8px' }} />
        {isConnected ? 'Machine Connected' : 'Connect Machine'}
      </button>

      <input
        type="number"
        placeholder="Enter Amount ₹"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input-large"
      />

      <input
        type="text"
        placeholder="Enter UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        className="input-large"
      />

      <button className="action-button-warning" onClick={handleShowSuccess}>
        Show Success
      </button>
    </div>
  );
};

export default PaymentScreen;
