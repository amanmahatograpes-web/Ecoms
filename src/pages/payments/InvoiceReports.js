// InvoiceReports.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './InvoiceReports.css';

// GST Calculator Class with optimized data structures
class GSTCalculator {
  constructor() {
    // GST Slabs for different product categories (in percentage)
    this.gstSlabs = {
      'books': 0,
      'essential_foods': 0,
      'processed_foods': 5,
      'apparel_under_1000': 5,
      'apparel_over_1000': 12,
      'electronics': 18,
      'luxury': 28,
      'services': 18,
      'default': 18
    };

    // HSN/SAC Codes mapping
    this.hsnCodes = {
      'electronics': '8543',
      'books': '4901',
      'apparel': '6205',
      'services': '9986',
      'food': '2106'
    };
  }

  // Calculate GST based on product type and location
  calculateGST(subtotal, productType = 'default', isInterState = false, isSEZ = false) {
    const gstRate = this.gstSlabs[productType] || this.gstSlabs.default;
    
    if (isSEZ) return { cgst: 0, sgst: 0, igst: 0, total: subtotal };
    
    if (isInterState) {
      const igst = (subtotal * gstRate) / 100;
      return {
        cgst: 0,
        sgst: 0,
        igst: parseFloat(igst.toFixed(2)),
        total: subtotal + igst
      };
    } else {
      const cgst = (subtotal * gstRate) / 200; // Half of GST rate for CGST
      const sgst = (subtotal * gstRate) / 200; // Half of GST rate for SGST
      return {
        cgst: parseFloat(cgst.toFixed(2)),
        sgst: parseFloat(sgst.toFixed(2)),
        igst: 0,
        total: subtotal + cgst + sgst
      };
    }
  }

  // Get HSN/SAC code for product
  getHSNCode(productType) {
    return this.hsnCodes[productType] || '9999';
  }

  // Generate GST invoice format
  generateGSTInvoiceFormat(invoiceData) {
    const {
      id,
      date,
      customer,
      address,
      items,
      gstDetails
    } = invoiceData;

    return {
      invoiceNumber: id,
      date: new Date(date),
      customerGSTIN: customer.gstin || 'N/A',
      supplierGSTIN: '27AAECS1205F1Z9', // Example GSTIN
      placeOfSupply: address?.state || 'Maharashtra',
      hsnSummary: this.generateHSNSummary(items),
      gstBreakup: gstDetails,
      totalTaxableValue: items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      ...gstDetails
    };
  }

  // Generate HSN summary for invoice
  generateHSNSummary(items) {
    const summaryMap = new Map();
    
    items.forEach(item => {
      const hsnCode = this.getHSNCode(item.productType);
      const key = `${hsnCode}_${item.gstRate || this.gstSlabs[item.productType] || 18}`;
      
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          hsnCode,
          description: item.description,
          gstRate: item.gstRate || this.gstSlabs[item.productType] || 18,
          quantity: 0,
          taxableValue: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 0
        });
      }
      
      const summary = summaryMap.get(key);
      summary.quantity += item.quantity;
      summary.taxableValue += item.quantity * item.unitPrice;
    });

    return Array.from(summaryMap.values());
  }
}

// Invoice Data Structure using optimized classes
class InvoiceItem {
  constructor(description, quantity, unitPrice, productType = 'default') {
    this.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.description = description;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.productType = productType;
    this.total = quantity * unitPrice;
  }

  updateQuantity(newQuantity) {
    this.quantity = newQuantity;
    this.total = newQuantity * this.unitPrice;
    return this;
  }

  updatePrice(newPrice) {
    this.unitPrice = newPrice;
    this.total = this.quantity * newPrice;
    return this;
  }
}

