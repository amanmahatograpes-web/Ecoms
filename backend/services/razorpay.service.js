const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class RazorpayService {
    // Create order
    async createOrder(options) {
        try {
            const order = await razorpay.orders.create({
                amount: options.amount,
                currency: options.currency || 'INR',
                receipt: options.receipt,
                notes: options.notes,
                payment_capture: 1 // Auto capture payment
            });

            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID
            };
        } catch (error) {
            console.error('Razorpay create order error:', error);
            throw new Error(`Failed to create Razorpay order: ${error.message}`);
        }
    }

    // Verify payment signature
    verifySignature(orderId, paymentId, signature) {
        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        
        return expectedSignature === signature;
    }

    // Fetch payment details
    async getPaymentDetails(paymentId) {
        try {
            const payment = await razorpay.payments.fetch(paymentId);
            return payment;
        } catch (error) {
            console.error('Razorpay fetch payment error:', error);
            throw new Error(`Failed to fetch payment: ${error.message}`);
        }
    }

    // Create refund
    async createRefund(options) {
        try {
            const refund = await razorpay.payments.refund(options.paymentId, {
                amount: options.amount
            });
            return refund;
        } catch (error) {
            console.error('Razorpay refund error:', error);
            throw new Error(`Failed to create refund: ${error.message}`);
        }
    }

    // Fetch order details
    async getOrderDetails(orderId) {
        try {
            const order = await razorpay.orders.fetch(orderId);
            return order;
        } catch (error) {
            console.error('Razorpay fetch order error:', error);
            throw new Error(`Failed to fetch order: ${error.message}`);
        }
    }

    // Generate payment link
    async createPaymentLink(options) {
        try {
            const paymentLink = await razorpay.paymentLink.create({
                amount: options.amount,
                currency: options.currency || 'INR',
                description: options.description,
                customer: {
                    name: options.customerName,
                    email: options.customerEmail,
                    contact: options.customerPhone
                },
                notify: {
                    sms: true,
                    email: true
                },
                reminder_enable: true,
                notes: options.notes
            });

            return paymentLink;
        } catch (error) {
            console.error('Razorpay payment link error:', error);
            throw new Error(`Failed to create payment link: ${error.message}`);
        }
    }
}

module.exports = new RazorpayService();