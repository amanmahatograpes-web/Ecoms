const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayIntegration {
  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createOrder(orderData) {
    try {
      const options = {
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        receipt: orderData.receipt,
        notes: orderData.notes,
        payment_capture: 1 // Auto capture
      };

      const order = await this.instance.orders.create(options);
      
      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        notes: order.notes,
        createdAt: order.created_at,
        redirectUrl: `https://checkout.razorpay.com/v1/checkout.js?key=${process.env.RAZORPAY_KEY_ID}&order_id=${order.id}`
      };
    } catch (error) {
      console.error('Razorpay createOrder error:', error);
      throw error;
    }
  }

  async capturePayment(paymentData) {
    try {
      const payment = await this.instance.payments.capture(
        paymentData.paymentId,
        paymentData.amount,
        paymentData.currency
      );

      return {
        transactionId: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        cardId: payment.card_id,
        bank: payment.bank,
        wallet: payment.wallet
      };
    } catch (error) {
      console.error('Razorpay capturePayment error:', error);
      throw error;
    }
  }

  async createRefund(refundData) {
    try {
      const refund = await this.instance.payments.refund(
        refundData.paymentId,
        {
          amount: refundData.amount,
          notes: refundData.notes
        }
      );

      return {
        refundId: refund.id,
        amount: refund.amount / 100,
        paymentId: refund.payment_id,
        status: refund.status,
        notes: refund.notes
      };
    } catch (error) {
      console.error('Razorpay createRefund error:', error);
      throw error;
    }
  }

  verifyWebhookSignature(body, signature) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');
    
    return expectedSignature === signature;
  }

  async getPayment(paymentId) {
    try {
      return await this.instance.payments.fetch(paymentId);
    } catch (error) {
      console.error('Razorpay getPayment error:', error);
      throw error;
    }
  }

  async getOrder(orderId) {
    try {
      return await this.instance.orders.fetch(orderId);
    } catch (error) {
      console.error('Razorpay getOrder error:', error);
      throw error;
    }
  }
}

module.exports = new RazorpayIntegration();