class Invoice {
  constructor(customer, isInterState = false, isSEZ = false) {
    this.id = `INV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    this.date = new Date().toISOString().split('T')[0];
    this.customer = customer;
    this.items = [];
    this.isInterState = isInterState;
    this.isSEZ = isSEZ;
    this.gstCalculator = new GSTCalculator();
    this.calculateTotals();
  }

  addItem(item) {
    this.items.push(item);
    this.calculateTotals();
    return this;
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.calculateTotals();
    return this;
  }

  calculateTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.subtotal = subtotal;
    
    // Calculate GST for entire invoice
    const gstDetails = this.gstCalculator.calculateGST(
      subtotal,
      'default',
      this.isInterState,
      this.isSEZ
    );
    
    this.tax = this.isInterState ? gstDetails.igst : (gstDetails.cgst + gstDetails.sgst);
    this.cgst = gstDetails.cgst;
    this.sgst = gstDetails.sgst;
    this.igst = gstDetails.igst;
    this.total = gstDetails.total;
    this.gstBreakdown = gstDetails;
    
    return this;
  }

  generateGSTInvoice() {
    return this.gstCalculator.generateGSTInvoiceFormat({
      id: this.id,
      date: this.date,
      customer: this.customer,
      items: this.items,
      gstDetails: this.gstBreakdown
    });
  }
}

// API Service Class for Invoice Management
class InvoiceAPIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.yourdomain.com';
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.gstCalculator = new GSTCalculator();
  }

  // Get all invoices with GST calculation
  async getInvoices(params = {}) {
    try {
      const response = await this.apiClient.get('/api/v1/invoices', { params });
      
      // Add GST calculations to each invoice
      const invoicesWithGST = response.data.invoices.map(invoice => {
        const gstDetails = this.gstCalculator.calculateGST(
          invoice.subtotal,
          invoice.productType,
          invoice.isInterState,
          invoice.isSEZ
        );
        
        return {
          ...invoice,
          ...gstDetails,
          gstInvoice: this.gstCalculator.generateGSTInvoiceFormat(invoice)
        };
      });

      return {
        ...response.data,
        invoices: invoicesWithGST
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Create invoice with GST support
  async createInvoice(invoiceData) {
    try {
      const gstDetails = this.gstCalculator.calculateGST(
        invoiceData.subtotal,
        invoiceData.productType,
        invoiceData.isInterState,
        invoiceData.isSEZ
      );

      const invoiceWithGST = {
        ...invoiceData,
        ...gstDetails,
        hsnSummary: this.gstCalculator.generateHSNSummary(invoiceData.items)
      };

      const response = await this.apiClient.post('/api/v1/invoices', invoiceWithGST);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generate GST report
  async generateGSTReport(filters = {}) {
    try {
      const response = await this.apiClient.get('/api/v1/invoices/gst-report', {
        params: filters
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Export GST invoice
  async exportGSTInvoice(invoiceId, format = 'pdf') {
    try {
      const response = await this.apiClient.post(
        `/api/v1/invoices/${invoiceId}/export-gst`,
        { format },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

// Main Component
const InvoiceReports = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    amountRange: 'all',
    gstType: 'all',
    sortBy: 'newest'
  });
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    totalAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    thisMonth: 0,
    totalGST: 0,
    totalIGST: 0
  });

  const invoiceRef = useRef();
  const apiService = useMemo(() => new InvoiceAPIService(), []);
  const gstCalculator = useMemo(() => new GSTCalculator(), []);

  // Mock data with GST support
  const mockInvoices = useMemo(() => [
    {
      id: 'INV-2024-001',
      date: '2024-12-11',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, New York, NY 10001',
        gstin: '27AAECS1205F1Z1'
      },
      subtotal: 199.99,
      items: [
        { 
          description: 'Apple AirPods Pro', 
          quantity: 1, 
          unitPrice: 199.99,
          productType: 'electronics',
          hsnCode: '8543'
        }
      ],
      status: 'paid',
      isInterState: true,
      isSEZ: false,
      ...gstCalculator.calculateGST(199.99, 'electronics', true, false)
    },
    {
      id: 'INV-2024-002',
      date: '2024-12-10',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        address: '456 Park Ave, Mumbai, MH 400001',
        gstin: '27AAECS1205F1Z2'
      },
      subtotal: 51.98,
      items: [
        { 
          description: 'Anker PowerCore Charger', 
          quantity: 2, 
          unitPrice: 25.99,
          productType: 'electronics',
          hsnCode: '8543'
        }
      ],
      status: 'pending',
      isInterState: false,
      isSEZ: false,
      ...gstCalculator.calculateGST(51.98, 'electronics', false, false)
    },
    {
      id: 'INV-2024-003',
      date: '2024-12-09',
      customer: {
        name: 'Amazon Business',
        email: 'business@amazon.com',
        address: '410 Terry Ave N, Seattle, WA 98109',
        gstin: '27AAECS1205F1Z3'
      },
      subtotal: 2999.99,
      items: [
        { 
          description: 'AWS Enterprise Support', 
          quantity: 1, 
          unitPrice: 2999.99,
          productType: 'services',
          hsnCode: '9986'
        }
      ],
      status: 'paid',
      isInterState: true,
      isSEZ: false,
      ...gstCalculator.calculateGST(2999.99, 'services', true, false)
    }
  ], [gstCalculator]);

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getInvoices({
        page: 1,
        limit: 50,
        ...filters
      });
      
      if (response.success) {
        setInvoices(response.data);
        setFilteredInvoices(response.data);
        calculateStats(response.data);
      }
      
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Fallback to mock data
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
      calculateStats(mockInvoices);
    } finally {
      setLoading(false);
    }
  }, [apiService, filters, mockInvoices]);

  // Calculate statistics from data
  const calculateStats = useCallback((data) => {
    const totalAmount = data.reduce((sum, inv) => sum + inv.total, 0);
    const paidInvoices = data.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = data.filter(inv => inv.status === 'pending').length;
    const totalGST = data.reduce((sum, inv) => sum + (inv.cgst || 0) + (inv.sgst || 0), 0);
    const totalIGST = data.reduce((sum, inv) => sum + (inv.igst || 0), 0);
    
    const thisMonth = data.filter(inv => {
      const invoiceDate = new Date(inv.date);
      const now = new Date();
      return invoiceDate.getMonth() === now.getMonth() && 
             invoiceDate.getFullYear() === now.getFullYear();
    }).length;

    setStats({
      totalAmount,
      paidInvoices,
      pendingInvoices,
      thisMonth,
      totalGST,
      totalIGST
    });
  }, []);

  // Search and filter invoices using optimized data structures
  const filterInvoices = useCallback(() => {
    let result = [...invoices];

    // Create an index for faster searching
    const searchIndex = new Map();
    invoices.forEach((invoice, index) => {
      const searchKey = `${invoice.id}${invoice.customer.name}${invoice.customer.email}`.toLowerCase();
      searchIndex.set(searchKey, index);
    });

    // Search filter using index
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(invoice => {
        const searchKey = `${invoice.id}${invoice.customer.name}${invoice.customer.email}`.toLowerCase();
        return searchKey.includes(term);
      });
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(invoice => invoice.status === filters.status);
    }

    // GST Type filter
    if (filters.gstType !== 'all') {
      result = result.filter(invoice => {
        if (filters.gstType === 'igst') return invoice.isInterState && invoice.igst > 0;
        if (filters.gstType === 'cgst_sgst') return !invoice.isInterState && (invoice.cgst > 0 || invoice.sgst > 0);
        return true;
      });
    }

    // Date range filter using binary search optimization
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch(filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Sort by date for binary search
      const sortedByDate = [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
      const startTimestamp = startDate.getTime();
      
      // Binary search to find start index
      let low = 0;
      let high = sortedByDate.length - 1;
      let startIndex = 0;
      
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const invoiceDate = new Date(sortedByDate[mid].date).getTime();
        
        if (invoiceDate >= startTimestamp) {
          startIndex = mid;
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
      
      result = sortedByDate.slice(startIndex);
    }

    // Amount range filter
    if (filters.amountRange !== 'all') {
      const ranges = {
        '0-100': [0, 100],
        '100-500': [100, 500],
        '500-1000': [500, 1000],
        '1000+': [1000, Infinity]
      };
      const [min, max] = ranges[filters.amountRange];
      result = result.filter(invoice => invoice.total >= min && invoice.total <= max);
    }

    // Sorting
    result.sort((a, b) => {
      switch(filters.sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'amount_high':
          return b.total - a.total;
        case 'amount_low':
          return a.total - b.total;
        case 'gst_high':
          return (b.igst || (b.cgst + b.sgst)) - (a.igst || (a.cgst + a.sgst));
        default:
          return 0;
      }
    });

    setFilteredInvoices(result);
  }, [searchTerm, filters, invoices]);

  // Generate new invoice with GST
  const generateInvoice = useCallback(async (isInterState = false, isSEZ = false) => {
    try {
      const newInvoice = new Invoice(
        {
          name: 'New Customer',
          email: 'new@example.com',
          gstin: 'N/A'
        },
        isInterState,
        isSEZ
      );
      
      setInvoices(prev => [newInvoice, ...prev]);
      setSelectedInvoice(newInvoice);
      
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  }, []);

  // Export to PDF with GST invoice format
  const exportToPDF = useCallback(async (invoice) => {
    setExporting(true);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add Amazon logo and header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Amazon Business', 20, 20);
      
      // GST Invoice title
      doc.setFontSize(16);
      doc.setTextColor(255, 153, 0); // Amazon orange
      doc.text('TAX INVOICE', pageWidth - 20, 20, { align: 'right' });
      
      // Supplier GST details
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Supplier GSTIN: 27AAECS1205F1Z9', pageWidth - 20, 28, { align: 'right' });
      doc.text('State: Maharashtra, Code: 27', pageWidth - 20, 33, { align: 'right' });
      
      // Invoice details
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoice.id}`, pageWidth - 20, 40, { align: 'right' });
      doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, pageWidth - 20, 45, { align: 'right' });
      
      // Customer GST details
      doc.setFontSize(12);
      doc.text('Bill To:', 20, 60);
      doc.setFontSize(10);
      doc.text(invoice.customer.name, 20, 68);
      doc.text(`GSTIN: ${invoice.customer.gstin || 'N/A'}`, 20, 73);
      doc.text(invoice.customer.email, 20, 78);
      
      // Place of Supply
      doc.text(`Place of Supply: ${invoice.isInterState ? invoice.customer.address?.split(',')?.[1]?.trim() || 'Outside State' : 'Within State'}`, 20, 85);
      
      // HSN Summary Table
      const hsnSummary = gstCalculator.generateHSNSummary(invoice.items);
      
      doc.autoTable({
        startY: 100,
        head: [['HSN/SAC', 'Description', 'Qty', 'Unit Price', 'Taxable Value', 'GST Rate', 'IGST', 'CGST', 'SGST', 'Total']],
        body: hsnSummary.map(item => [
          item.hsnCode,
          item.description.substring(0, 20) + (item.description.length > 20 ? '...' : ''),
          item.quantity,
          `$${item.taxableValue / item.quantity}`,
          `$${item.taxableValue.toFixed(2)}`,
          `${item.gstRate}%`,
          invoice.isInterState ? `$${item.igst.toFixed(2)}` : '-',
          !invoice.isInterState ? `$${item.cgst.toFixed(2)}` : '-',
          !invoice.isInterState ? `$${item.sgst.toFixed(2)}` : '-',
          `$${(item.taxableValue + item.igst + item.cgst + item.sgst).toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: { 
          fillColor: [255, 153, 0],
          textColor: [255, 255, 255],
          fontSize: 8
        },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 10 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
          8: { cellWidth: 15 },
          9: { cellWidth: 20 }
        }
      });
      
      const finalY = doc.lastAutoTable.finalY || 150;
      
      // Totals section
      doc.setFontSize(10);
      doc.text('Subtotal:', pageWidth - 70, finalY + 10);
      doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - 20, finalY + 10, { align: 'right' });
      
      if (invoice.isInterState) {
        doc.text('IGST:', pageWidth - 70, finalY + 16);
        doc.text(`$${invoice.igst.toFixed(2)}`, pageWidth - 20, finalY + 16, { align: 'right' });
      } else {
        doc.text('CGST:', pageWidth - 70, finalY + 16);
        doc.text(`$${invoice.cgst.toFixed(2)}`, pageWidth - 20, finalY + 16, { align: 'right' });
        
        doc.text('SGST:', pageWidth - 70, finalY + 22);
        doc.text(`$${invoice.sgst.toFixed(2)}`, pageWidth - 20, finalY + 22, { align: 'right' });
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Total:', pageWidth - 70, finalY + 30);
      doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - 20, finalY + 30, { align: 'right' });
      
      // Tax summary
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text('Tax Summary:', 20, finalY + 45);
      doc.text(`Total Taxable Value: $${invoice.subtotal.toFixed(2)}`, 20, finalY + 52);
      
      if (invoice.isInterState) {
        doc.text(`Total IGST: $${invoice.igst.toFixed(2)}`, 20, finalY + 58);
      } else {
        doc.text(`Total CGST: $${invoice.cgst.toFixed(2)}`, 20, finalY + 58);
        doc.text(`Total SGST: $${invoice.sgst.toFixed(2)}`, 20, finalY + 64);
      }
      
      // Terms and conditions
      doc.text('Declaration: We declare that this invoice shows the actual price of the goods', 20, finalY + 75);
      doc.text('and that all particulars are true and correct.', 20, finalY + 80);
      
      // For GSTIN verification
      doc.text('GSTIN Verification QR Code', pageWidth - 20, finalY + 75, { align: 'right' });
      doc.text('(Scan for verification)', pageWidth - 20, finalY + 80, { align: 'right' });
      
      // Save PDF
      doc.save(`gst-invoice-${invoice.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExporting(false);
    }
  }, [gstCalculator]);

  // Print invoice with print-optimized styling
  const printInvoice = useCallback(() => {
    if (!selectedInvoice) return;
    
    const printContent = document.createElement('div');
    printContent.className = 'print-invoice';
    
    // Create print-optimized HTML
    printContent.innerHTML = `
      <style>
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-invoice {
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            font-family: Arial, sans-serif;
            color: #000;
            background: #fff;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .company-info h1 {
            color: #000;
            margin: 0 0 5px 0;
            font-size: 24px;
          }
          .gst-details {
            background: #f8f8f8;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
          }
          .gst-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 5px;
            font-size: 12px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .items-table th {
            background: #f2f2f2;
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 12px;
          }
          .items-table td {
            border: 1px solid #000;
            padding: 8px;
            font-size: 11px;
          }
          .totals-section {
            margin-top: 20px;
            border-top: 2px solid #000;
            padding-top: 10px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .grand-total {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px solid #000;
            padding-top: 10px;
          }
          .print-footer {
            margin-top: 30px;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
        }
      </style>
      
      <div class="invoice-header">
        <div class="company-info">
          <h1>Amazon Business</h1>
          <p>Supplier GSTIN: 27AAECS1205F1Z9</p>
          <p>State: Maharashtra, Code: 27</p>
        </div>
        <div class="invoice-meta">
          <h2>TAX INVOICE</h2>
          <p><strong>Invoice #:</strong> ${selectedInvoice.id}</p>
          <p><strong>Date:</strong> ${new Date(selectedInvoice.date).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div class="gst-details">
        <div class="gst-grid">
          <div>
            <strong>Bill To:</strong><br>
            ${selectedInvoice.customer.name}<br>
            ${selectedInvoice.customer.gstin ? `GSTIN: ${selectedInvoice.customer.gstin}<br>` : ''}
            ${selectedInvoice.customer.email}
          </div>
          <div>
            <strong>Place of Supply:</strong><br>
            ${selectedInvoice.isInterState ? 'Inter-State' : 'Intra-State'}<br>
            ${selectedInvoice.customer.address || ''}
          </div>
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>HSN/SAC</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Taxable Value</th>
            <th>GST Rate</th>
            ${selectedInvoice.isInterState ? '<th>IGST</th>' : '<th>CGST</th><th>SGST</th>'}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${selectedInvoice.items.map(item => {
            const gst = gstCalculator.calculateGST(
              item.unitPrice * item.quantity,
              item.productType,
              selectedInvoice.isInterState,
              selectedInvoice.isSEZ
            );
            return `
              <tr>
                <td>${gstCalculator.getHSNCode(item.productType)}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${(item.unitPrice * item.quantity).toFixed(2)}</td>
                <td>${gstCalculator.gstSlabs[item.productType] || 18}%</td>
                ${selectedInvoice.isInterState ? 
                  `<td>$${gst.igst.toFixed(2)}</td>` : 
                  `<td>$${gst.cgst.toFixed(2)}</td><td>$${gst.sgst.toFixed(2)}</td>`
                }
                <td>$${((item.unitPrice * item.quantity) + 
                  (selectedInvoice.isInterState ? gst.igst : gst.cgst + gst.sgst)).toFixed(2)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      
      <div class="totals-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${selectedInvoice.subtotal.toFixed(2)}</span>
        </div>
        ${selectedInvoice.isInterState ? `
          <div class="total-row">
            <span>IGST:</span>
            <span>$${selectedInvoice.igst.toFixed(2)}</span>
          </div>
        ` : `
          <div class="total-row">
            <span>CGST:</span>
            <span>$${selectedInvoice.cgst.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>SGST:</span>
            <span>$${selectedInvoice.sgst.toFixed(2)}</span>
          </div>
        `}
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>$${selectedInvoice.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="print-footer">
        <p><strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods and that all particulars are true and correct.</p>
        <p>For GSTIN Verification: Scan QR Code</p>
      </div>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>GST Invoice ${selectedInvoice.id}</title>
          <style>
            body { margin: 0; padding: 0; }
            @page { margin: 0; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [selectedInvoice, gstCalculator]);

  // Initialize
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, filters, invoices, filterInvoices]);

  return (
    <div className="amazon-invoice-container">
      {/* Amazon Header */}
      <header className="amazon-header no-print">
        <div className="amazon-logo">
          <a href="/">
            <span className="amazon-logo-text">Amazon</span>
            <span className="amazon-logo-suffix">Business</span>
          </a>
        </div>
        <div className="header-actions">
          <button className="amazon-button primary" onClick={() => generateInvoice(false, false)}>
            + Create Invoice
          </button>
          <button className="amazon-button secondary" onClick={() => generateInvoice(true, false)}>
            + IGST Invoice
          </button>
        </div>
      </header>

      <div className="invoice-main-content">
        {/* Statistics Cards with GST */}
        <div className="stats-grid no-print">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalAmount.toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalGST.toFixed(2)}</div>
              <div className="stat-label">Total GST</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌐</div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalIGST.toFixed(2)}</div>
              <div className="stat-label">Total IGST</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.thisMonth}</div>
              <div className="stat-label">This Month</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section no-print">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search invoices by ID, customer, or GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="amazon-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-controls">
            <select 
              className="amazon-select"
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>

            <select 
              className="amazon-select"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <select 
              className="amazon-select"
              value={filters.gstType}
              onChange={(e) => setFilters({...filters, gstType: e.target.value})}
            >
              <option value="all">All Tax Types</option>
              <option value="igst">IGST Only</option>
              <option value="cgst_sgst">CGST+SGST Only</option>
            </select>

            <select 
              className="amazon-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Amount: High to Low</option>
              <option value="gst_high">GST: High to Low</option>
            </select>
          </div>

          <div className="export-controls">
            <button 
              className="amazon-button secondary"
              onClick={() => {
                const csvHeaders = ['Invoice ID', 'Date', 'Customer', 'GSTIN', 'Subtotal', 'CGST', 'SGST', 'IGST', 'Total', 'Status'];
                const csvData = filteredInvoices.map(inv => [
                  inv.id,
                  inv.date,
                  inv.customer.name,
                  inv.customer.gstin,
                  inv.subtotal,
                  inv.cgst || 0,
                  inv.sgst || 0,
                  inv.igst || 0,
                  inv.total,
                  inv.status
                ]);
                const csvContent = [csvHeaders.join(','), ...csvData.map(row => row.join(','))].join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                saveAs(blob, `gst-invoices-${new Date().toISOString().split('T')[0]}.csv`);
              }}
              disabled={filteredInvoices.length === 0}
            >
              Export GST CSV
            </button>
            <button 
              className="amazon-button secondary"
              onClick={() => exportToPDF(selectedInvoice || filteredInvoices[0])}
              disabled={(!selectedInvoice && filteredInvoices.length === 0) || exporting}
            >
              {exporting ? 'Exporting...' : 'Export GST PDF'}
            </button>
            <button 
              className="amazon-button primary"
              onClick={printInvoice}
              disabled={!selectedInvoice}
            >
              Print Invoice
            </button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="invoices-list-section">
          <div className="section-header">
            <h2>Recent Invoices</h2>
            <span className="invoice-count">{filteredInvoices.length} invoices</span>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading invoices...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No invoices found</h3>
              <p>Try adjusting your filters or create a new invoice</p>
              <button className="amazon-button primary" onClick={() => generateInvoice(false, false)}>
                Create Your First Invoice
              </button>
            </div>
          ) : (
            <div className="invoices-table-container">
              <table className="invoices-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>GSTIN</th>
                    <th>Amount</th>
                    <th>GST Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(invoice => (
                    <tr 
                      key={invoice.id}
                      className={selectedInvoice?.id === invoice.id ? 'selected' : ''}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <td className="invoice-id">
                        <strong>{invoice.id}</strong>
                      </td>
                      <td>{new Date(invoice.date).toLocaleDateString()}</td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{invoice.customer.name}</div>
                          <div className="customer-email">{invoice.customer.email}</div>
                        </div>
                      </td>
                      <td>
                        <span className="gstin-badge">{invoice.customer.gstin || 'N/A'}</span>
                      </td>
                      <td className="invoice-amount">
                        <strong>${invoice.total.toFixed(2)}</strong>
                        <div className="tax-breakdown">
                          <small>Tax: ${(invoice.igst || invoice.cgst + invoice.sgst).toFixed(2)}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`gst-type-badge ${invoice.isInterState ? 'igst' : 'cgst-sgst'}`}>
                          {invoice.isInterState ? 'IGST' : 'CGST+SGST'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${invoice.status}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(invoice);
                            }}
                          >
                            View
                          </button>
                          <button 
                            className="action-btn download"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportToPDF(invoice);
                            }}
                          >
                            GST PDF
                          </button>
                          <button 
                            className="action-btn print"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(invoice);
                              setTimeout(printInvoice, 100);
                            }}
                          >
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invoice Detail View with GST */}
        {selectedInvoice && (
          <div className="invoice-detail-section" ref={invoiceRef}>
            <div className="detail-header no-print">
              <h2>GST Invoice Details</h2>
              <div className="header-actions">
                <button 
                  className="amazon-button secondary"
                  onClick={() => {
                    const emailBody = encodeURIComponent(
                      `Dear ${selectedInvoice.customer.name},\n\n` +
                      `Please find attached your GST invoice ${selectedInvoice.id}.\n\n` +
                      `Total Amount: $${selectedInvoice.total.toFixed(2)}\n` +
                      `GST Details: ${selectedInvoice.isInterState ? 
                        `IGST: $${selectedInvoice.igst.toFixed(2)}` : 
                        `CGST: $${selectedInvoice.cgst.toFixed(2)}, SGST: $${selectedInvoice.sgst.toFixed(2)}`
                      }\n\n` +
                      `Thank you for your business!\n` +
                      `Amazon Business`
                    );
                    window.location.href = `mailto:${selectedInvoice.customer.email}?subject=GST Invoice ${selectedInvoice.id}&body=${emailBody}`;
                  }}
                >
                  Send Email
                </button>
                <button 
                  className="amazon-button secondary"
                  onClick={() => exportToPDF(selectedInvoice)}
                  disabled={exporting}
                >
                  {exporting ? 'Generating...' : 'Download GST PDF'}
                </button>
                <button 
                  className="amazon-button secondary no-print"
                  onClick={printInvoice}
                >
                  Print
                </button>
              </div>
            </div>

            <div className="invoice-detail-card">
              <div className="invoice-header">
                <div className="company-info">
                  <h1>Amazon Business</h1>
                  <p><strong>Supplier GSTIN:</strong> 27AAECS1205F1Z9</p>
                  <p><strong>Address:</strong> 410 Terry Ave N, Seattle, WA 98109</p>
                  <p><strong>State:</strong> Maharashtra, Code: 27</p>
                  <p><strong>Email:</strong> business@amazon.com</p>
                </div>
                <div className="invoice-meta">
                  <h2>TAX INVOICE</h2>
                  <div className="meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">Invoice #:</span>
                      <span className="meta-value">{selectedInvoice.id}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">
                        {new Date(selectedInvoice.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">GST Type:</span>
                      <span className={`gst-type-badge ${selectedInvoice.isInterState ? 'igst' : 'cgst-sgst'}`}>
                        {selectedInvoice.isInterState ? 'IGST' : 'CGST+SGST'}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Status:</span>
                      <span className={`status-badge ${selectedInvoice.status}`}>
                        {selectedInvoice.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="invoice-body">
                <div className="gst-billing-info">
                  <div className="bill-to">
                    <h3>Bill To:</h3>
                    <p><strong>{selectedInvoice.customer.name}</strong></p>
                    <p><strong>GSTIN:</strong> {selectedInvoice.customer.gstin || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedInvoice.customer.email}</p>
                    {selectedInvoice.customer.address && <p>{selectedInvoice.customer.address}</p>}
                  </div>
                  <div className="supply-info">
                    <h3>Supply Details:</h3>
                    <p><strong>Place of Supply:</strong> {selectedInvoice.isInterState ? 'Inter-State' : 'Intra-State'}</p>
                    <p><strong>Supply Type:</strong> {selectedInvoice.isInterState ? 'Goods' : 'Services'}</p>
                    <p><strong>Reverse Charge:</strong> No</p>
                  </div>
                </div>

                <div className="items-table gst-table">
                  <table>
                    <thead>
                      <tr>
                        <th>HSN/SAC</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Taxable Value</th>
                        <th>GST Rate</th>
                        {selectedInvoice.isInterState ? (
                          <th>IGST Amount</th>
                        ) : (
                          <>
                            <th>CGST Amount</th>
                            <th>SGST Amount</th>
                          </>
                        )}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => {
                        const gst = gstCalculator.calculateGST(
                          item.quantity * item.unitPrice,
                          item.productType,
                          selectedInvoice.isInterState,
                          selectedInvoice.isSEZ
                        );
                        return (
                          <tr key={index}>
                            <td>{gstCalculator.getHSNCode(item.productType)}</td>
                            <td>{item.description}</td>
                            <td>{item.quantity}</td>
                            <td>${item.unitPrice.toFixed(2)}</td>
                            <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                            <td>{gstCalculator.gstSlabs[item.productType] || 18}%</td>
                            {selectedInvoice.isInterState ? (
                              <td>${gst.igst.toFixed(2)}</td>
                            ) : (
                              <>
                                <td>${gst.cgst.toFixed(2)}</td>
                                <td>${gst.sgst.toFixed(2)}</td>
                              </>
                            )}
                            <td>${((item.quantity * item.unitPrice) + 
                              (selectedInvoice.isInterState ? gst.igst : gst.cgst + gst.sgst)).toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="gst-totals-section">
                  <div className="totals-grid">
                    <div className="total-row">
                      <span>Total Taxable Value:</span>
                      <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedInvoice.isInterState ? (
                      <>
                        <div className="total-row">
                          <span>Total IGST (18%):</span>
                          <span>${selectedInvoice.igst.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="total-row">
                          <span>Total CGST (9%):</span>
                          <span>${selectedInvoice.cgst.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                          <span>Total SGST (9%):</span>
                          <span>${selectedInvoice.sgst.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="total-row grand-total">
                      <span>Invoice Total:</span>
                      <span>${selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="gst-declaration">
                  <div className="declaration">
                    <h4>Declaration:</h4>
                    <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                  </div>
                  <div className="authorized-sign">
                    <h4>Authorized Signatory:</h4>
                    <div className="signature-placeholder">
                      <p>_________________________</p>
                      <p>For Amazon Business</p>
                    </div>
                  </div>
                </div>

                <div className="payment-qr-gst">
                  <div className="qr-placeholder">
                    <div className="qr-code">[GST QR Code]</div>
                    <small>Scan for GST verification</small>
                  </div>
                  <div className="payment-instructions">
                    <h4>Payment & GST Details:</h4>
                    <p>• Bank Transfer: Account #1234567890, IFSC: SBIN0001234</p>
                    <p>• GST Payment: Use above GSTIN for tax credits</p>
                    <p>• Tax Invoice for Input Tax Credit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GST API Documentation */}
      <div className="api-docs-section no-print">
        <h3>GST API Integration Guide</h3>
        <div className="api-endpoints">
          <div className="api-endpoint">
            <span className="method post">POST</span>
            <code>/api/v1/invoices/calculate-gst</code>
            <span>Calculate GST for invoice</span>
          </div>
          <div className="api-endpoint">
            <span className="method get">GET</span>
            <code>/api/v1/invoices/gst-report</code>
            <span>Generate GST report</span>
          </div>
          <div className="api-endpoint">
            <span className="method get">GET</span>
            <code>/api/v1/invoices/:id/gst-details</code>
            <span>Get GST invoice details</span>
          </div>
          <div className="api-endpoint">
            <span className="method post">POST</span>
            <code>/api/v1/invoices/:id/export-gst</code>
            <span>Export GST invoice</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReports;
export { InvoiceAPIService, GSTCalculator, Invoice, InvoiceItem };