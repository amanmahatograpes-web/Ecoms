import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCw,
  Download,
  MoreVertical,
  AlertCircle,
  Truck,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Globe,
  RefreshCcw,
  X,
  ChevronUp,
  ChevronDown,
  BarChart3,
  DollarSign,
  ArrowUpDown,
  Eye,
  FileText,
  Printer,
  Mail,
  Share2,
  CheckCircle,
  XSquare,
} from "lucide-react";

// Breakpoints for responsive design
const BREAKPOINTS = {
  xs: 320,   // Extra small mobile
  sm: 480,   // Small mobile
  md: 640,   // Mobile landscape / Small tablet
  lg: 768,   // Tablet
  xl: 1024,  // Laptop
  '2xl': 1280, // Desktop
  '3xl': 1536, // Large desktop
  '4xl': 1920  // Extra large desktop
};

// GST Types Constants
const GST_TYPES = {
  CGST: {
    name: "Central Goods & Services Tax",
    description: "Within a state",
    collectedBy: "Central Government",
    rate: 9 // 9% for most goods (18% total GST = 9% CGST + 9% SGST)
  },
  SGST: {
    name: "State Goods & Services Tax",
    description: "Within a state",
    collectedBy: "State Government",
    rate: 9
  },
  IGST: {
    name: "Integrated Goods & Services Tax",
    description: "Between two states",
    collectedBy: "Central Government",
    rate: 18 // 18% for interstate transactions
  },
  UTGST: {
    name: "Union Territory Goods & Services Tax",
    description: "Within union territories",
    collectedBy: "Union Territory Government",
    rate: 9
  }
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

      // Determine breakpoint
      let currentBreakpoint = 'xs';
      if (width >= BREAKPOINTS['4xl']) currentBreakpoint = '4xl';
      else if (width >= BREAKPOINTS['3xl']) currentBreakpoint = '3xl';
      else if (width >= BREAKPOINTS['2xl']) currentBreakpoint = '2xl';
      else if (width >= BREAKPOINTS.xl) currentBreakpoint = 'xl';
      else if (width >= BREAKPOINTS.lg) currentBreakpoint = 'lg';
      else if (width >= BREAKPOINTS.md) currentBreakpoint = 'md';
      else if (width >= BREAKPOINTS.sm) currentBreakpoint = 'sm';
      
      setBreakpoint(currentBreakpoint);

      // Determine device type
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

// API Service for fetching data
const ApiService = {
  // Fetch cancelled orders from API
  async fetchCancelledOrders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "112-4455677-998877",
            product: "Wireless Bluetooth Earbuds with Noise Cancellation",
            image: "https://m.media-amazon.com/images/I/61kRB0kmQOL._AC_UL320_.jpg",
            buyer: "Aman Kumar",
            price: 1299,
            lossAmount: 259,
            date: "2025-11-28",
            fulfillment: "FBA",
            status: "Cancelled",
            reason: "Buyer Cancelled",
            buyerEmail: "aman.kumar@email.com",
            buyerPhone: "+91 9876543210",
            shippingAddress: "123 Main St, Mumbai, Maharashtra 400001",
            paymentMethod: "Credit Card",
            orderValue: 1299,
            refundAmount: 1040,
            processingFees: 259,
            category: "Electronics",
            asin: "B08XYZ1234",
            sku: "EARBUDS-PRO-001",
            sellerState: "Maharashtra",
            buyerState: "Delhi",
            sellerGSTIN: "27AABCU9603R1ZX",
            buyerGSTIN: "07AABCU9603R1ZY",
            gstType: "IGST",
            gstAmount: 233.82,
            taxableValue: 1299,
            hsnCode: "8517"
          },
          {
            id: "113-7788990-221133",
            product: "USB-C Fast Charger 25W Power Adapter",
            image: "https://m.media-amazon.com/images/I/61rZyL1ZtCL._AC_UL320_.jpg",
            buyer: "Ravi Singh",
            price: 699,
            lossAmount: 139,
            date: "2025-11-25",
            fulfillment: "FBM",
            status: "Payment Failed",
            reason: "Payment Declined",
            buyerEmail: "ravi.singh@email.com",
            buyerPhone: "+91 9876543211",
            shippingAddress: "456 Park Ave, Delhi, Delhi 110001",
            paymentMethod: "Debit Card",
            orderValue: 699,
            refundAmount: 699,
            processingFees: 0,
            category: "Electronics",
            asin: "B08XYZ1235",
            sku: "CHARGER-25W-001",
            sellerState: "Maharashtra",
            buyerState: "Maharashtra",
            sellerGSTIN: "27AABCU9603R1ZX",
            buyerGSTIN: "27BABCU9603R1ZZ",
            gstType: "CGST+SGST",
            gstAmount: 125.82,
            taxableValue: 699,
            hsnCode: "8504"
          },
          {
            id: "118-1122334-445566",
            product: "Smart Fitness Band with Heart Rate Monitor",
            image: "https://m.media-amazon.com/images/I/61q2hYIQ+PL._AC_UL320_.jpg",
            buyer: "Priya Sharma",
            price: 1799,
            lossAmount: 359,
            date: "2025-11-21",
            fulfillment: "FBA",
            status: "Returned to Seller",
            reason: "Customer Return",
            buyerEmail: "priya.sharma@email.com",
            buyerPhone: "+91 9876543212",
            shippingAddress: "789 Beach Rd, Chennai, Tamil Nadu 600001",
            paymentMethod: "UPI",
            orderValue: 1799,
            refundAmount: 1440,
            processingFees: 359,
            category: "Electronics",
            asin: "B08XYZ1236",
            sku: "FITNESS-BAND-001",
            sellerState: "Maharashtra",
            buyerState: "Tamil Nadu",
            sellerGSTIN: "27AABCU9603R1ZX",
            buyerGSTIN: "33AABCU9603R1ZA",
            gstType: "IGST",
            gstAmount: 323.82,
            taxableValue: 1799,
            hsnCode: "8517"
          },
          {
            id: "119-5566778-990011",
            product: "Laptop Backpack Waterproof 15.6 inch",
            image: "https://m.media-amazon.com/images/I/71qxQr-yK6L._AC_UL320_.jpg",
            buyer: "Vikram Patel",
            price: 1299,
            lossAmount: 259,
            date: "2025-11-18",
            fulfillment: "FBM",
            status: "Cancelled",
            reason: "Out of Stock",
            buyerEmail: "vikram.patel@email.com",
            buyerPhone: "+91 9876543213",
            shippingAddress: "101 Tech Park, Bangalore, Karnataka 560001",
            paymentMethod: "Credit Card",
            orderValue: 1299,
            refundAmount: 1040,
            processingFees: 259,
            category: "Fashion",
            asin: "B08XYZ1237",
            sku: "BACKPACK-15-001",
            sellerState: "Maharashtra",
            buyerState: "Karnataka",
            sellerGSTIN: "27AABCU9603R1ZX",
            buyerGSTIN: "29AABCU9603R1ZB",
            gstType: "IGST",
            gstAmount: 233.82,
            taxableValue: 1299,
            hsnCode: "4202"
          },
          {
            id: "120-3344556-667788",
            product: "Smart Watch with Bluetooth Calling",
            image: "https://m.media-amazon.com/images/I/61X8rxqYaAL._AC_UL320_.jpg",
            buyer: "Neha Gupta",
            price: 2999,
            lossAmount: 599,
            date: "2025-11-15",
            fulfillment: "FBA",
            status: "Refunded",
            reason: "Customer Request",
            buyerEmail: "neha.gupta@email.com",
            buyerPhone: "+91 9876543214",
            shippingAddress: "202 Mall Road, Delhi, Delhi 110001",
            paymentMethod: "Debit Card",
            orderValue: 2999,
            refundAmount: 2400,
            processingFees: 599,
            category: "Electronics",
            asin: "B08XYZ1238",
            sku: "SMARTWATCH-001",
            sellerState: "Maharashtra",
            buyerState: "Delhi",
            sellerGSTIN: "27AABCU9603R1ZX",
            buyerGSTIN: "07AABCU9603R1ZC",
            gstType: "IGST",
            gstAmount: 539.82,
            taxableValue: 2999,
            hsnCode: "8517"
          }
        ]);
      }, 500);
    });
  },

  // Generate invoice with GST calculations
  async generateInvoice(orderId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock order data - in real app, this would come from the API
        const mockOrders = {
          "112-4455677-998877": {
            buyerState: "Delhi",
            sellerState: "Maharashtra",
            price: 1299,
            hsnCode: "8517"
          },
          "113-7788990-221133": {
            buyerState: "Maharashtra",
            sellerState: "Maharashtra",
            price: 699,
            hsnCode: "8504"
          },
          "118-1122334-445566": {
            buyerState: "Tamil Nadu",
            sellerState: "Maharashtra",
            price: 1799,
            hsnCode: "8517"
          },
          "119-5566778-990011": {
            buyerState: "Karnataka",
            sellerState: "Maharashtra",
            price: 1299,
            hsnCode: "4202"
          },
          "120-3344556-667788": {
            buyerState: "Delhi",
            sellerState: "Maharashtra",
            price: 2999,
            hsnCode: "8517"
          }
        };

        const order = mockOrders[orderId] || mockOrders["112-4455677-998877"];
        const { buyerState, sellerState, price, hsnCode } = order;
        
        // Determine GST type based on buyer and seller location
        const isInterstate = buyerState !== sellerState;
        const isUnionTerritory = ["Delhi", "Puducherry", "Chandigarh", "Andaman and Nicobar", "Lakshadweep", "Dadra and Nagar Haveli and Daman and Diu", "Ladakh"].includes(buyerState);
        
        let gstType, gstRate, cgst = 0, sgst = 0, igst = 0, utgst = 0;
        
        if (isInterstate) {
          gstType = "IGST";
          gstRate = GST_TYPES.IGST.rate;
          igst = (price * gstRate) / 100;
        } else {
          if (isUnionTerritory) {
            gstType = "UTGST";
            gstRate = GST_TYPES.UTGST.rate + GST_TYPES.CGST.rate;
            cgst = (price * GST_TYPES.CGST.rate) / 100;
            utgst = (price * GST_TYPES.UTGST.rate) / 100;
          } else {
            gstType = "CGST+SGST";
            gstRate = GST_TYPES.CGST.rate + GST_TYPES.SGST.rate;
            cgst = (price * GST_TYPES.CGST.rate) / 100;
            sgst = (price * GST_TYPES.SGST.rate) / 100;
          }
        }
        
        const totalGST = cgst + sgst + igst + utgst;
        const subtotal = price;
        const total = subtotal + totalGST;
        
        resolve({
          invoiceId: `INV-${orderId}`,
          orderId,
          date: new Date().toISOString().split('T')[0],
          items: [{
            name: "Product Item",
            quantity: 1,
            price: price,
            tax: totalGST,
            total: total
          }],
          subtotal: subtotal,
          gstDetails: {
            type: gstType,
            rate: gstRate,
            cgst: parseFloat(cgst.toFixed(2)),
            sgst: parseFloat(sgst.toFixed(2)),
            igst: parseFloat(igst.toFixed(2)),
            utgst: parseFloat(utgst.toFixed(2)),
            totalGST: parseFloat(totalGST.toFixed(2))
          },
          total: total,
          sellerState: sellerState,
          buyerState: buyerState,
          sellerGSTIN: "27AABCU9603R1ZX",
          buyerGSTIN: "07AABCU9603R1ZY",
          hsnCode: hsnCode,
          pdfUrl: `https://api.example.com/invoices/${orderId}.pdf`,
          downloadUrl: `https://api.example.com/invoices/${orderId}/download`
        });
      }, 300);
    });
  },

  // Export multiple orders
  async exportOrders(orderIds, format = 'csv') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          exportId: `EXP-${Date.now()}`,
          downloadUrl: `https://api.example.com/exports/${Date.now()}.${format}`,
          count: orderIds.length,
          format
        });
      }, 800);
    });
  },

  // Get cancellation analytics
  async getCancellationAnalytics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalCancelled: 156,
          paymentFailed: 45,
          returned: 67,
          totalLoss: 45289,
          avgOrderValue: 1899,
          cancellationRate: 8.5,
          topReasons: [
            { reason: "Buyer Cancelled", count: 56, percentage: 35.9 },
            { reason: "Payment Declined", count: 45, percentage: 28.8 },
            { reason: "Customer Return", count: 32, percentage: 20.5 },
            { reason: "Out of Stock", count: 15, percentage: 9.6 },
            { reason: "Shipping Issue", count: 8, percentage: 5.2 }
          ]
        });
      }, 400);
    });
  }
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

// Enhanced Invoice Modal Component with GST
// Enhanced Invoice Modal Component with GST (without the GST types table)
const InvoiceModal = ({ order, invoice, onClose, onPrint, onEmail }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header - Hidden when printing */}
        <div className="invoice-modal-header">
          <div>
            <h3 className="invoice-modal-title">Tax Invoice #{invoice.invoiceId}</h3>
            <p className="invoice-modal-subtitle">Order: {order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="invoice-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Invoice Content */}
        <div className="invoice-content">
          {/* Invoice Header */}
          <div className="invoice-header">
            <div className="invoice-header-main">
              <div>
                <h1 className="invoice-title">Tax Invoice</h1>
                <div className="invoice-details">
                  <p><span className="invoice-label">Invoice #:</span> {invoice.invoiceId}</p>
                  <p><span className="invoice-label">Order #:</span> {order.id}</p>
                  <p><span className="invoice-label">Date:</span> {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="invoice-status">
                <div className="invoice-cancelled">CANCELLED</div>
                <div className="invoice-status-text">{order.status}</div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="invoice-company-info">
            <div className="invoice-seller-info">
              <h4 className="invoice-section-title">Seller Information</h4>
              <div className="invoice-text-sm">
                <p className="invoice-bold">Amazon Seller Pvt. Ltd.</p>
                <p><span className="invoice-label">GSTIN:</span> {invoice.sellerGSTIN}</p>
                <p><span className="invoice-label">State:</span> {invoice.sellerState}</p>
                <p>123 Business Park, Mumbai</p>
                <p>Maharashtra, India - 400001</p>
                <p>Phone: +91 22 1234 5678</p>
              </div>
            </div>
            
            <div className="invoice-buyer-info">
              <h4 className="invoice-section-title">Buyer Information</h4>
              <div className="invoice-text-sm">
                <p className="invoice-bold">{order.buyer}</p>
                <p><span className="invoice-label">GSTIN:</span> {order.buyerGSTIN}</p>
                <p><span className="invoice-label">State:</span> {order.buyerState}</p>
                <p>{order.buyerEmail}</p>
                <p>{order.buyerPhone}</p>
                <p className="invoice-address">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Details Table */}
          <div className="invoice-table-container">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th className="invoice-table-header">Description</th>
                  <th className="invoice-table-header">HSN/SAC</th>
                  <th className="invoice-table-header">Qty</th>
                  <th className="invoice-table-header">Unit Price</th>
                  <th className="invoice-table-header">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="invoice-table-cell">
                    <div className="invoice-product">
                      <img
                        src={order.image}
                        className="invoice-product-image"
                        alt={order.product}
                      />
                      <div>
                        <p className="invoice-product-name">{order.product}</p>
                        <p className="invoice-product-code">ASIN: {order.asin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="invoice-table-cell">{invoice.hsnCode}</td>
                  <td className="invoice-table-cell invoice-text-center">1</td>
                  <td className="invoice-table-cell">{formatPrice(order.price)}</td>
                  <td className="invoice-table-cell invoice-bold">{formatPrice(order.price)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GST and Transaction Details */}
          <div className="invoice-details-grid">
            <div className="invoice-gst-details">
              <h4 className="invoice-section-title">GST Details</h4>
              <div className="invoice-details-list">
                <div className="invoice-detail-row">
                  <span>Taxable Value:</span>
                  <span className="invoice-bold">{formatPrice(invoice.subtotal)}</span>
                </div>
                {invoice.gstDetails.cgst > 0 && (
                  <div className="invoice-detail-row">
                    <span>CGST @ {GST_TYPES.CGST.rate}%:</span>
                    <span className="invoice-bold">{formatPrice(invoice.gstDetails.cgst)}</span>
                  </div>
                )}
                {invoice.gstDetails.sgst > 0 && (
                  <div className="invoice-detail-row">
                    <span>SGST @ {GST_TYPES.SGST.rate}%:</span>
                    <span className="invoice-bold">{formatPrice(invoice.gstDetails.sgst)}</span>
                  </div>
                )}
                {invoice.gstDetails.igst > 0 && (
                  <div className="invoice-detail-row">
                    <span>IGST @ {GST_TYPES.IGST.rate}%:</span>
                    <span className="invoice-bold">{formatPrice(invoice.gstDetails.igst)}</span>
                  </div>
                )}
                {invoice.gstDetails.utgst > 0 && (
                  <div className="invoice-detail-row">
                    <span>UTGST @ {GST_TYPES.UTGST.rate}%:</span>
                    <span className="invoice-bold">{formatPrice(invoice.gstDetails.utgst)}</span>
                  </div>
                )}
                <div className="invoice-total-gst">
                  <div className="invoice-detail-row invoice-bold">
                    <span>Total GST:</span>
                    <span className="invoice-blue">{formatPrice(invoice.gstDetails.totalGST)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-transaction-details">
              <h4 className="invoice-section-title">Transaction Details</h4>
              <div className="invoice-details-list">
                <div className="invoice-detail-row">
                  <span className="invoice-label">Transaction Type:</span>
                  <span className="invoice-bold">
                    {invoice.sellerState === invoice.buyerState ? 'Intra-State' : 'Inter-State'}
                  </span>
                </div>
                <div className="invoice-detail-row">
                  <span className="invoice-label">GST Type:</span>
                  <span className="invoice-bold">{invoice.gstDetails.type}</span>
                </div>
                <div className="invoice-detail-row">
                  <span className="invoice-label">Payment Method:</span>
                  <span className="invoice-bold">{order.paymentMethod}</span>
                </div>
                <div className="invoice-detail-row">
                  <span className="invoice-label">Order Date:</span>
                  <span className="invoice-bold">{new Date(order.date).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="invoice-summary">
            <table className="invoice-summary-table">
              <tbody>
                <tr>
                  <td className="invoice-summary-label">Subtotal</td>
                  <td className="invoice-summary-value invoice-text-right">{formatPrice(invoice.subtotal)}</td>
                </tr>
                <tr>
                  <td className="invoice-summary-label">Total GST</td>
                  <td className="invoice-summary-value invoice-text-right invoice-blue">{formatPrice(invoice.gstDetails.totalGST)}</td>
                </tr>
                <tr className="invoice-grand-total">
                  <td className="invoice-summary-label invoice-bold">Grand Total</td>
                  <td className="invoice-summary-value invoice-text-right invoice-bold invoice-total">{formatPrice(invoice.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cancellation Refund Summary */}
          <div className="invoice-cancellation-summary">
            <h4 className="invoice-section-title invoice-red">Cancellation Refund Summary</h4>
            <div className="invoice-cancellation-grid">
              <div className="invoice-cancellation-item">
                <div className="invoice-cancellation-label">Order Value</div>
                <div className="invoice-cancellation-value">{formatPrice(order.orderValue)}</div>
              </div>
              <div className="invoice-cancellation-item">
                <div className="invoice-cancellation-label">Refund Amount</div>
                <div className="invoice-cancellation-value invoice-green">{formatPrice(order.refundAmount)}</div>
              </div>
              <div className="invoice-cancellation-item">
                <div className="invoice-cancellation-label">Total Loss</div>
                <div className="invoice-cancellation-value invoice-red">{formatPrice(order.lossAmount)}</div>
              </div>
            </div>
            <div className="invoice-cancellation-note">
              Note: Loss includes processing fees and other applicable charges
            </div>
          </div>

          {/* Footer Notes */}
          <div className="invoice-footer">
            <div className="invoice-footer-notes">
              <p>This is a computer-generated invoice and does not require a physical signature.</p>
              <p>GSTIN: {invoice.sellerGSTIN} | Invoice Date: {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
              <p>For any queries, contact support@amazonseller.com or call +91 22 1234 5678</p>
            </div>
          </div>
        </div>

        {/* Actions - Hidden when printing */}
        <div className="invoice-actions">
          <div className="invoice-actions-info">
            Invoice #{invoice.invoiceId} • Generated on {new Date().toLocaleDateString('en-IN')}
          </div>
          <div className="invoice-actions-buttons">
            <button
              onClick={onEmail}
              className="invoice-btn invoice-btn-secondary"
            >
              <Mail size={14} />
              Email
            </button>
            <button
              onClick={handlePrint}
              className="invoice-btn invoice-btn-primary"
            >
              <Printer size={14} />
              Print
            </button>
            <a
              href={invoice.pdfUrl}
              download
              className="invoice-btn invoice-btn-success"
            >
              <Download size={14} />
              Download
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Modal Styles */
        .invoice-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
        }

        .invoice-modal-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 56rem;
          max-height: 90vh;
          overflow-y: auto;
        }

        .invoice-modal-header {
          position: sticky;
          top: 0;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .invoice-modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .invoice-modal-subtitle {
          font-size: 0.875rem;
          color: #4b5563;
        }

        .invoice-close-btn {
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }

        .invoice-close-btn:hover {
          background: #f3f4f6;
        }

        /* Invoice Content */
        .invoice-content {
          padding: 1rem;
        }

        .invoice-header {
          margin-bottom: 1.5rem;
        }

        .invoice-header-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .invoice-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .invoice-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
        }

        .invoice-label {
          font-weight: 500;
          color: #4b5563;
        }

        .invoice-status {
          text-align: right;
        }

        .invoice-cancelled {
          font-size: 1.5rem;
          font-weight: 700;
          color: #dc2626;
        }

        .invoice-status-text {
          font-size: 0.875rem;
          color: #4b5563;
          margin-top: 0.25rem;
        }

        /* Company Info */
        .invoice-company-info {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .invoice-company-info {
            grid-template-columns: 1fr 1fr;
          }
        }

        .invoice-seller-info,
        .invoice-buyer-info {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem;
        }

        .invoice-section-title {
          font-weight: 700;
          color: #111827;
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }

        .invoice-text-sm {
          font-size: 0.875rem;
        }

        .invoice-bold {
          font-weight: 600;
        }

        .invoice-address {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Table */
        .invoice-table-container {
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d1d5db;
        }

        .invoice-table-header {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .invoice-table-cell {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .invoice-product {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .invoice-product-image {
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.25rem;
          object-fit: cover;
        }

        .invoice-product-name {
          font-weight: 500;
        }

        .invoice-product-code {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .invoice-text-center {
          text-align: center;
        }

        /* Details Grid */
        .invoice-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .invoice-details-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .invoice-gst-details,
        .invoice-transaction-details {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem;
        }

        .invoice-details-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .invoice-detail-row {
          display: flex;
          justify-content: space-between;
        }

        .invoice-total-gst {
          border-top: 1px solid #e5e7eb;
          padding-top: 0.5rem;
          margin-top: 0.5rem;
        }

        .invoice-blue {
          color: #2563eb;
        }

        /* Summary */
        .invoice-summary {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .invoice-summary-table {
          width: 100%;
        }

        .invoice-summary-label {
          padding: 0.75rem;
          font-size: 0.875rem;
        }

        .invoice-summary-value {
          padding: 0.75rem;
          font-size: 0.875rem;
        }

        .invoice-text-right {
          text-align: right;
        }

        .invoice-grand-total {
          background: #f9fafb;
        }

        .invoice-total {
          font-size: 1.125rem;
        }

        /* Cancellation Summary */
        .invoice-cancellation-summary {
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          background: #fef2f2;
          padding: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .invoice-red {
          color: #dc2626;
        }

        .invoice-green {
          color: #16a34a;
        }

        .invoice-cancellation-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        @media (min-width: 768px) {
          .invoice-cancellation-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .invoice-cancellation-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.5rem;
          text-align: center;
        }

        .invoice-cancellation-label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .invoice-cancellation-value {
          font-size: 1.125rem;
          font-weight: 700;
          margin-top: 0.25rem;
        }

        .invoice-cancellation-note {
          font-size: 0.75rem;
          color: #dc2626;
          margin-top: 0.5rem;
        }

        /* Footer */
        .invoice-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 0.75rem;
        }

        .invoice-footer-notes {
          font-size: 0.75rem;
          color: #6b7280;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        /* Actions */
        .invoice-actions {
          position: sticky;
          bottom: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .invoice-actions-info {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .invoice-actions-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .invoice-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.2s;
          cursor: pointer;
          border: none;
          text-decoration: none;
        }

        .invoice-btn-secondary {
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
        }

        .invoice-btn-secondary:hover {
          background: #f3f4f6;
        }

        .invoice-btn-primary {
          background: #2563eb;
          color: white;
          border: 1px solid #2563eb;
        }

        .invoice-btn-primary:hover {
          background: #1d4ed8;
        }

        .invoice-btn-success {
          background: #16a34a;
          color: white;
          border: 1px solid #16a34a;
        }

        .invoice-btn-success:hover {
          background: #15803d;
        }

        /* Print Styles */
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }

          body * {
            visibility: hidden;
          }

          .invoice-modal-overlay,
          .invoice-modal-container,
          .invoice-modal-container * {
            visibility: visible;
          }

          .invoice-modal-overlay {
            position: absolute;
            inset: 0;
            background: white;
            padding: 0;
            margin: 0;
          }

          .invoice-modal-container {
            max-width: 100%;
            max-height: none;
            box-shadow: none;
            border-radius: 0;
            margin: 0;
            padding: 0;
          }

          .invoice-modal-header,
          .invoice-actions {
            display: none !important;
          }

          .invoice-content {
            padding: 0;
          }

          .invoice-title {
            font-size: 1.75rem;
          }

          .invoice-cancelled {
            font-size: 1.5rem;
          }

          .invoice-product-image {
            width: 2rem;
            height: 2rem;
          }

          .invoice-summary-value {
            font-size: 0.875rem;
          }

          .invoice-total {
            font-size: 1rem;
          }

          .invoice-cancellation-value {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
// Enhanced Cancelled Order Card Component for Mobile View with GST
const CancelledOrderCard = ({ order, statusColors, onAction, deviceType }) => {
  const isMobile = deviceType === 'mobile';
  
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
    if (isMobile) {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getReasonColor = (reason) => {
    const colors = {
      'Buyer Cancelled': 'bg-red-50 text-red-700 border-red-200',
      'Payment Declined': 'bg-orange-50 text-orange-700 border-orange-200',
      'Customer Return': 'bg-blue-50 text-blue-700 border-blue-200',
      'Out of Stock': 'bg-purple-50 text-purple-700 border-purple-200',
      'Shipping Issue': 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[reason] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getGSTColor = (gstType) => {
    if (gstType === 'IGST') return 'bg-purple-100 text-purple-700';
    if (gstType === 'CGST+SGST') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-blue-700 text-sm">{order.id}</div>
          <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
            {isMobile ? order.status.split(' ')[0] : order.status}
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
          <div className="mt-2">
            <div className="font-bold text-gray-900">{formatPrice(order.price)}</div>
            <div className="text-xs text-gray-500">{order.category}</div>
          </div>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Buyer</div>
          <div className="font-medium text-gray-900 text-sm">{order.buyer}</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Loss Amount</div>
          <div className="font-bold text-red-600 text-sm">
            {formatPrice(order.lossAmount || 0)}
          </div>
        </div>
      </div>

      {/* GST Info */}
      <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-900">GST Information</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${getGSTColor(order.gstType)}`}>
            {order.gstType}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Taxable Value:</span>
            <p className="font-medium">{formatPrice(order.taxableValue)}</p>
          </div>
          <div>
            <span className="text-gray-600">GST Amount:</span>
            <p className="font-medium text-blue-600">{formatPrice(order.gstAmount)}</p>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4">
        <div className={`p-2 rounded-lg ${getReasonColor(order.reason)}`}>
          <div className="text-xs font-medium mb-1">Cancellation Reason</div>
          <div className="font-medium text-sm">{order.reason}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onAction?.('View Details', order)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Eye size={14} />
          <span>Details</span>
        </button>
        
        <button
          onClick={() => onAction?.('Generate Invoice', order)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <FileText size={14} />
          <span>Invoice</span>
        </button>
        
        <button
          onClick={() => onAction?.('Contact Buyer', order)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
        >
          <Mail size={14} />
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
};

// Mobile Filters Component
const MobileFilters = ({ 
  search, 
  setSearch, 
  filterStatus, 
  setFilterStatus, 
  filterFulfillment, 
  setFilterFulfillment, 
  filterDate, 
  setFilterDate,
  showFilters,
  setShowFilters,
  deviceType,
  filterCategory,
  setFilterCategory,
  categories
}) => {
  const isMobile = deviceType === 'mobile';
  
  return (
    <>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
          <Search size={18} className="text-gray-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search cancelled orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
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
      </div>

      {/* Filter Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
            {(filterStatus !== 'all' || filterFulfillment !== 'all' || filterDate !== 'all' || filterCategory !== 'all') && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
          {showFilters ? (
            <ChevronLeft size={18} className="text-gray-600" />
          ) : (
            <ChevronRight size={18} className="text-gray-600" />
          )}
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-2 p-4 bg-gray-50 border border-gray-300 rounded-lg space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'Cancelled', 'Payment Failed', 'Returned to Seller', 'Refunded'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? status === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : {
                              'Cancelled': 'bg-red-100 text-red-700 border border-red-300',
                              'Payment Failed': 'bg-orange-100 text-orange-700 border border-orange-300',
                              'Returned to Seller': 'bg-blue-100 text-blue-700 border border-blue-300',
                              'Refunded': 'bg-green-100 text-green-700 border border-green-300'
                            }[status]
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : 
                     status === 'Returned to Seller' ? 'Returned' :
                     status}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Fulfillment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fulfillment Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'FBA', 'FBM'].map((fulfillment) => (
                  <button
                    key={fulfillment}
                    onClick={() => setFilterFulfillment(fulfillment)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterFulfillment === fulfillment
                        ? fulfillment === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : {
                              'FBA': 'bg-purple-100 text-purple-700 border border-purple-300',
                              'FBM': 'bg-orange-100 text-orange-700 border border-orange-300'
                            }[fulfillment]
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {fulfillment === 'all' ? 'All' : fulfillment}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'today', '7days', '30days', '90days'].map((date) => (
                  <button
                    key={date}
                    onClick={() => setFilterDate(date)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterDate === date
                        ? date === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {date === 'all' ? 'All Dates' : 
                     date === 'today' ? 'Today' : 
                     date === '7days' ? 'Last 7 Days' : 
                     date === '30days' ? 'Last 30 Days' : 
                     'Last 90 Days'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Desktop Filters Component
const DesktopFilters = ({ 
  search, 
  setSearch, 
  filterStatus, 
  setFilterStatus, 
  filterFulfillment, 
  setFilterFulfillment, 
  filterDate, 
  setFilterDate,
  deviceType,
  filterCategory,
  setFilterCategory,
  categories
}) => {
  const isTablet = deviceType === 'tablet';
  const isLaptop = deviceType === 'laptop';
  const isDesktop = deviceType === 'desktop';
  const isLargeDesktop = deviceType === 'large-desktop';
  
  // Responsive grid columns
  let filterGridCols;
  if (isLargeDesktop) filterGridCols = 'grid-cols-6';
  else if (isDesktop) filterGridCols = 'grid-cols-5';
  else if (isLaptop) filterGridCols = 'grid-cols-4';
  else if (isTablet) filterGridCols = 'grid-cols-3';
  else filterGridCols = 'grid-cols-2';

  return (
    <div className={`grid ${filterGridCols} gap-3 mb-6`}>
      {/* Search - Takes 2 columns on desktop+ */}
      <div className={isDesktop ? 'col-span-2' : ''}>
        <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
          <Search size={18} className="text-gray-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by order ID, product, buyer..."
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
      </div>

      {/* Status Filter */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
      >
        <option value="all">📊 All Status</option>
        <option value="Cancelled">🔴 Cancelled by Buyer</option>
        <option value="Payment Failed">🟠 Payment Failed</option>
        <option value="Returned to Seller">🔵 Returned to Seller</option>
        <option value="Refunded">🟢 Refund Completed</option>
        <option value="Out of Stock">🟣 Out of Stock</option>
      </select>

      {/* Category Filter - Hide on tablet */}
      {!isTablet && (
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
        >
          <option value="all">📦 All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}

      {/* Fulfillment Filter */}
      <select
        value={filterFulfillment}
        onChange={(e) => setFilterFulfillment(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
      >
        <option value="all">🚚 All Fulfillment</option>
        <option value="FBA">📦 Amazon FBA</option>
        <option value="FBM">🏪 Merchant FBM</option>
      </select>

      {/* Date Filter */}
      <select
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="border border-gray-300 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
      >
        <option value="all">📅 Any Date</option>
        <option value="today">Today</option>
        <option value="7days">Last 7 days</option>
        <option value="30days">Last 30 days</option>
        <option value="90days">Last 90 days</option>
        <option value="custom">Custom Range</option>
      </select>
    </div>
  );
};

// Enhanced Table Component with GST columns
const CancelledOrdersTable = ({ 
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
  const isDesktop = deviceType === 'desktop';
  
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

  const getReasonColor = (reason) => {
    const colors = {
      'Buyer Cancelled': 'text-red-600',
      'Payment Declined': 'text-orange-600',
      'Customer Return': 'text-blue-600',
      'Out of Stock': 'text-purple-600',
      'Shipping Issue': 'text-yellow-600'
    };
    return colors[reason] || 'text-gray-600';
  };

  const getGSTColor = (gstType) => {
    if (gstType === 'IGST') return 'bg-purple-100 text-purple-700';
    if (gstType === 'CGST+SGST') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
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
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'product', label: 'Product', sortable: false },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'status', label: 'Status', sortable: false },
        { key: 'actions', label: 'Actions', sortable: false }
      ];
    } else if (isLaptop) {
      return [
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'product', label: 'Product', sortable: false },
        { key: 'buyer', label: 'Buyer', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'status', label: 'Status', sortable: false },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
      ];
    } else if (isDesktop) {
      return [
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'buyer', label: 'Buyer', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'gstAmount', label: 'GST', sortable: true },
        { key: 'fulfillment', label: 'Fulfillment', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
      ];
    } else {
      // Large Desktop
      return [
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        { key: 'buyer', label: 'Buyer', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'gstAmount', label: 'GST', sortable: true },
        { key: 'gstType', label: 'GST Type', sortable: true },
        { key: 'lossAmount', label: 'Loss', sortable: true },
        { key: 'fulfillment', label: 'Fulfillment', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
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
                  {header.sortable ? (
                    <button
                      onClick={() => handleSort(header.key)}
                      className="flex items-center cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {header.label}
                      <SortIcon field={header.key} />
                    </button>
                  ) : (
                    header.label
                  )}
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
                  {isTablet && (
                    <div className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</div>
                  )}
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
                      {(isDesktop || isLaptop) && (
                        <div className="text-xs text-gray-500 mt-1">
                          {order.category}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category - Only on large desktop */}
                {(deviceType === 'large-desktop') && (
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {order.category}
                    </span>
                  </td>
                )}

                {/* Buyer - Hidden on tablet */}
                {(!isTablet) && (
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{order.buyer}</div>
                    {deviceType === 'large-desktop' && (
                      <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                    )}
                  </td>
                )}

                {/* Price */}
                <td className="p-3">
                  <div className="font-bold text-gray-900">{formatPrice(order.price)}</div>
                  {(isDesktop || deviceType === 'large-desktop') && order.lossAmount > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      Loss: {formatPrice(order.lossAmount)}
                    </div>
                  )}
                </td>

                {/* GST Amount - Hidden on tablet */}
                {(!isTablet) && (
                  <td className="p-3">
                    <div className="font-bold text-blue-600">{formatPrice(order.gstAmount)}</div>
                    {deviceType === 'large-desktop' && (
                      <div className="text-xs text-gray-500 mt-1">{order.gstType}</div>
                    )}
                  </td>
                )}

                {/* GST Type - Only on large desktop */}
                {(deviceType === 'large-desktop') && (
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGSTColor(order.gstType)}`}>
                      {order.gstType}
                    </span>
                  </td>
                )}

                {/* Loss Amount - Only on large desktop */}
                {deviceType === 'large-desktop' && (
                  <td className="p-3">
                    <div className="font-bold text-red-600">{formatPrice(order.lossAmount)}</div>
                  </td>
                )}

                {/* Fulfillment - Hidden on tablet and laptop */}
                {(!isTablet && !isLaptop) && (
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
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                    {isTablet ? order.status.split(' ')[0] : order.status}
                  </span>
                </td>

                {/* Date - Hidden on tablet */}
                {!isTablet && (
                  <td className="p-3">
                    <div className="text-sm text-gray-600">{formatDate(order.date)}</div>
                  </td>
                )}

                {/* Actions */}
                <td className="p-3">
                  <div className="flex flex-col gap-1 items-end">
                    <button
                      onClick={() => onAction?.('View Details', order)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      <Eye size={12} />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => onAction?.('Generate Invoice', order)}
                      className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium hover:underline"
                    >
                      <FileText size={12} />
                      <span>Invoice</span>
                    </button>
                    {(isDesktop || deviceType === 'large-desktop') && (
                      <button
                        onClick={() => onAction?.('Contact Buyer', order)}
                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium hover:underline"
                      >
                        <Mail size={12} />
                        <span>Contact</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CancelledOrders = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFulfillment, setFilterFulfillment] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  const responsive = useResponsive();
  const ordersPerPage = responsive.isMobile ? 5 : 
                       responsive.isTablet ? 8 : 
                       responsive.isLaptop ? 10 : 
                       responsive.isDesktop ? 12 : 15;

  // Categories for filtering
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty', 'Sports'];

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.fetchCancelledOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    "Cancelled": "bg-red-100 text-red-700 border border-red-200",
    "Payment Failed": "bg-orange-100 text-orange-700 border border-orange-200",
    "Returned to Seller": "bg-blue-100 text-blue-700 border border-blue-200",
    "Refunded": "bg-green-100 text-green-700 border border-green-200",
    "Out of Stock": "bg-purple-100 text-purple-700 border border-purple-200",
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      // Search filter
      const matchesSearch = 
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer.toLowerCase().includes(search.toLowerCase()) ||
        order.reason.toLowerCase().includes(search.toLowerCase()) ||
        (order.sku && order.sku.toLowerCase().includes(search.toLowerCase())) ||
        (order.asin && order.asin.toLowerCase().includes(search.toLowerCase()));
      
      // Status filter
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      
      // Category filter
      const matchesCategory = filterCategory === "all" || order.category === filterCategory;
      
      // Fulfillment filter
      const matchesFulfillment = filterFulfillment === "all" || order.fulfillment === filterFulfillment;
      
      // Date filter
      let matchesDate = true;
      if (filterDate !== "all") {
        const orderDate = new Date(order.date);
        const today = new Date();
        
        switch (filterDate) {
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
          case "90days":
            const ninetyDaysAgo = new Date(today);
            ninetyDaysAgo.setDate(today.getDate() - 90);
            matchesDate = orderDate >= ninetyDaysAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesCategory && matchesFulfillment && matchesDate;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle special cases
      if (sortField === 'price' || sortField === 'lossAmount' || sortField === 'orderValue' || sortField === 'gstAmount') {
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
  }, [orders, search, filterStatus, filterCategory, filterFulfillment, filterDate, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Calculate statistics including GST
  const stats = useMemo(() => ({
    total: filteredOrders.length,
    cancelled: filteredOrders.filter(o => o.status === "Cancelled").length,
    paymentFailed: filteredOrders.filter(o => o.status === "Payment Failed").length,
    returned: filteredOrders.filter(o => o.status === "Returned to Seller").length,
    fba: filteredOrders.filter(o => o.fulfillment === "FBA").length,
    fbm: filteredOrders.filter(o => o.fulfillment === "FBM").length,
    totalLoss: filteredOrders.reduce((sum, o) => sum + (o.lossAmount || 0), 0),
    totalGST: filteredOrders.reduce((sum, o) => sum + (o.gstAmount || 0), 0),
    totalTaxable: filteredOrders.reduce((sum, o) => sum + (o.taxableValue || o.price), 0),
    avgOrderValue: filteredOrders.length > 0 ? 
      filteredOrders.reduce((sum, o) => sum + o.price, 0) / filteredOrders.length : 0
  }), [filteredOrders]);

  // Handle order action
  const handleOrderAction = async (action, order) => {
    switch (action) {
      case "View Details":
        alert(`Viewing details for order: ${order.id}\nBuyer: ${order.buyer}\nProduct: ${order.product}\nGST Type: ${order.gstType}\nGST Amount: ₹${order.gstAmount}`);
        break;
      
      case "Generate Invoice":
        setIsLoading(true);
        try {
          const invoice = await ApiService.generateInvoice(order.id);
          setCurrentOrder(order);
          setCurrentInvoice(invoice);
          setShowInvoiceModal(true);
        } catch (error) {
          alert('Failed to generate invoice. Please try again.');
        } finally {
          setIsLoading(false);
        }
        break;
      
      case "Export Invoice":
        alert(`Exporting invoice for order: ${order.id}`);
        break;
      
      case "Contact Buyer":
        alert(`Contacting buyer: ${order.buyer}\nEmail: ${order.buyerEmail}\nPhone: ${order.buyerPhone}`);
        break;
      
      default:
        console.log(`Action: ${action} for order: ${order.id}`);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) {
      alert("Please select orders first");
      return;
    }
    
    setIsLoading(true);
    try {
      const orderIds = selectedOrders.map(o => o.id);
      
      switch (action) {
        case "Export Invoices":
          const result = await ApiService.exportOrders(orderIds, 'pdf');
          alert(`Export initiated for ${result.count} orders. Download will start soon.`);
          // In real app, trigger download
          // window.open(result.downloadUrl, '_blank');
          break;
        
        case "Analyze Reasons":
          const analytics = await ApiService.getCancellationAnalytics();
          alert(`Analysis complete:\nTotal Cancelled: ${analytics.totalCancelled}\nTop Reason: ${analytics.topReasons[0].reason} (${analytics.topReasons[0].percentage}%)`);
          break;
        
        default:
          alert(`Bulk ${action} for ${selectedOrders.length} orders`);
      }
    } catch (error) {
      alert('Failed to process bulk action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export orders
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const orderIds = filteredOrders.map(o => o.id);
      const result = await ApiService.exportOrders(orderIds, 'csv');
      alert(`Exporting ${result.count} cancelled orders. CSV download will start soon.`);
      // In real app, trigger download
      // window.open(result.downloadUrl, '_blank');
    } catch (error) {
      alert('Failed to export orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh orders
  const handleRefresh = () => {
    fetchOrders();
    setSearch("");
    setFilterStatus("all");
    setFilterCategory("all");
    setFilterFulfillment("all");
    setFilterDate("all");
    setSelectedOrders([]);
  };

  // Invoice modal handlers
  const handlePrintInvoice = () => {
    window.print();
  };

  const handleEmailInvoice = () => {
    alert(`Invoice sent to ${currentOrder.buyerEmail}`);
  };

  // Get container max width
  const getContainerMaxWidth = () => {
    if (responsive.isLargeDesktop) return 'max-w-screen-2xl';
    if (responsive.isDesktop) return 'max-w-7xl';
    if (responsive.isLaptop) return 'max-w-6xl';
    if (responsive.isTablet) return 'max-w-4xl';
    return 'max-w-full';
  };

  // Get header font size
  const getHeaderSize = () => {
    if (responsive.isMobile) return 'text-xl';
    if (responsive.isTablet) return 'text-2xl';
    return 'text-3xl';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`${responsive.isMobile ? 'p-3' : 'p-4 lg:p-6'} bg-white rounded-xl shadow-lg ${getContainerMaxWidth()} mx-auto`}>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && currentInvoice && currentOrder && (
        <InvoiceModal
          order={currentOrder}
          invoice={currentInvoice}
          onClose={() => setShowInvoiceModal(false)}
          onPrint={handlePrintInvoice}
          onEmail={handleEmailInvoice}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 ${responsive.isMobile ? 'p-1.5' : ''}`}>
            <XCircle className={`text-white ${responsive.isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${getHeaderSize()} text-gray-900`}>
              Cancelled Orders
            </h2>
            <p className={`text-gray-600 ${responsive.isMobile ? 'text-xs' : 'text-sm'}`}>
              {stats.total} cancelled orders • {formatCurrency(stats.totalLoss)} total loss
              {responsive.isDesktop && ` • Total GST: ${formatCurrency(stats.totalGST)}`}
              {responsive.isDesktop && ` • Last updated: ${new Date().toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        {/* Device Indicator & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {!responsive.isMobile && (
            <div className={`flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium ${responsive.isMobile ? 'hidden' : ''}`}>
              <DeviceIcon deviceType={responsive.deviceType} size={12} />
              <span className="text-gray-700">{responsive.deviceType.toUpperCase()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${responsive.isMobile ? 'p-1.5' : ''}`}
              title="Refresh"
              disabled={isLoading}
            >
              <RefreshCcw className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleExport}
              className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${responsive.isMobile ? 'p-1.5' : ''}`}
              title="Export"
              disabled={isLoading}
            >
              <Download className={`${responsive.isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} />
            </button>

            {responsive.isDesktop && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Bulk Actions
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel - Desktop */}
      {showBulkActions && !responsive.isMobile && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Select orders for bulk actions
              </span>
            </div>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => handleBulkAction("Export Invoices")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              📄 Export Invoices
            </button>
            <button
              onClick={() => handleBulkAction("Analyze Reasons")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              📊 Analyze Reasons
            </button>
            <button
              onClick={() => handleBulkAction("Contact Buyers")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              ✉️ Contact Buyers
            </button>
            <button
              onClick={() => handleBulkAction("Restock Items")}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              📦 Restock Items
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!responsive.isMobile && (
        <div className={`grid ${responsive.isTablet ? 'grid-cols-2' : responsive.isLaptop ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'} gap-3 mb-6`}>
          {[
            { 
              label: 'Total Cancelled', 
              value: stats.total, 
              color: 'bg-gray-50 text-gray-700 border-gray-200',
              icon: XCircle,
              trend: '▲ 15%'
            },
            { 
              label: 'Payment Failed', 
              value: stats.paymentFailed, 
              color: 'bg-orange-50 text-orange-700 border-orange-200',
              icon: AlertCircle,
              trend: '▲ 8%'
            },
            { 
              label: 'Total GST', 
              value: formatCurrency(stats.totalGST), 
              color: 'bg-blue-50 text-blue-700 border-blue-200',
              icon: DollarSign,
              trend: '▲ 12%'
            },
            { 
              label: 'Total Loss', 
              value: formatCurrency(stats.totalLoss), 
              color: 'bg-red-50 text-red-700 border-red-200',
              icon: DollarSign,
              trend: '▲ 22%'
            },
          ].map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</div>
                  <div className={`font-bold ${responsive.isTablet ? 'text-xl' : 'text-2xl'} mt-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.trend}</div>
                </div>
                <stat.icon className={`${responsive.isTablet ? 'w-8 h-8' : 'w-10 h-10'} opacity-20`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Bar - Mobile */}
      {responsive.isMobile && (
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
              { label: 'Failed', value: stats.paymentFailed, color: 'bg-orange-100 text-orange-700' },
              { label: 'GST', value: formatCurrency(stats.totalGST).replace('₹', '') + 'K', color: 'bg-blue-100 text-blue-700' },
              { label: 'Loss', value: formatCurrency(stats.totalLoss).replace('₹', '') + 'K', color: 'bg-red-100 text-red-700' },
            ].map((stat, index) => (
              <div key={index} className={`p-2 rounded-lg text-center ${stat.color}`}>
                <div className="font-bold text-lg">{stat.value}</div>
                <div className="text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {responsive.isMobile ? (
        <MobileFilters
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterFulfillment={filterFulfillment}
          setFilterFulfillment={setFilterFulfillment}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          deviceType={responsive.deviceType}
          categories={categories}
        />
      ) : (
        <DesktopFilters
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterFulfillment={filterFulfillment}
          setFilterFulfillment={setFilterFulfillment}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          deviceType={responsive.deviceType}
          categories={categories}
        />
      )}

      {/* Bulk Actions - Desktop */}
      {!responsive.isMobile && selectedOrders.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">
              {selectedOrders.length} orders selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("Export Invoices")}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export All
            </button>
            <button
              onClick={() => handleBulkAction("Analyze Reasons")}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Analyze
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Orders Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading cancelled orders...</p>
        </div>
      ) : responsive.isMobile ? (
        // Mobile: Card View
        <div className="mb-6">
          {paginatedOrders.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No cancelled orders found</p>
              <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedOrders.map((order) => (
                <CancelledOrderCard
                  key={order.id}
                  order={order}
                  statusColors={statusColors}
                  onAction={handleOrderAction}
                  deviceType={responsive.deviceType}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Tablet & Desktop: Table View
        <CancelledOrdersTable
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
          {!responsive.isMobile && (
            <span className="ml-2">• Total loss: {formatCurrency(stats.totalLoss)} • Total GST: {formatCurrency(stats.totalGST)}</span>
          )}
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
            
            {totalPages > 5 && (
              <span className="px-2 text-gray-500">...</span>
            )}
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

      {/* Analysis Section */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-red-900">Cancellation Analysis</h3>
          <BarChart3 size={18} className="text-red-600" />
        </div>
        <div className={`grid ${responsive.isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">FBA Cancellations</div>
            <div className="font-bold text-gray-900">{stats.fba}</div>
            <div className="text-xs text-gray-500">{stats.fba > 0 ? `${Math.round((stats.fba / stats.total) * 100)}%` : '0%'}</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">FBM Cancellations</div>
            <div className="font-bold text-gray-900">{stats.fbm}</div>
            <div className="text-xs text-gray-500">{stats.fbm > 0 ? `${Math.round((stats.fbm / stats.total) * 100)}%` : '0%'}</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">Avg. Order Value</div>
            <div className="font-bold text-gray-900">{formatCurrency(stats.avgOrderValue)}</div>
            <div className="text-xs text-gray-500">before cancellation</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="text-xs text-gray-500">Total GST Paid</div>
            <div className="font-bold text-blue-600">{formatCurrency(stats.totalGST)}</div>
            <div className="text-xs text-gray-500">on cancelled orders</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Cancelled</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>Payment Failed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>GST</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DeviceIcon deviceType={responsive.deviceType} size={12} />
            <span>{responsive.deviceType} • {responsive.windowSize.width}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrders;