// src/services/api.service.js
import axios from 'axios';

class ApiService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
        this.client = this.createClient();
        this.setupInterceptors();
        this.initializeRetryQueue();
        
        // Initialize default headers
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    createClient() {
        return axios.create({
            baseURL: this.baseURL,
            headers: this.defaultHeaders,
            timeout: 30000,
            withCredentials: false, // Set based on your authentication method
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });
    }

    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add authentication token
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add request ID for tracking (lowercase as per CORS error)
                config.headers['x-request-id'] = this.generateRequestId();

                // Add timestamp
                config.headers['X-Timestamp'] = Date.now();

                return config;
            },
            (error) => {
                this.handleError('Request Error', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                // Handle successful responses
                const data = response.data;

                // If the response contains a new token, update it
                if (data?.data?.tokens?.accessToken) {
                    this.setToken(data.data.tokens.accessToken);
                }

                return data;
            },
            async (error) => {
                // Handle response errors
                return this.handleResponseError(error);
            }
        );
    }

    initializeRetryQueue() {
        this.retryQueue = [];
        this.isRefreshing = false;
    }

    // ========================
    // AUTHENTICATION METHODS
    // ========================

    async login(credentials) {
        try {
            const response = await this.client.post('/auth/login', credentials);
            if (response.success && response.data?.token) {
                this.setToken(response.data.token);
                this.setUser(response.data.user);
            }
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Login failed');
        }
    }

    async register(userData) {
        try {
            const response = await this.client.post('/auth/register', userData);
            if (response.success && response.data?.token) {
                this.setToken(response.data.token);
                this.setUser(response.data.user);
            }
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Registration failed');
        }
    }

    async getCurrentUser() {
        try {
            const response = await this.client.get('/auth/me');
            if (response.success && response.data?.user) {
                this.setUser(response.data.user);
            }
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch user');
        }
    }

    async updateUserProfile(userData) {
        try {
            const response = await this.client.put('/auth/profile', userData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to update profile');
        }
    }

    async changePassword(passwordData) {
        try {
            const response = await this.client.put('/auth/change-password', passwordData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to change password');
        }
    }

    async forgotPassword(email) {
        try {
            const response = await this.client.post('/auth/forgot-password', { email });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to send reset link');
        }
    }

    async resetPassword(resetData) {
        try {
            const response = await this.client.put('/auth/reset-password', resetData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to reset password');
        }
    }

    async logout() {
        try {
            const response = await this.client.post('/auth/logout');
            this.clearAuth();
            return response;
        } catch (error) {
            this.clearAuth();
            throw error;
        }
    }

    async logoutAll() {
        try {
            const response = await this.client.post('/auth/logout-all');
            this.clearAuth();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteAccount(password) {
        try {
            const response = await this.client.delete('/auth/account', { data: { password } });
            this.clearAuth();
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to delete account');
        }
    }

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await this.client.post('/auth/refresh-token', { refreshToken });
            if (response.success && response.data?.accessToken) {
                this.setToken(response.data.accessToken);
                return response.data.accessToken;
            }
            return null;
        } catch (error) {
            this.clearAuth();
            throw error;
        }
    }

    async verifyEmail(token) {
        try {
            const response = await this.client.get(`/auth/verify-email?token=${token}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Email verification failed');
        }
    }

    async resendVerification(email) {
        try {
            const response = await this.client.post('/auth/resend-verification', { email });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to resend verification');
        }
    }

    // ========================
    // PAYMENT METHODS
    // ========================

    async initializePayment(paymentData) {
        try {
            const response = await this.client.post('/payments/initialize', paymentData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Payment initialization failed');
        }
    }

    async verifyOTP(paymentId, otp, gatewayPaymentId) {
        try {
            const response = await this.client.post('/payments/otp/verify', { 
                paymentId, 
                otp, 
                gatewayPaymentId 
            });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'OTP verification failed');
        }
    }

    async generatePaymentOTP(paymentId) {
        try {
            const response = await this.client.post('/payments/otp/generate', { paymentId });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to generate OTP');
        }
    }

    async getPaymentHistory(params = {}) {
        try {
            const response = await this.client.get('/payments/history', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch payment history');
        }
    }

    async getPaymentById(paymentId) {
        try {
            const response = await this.client.get(`/payments/${paymentId}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch payment details');
        }
    }

    async refundPayment(paymentId, reason, refundAmount) {
        try {
            const response = await this.client.post(`/payments/${paymentId}/refund`, { 
                reason, 
                refundAmount 
            });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Refund request failed');
        }
    }

    async getPaymentStatistics(params = {}) {
        try {
            const response = await this.client.get('/payments/stats/overview', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch payment statistics');
        }
    }

    // ========================
    // PLAN METHODS
    // ========================

    async getPlans(params = {}) {
        try {
            const response = await this.client.get('/plans', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch plans');
        }
    }

    async getPlanById(planId) {
        try {
            const response = await this.client.get(`/plans/${planId}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch plan details');
        }
    }

    async getPlanBySlug(slug) {
        try {
            const response = await this.client.get(`/plans/slug/${slug}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch plan');
        }
    }

    async calculatePlanPrice(planId, options = {}) {
        try {
            const response = await this.client.post(`/plans/${planId}/calculate-price`, options);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to calculate price');
        }
    }

    async comparePlans(planIds) {
        try {
            const response = await this.client.post('/plans/compare', { planIds });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to compare plans');
        }
    }

    async getPlanAlternatives(planId, type = 'upgrade') {
        try {
            const response = await this.client.get(`/plans/${planId}/alternatives`, { 
                params: { type } 
            });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch alternative plans');
        }
    }

    async getPlanStatistics(params = {}) {
        try {
            const response = await this.client.get('/plans/stats/overview', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch plan statistics');
        }
    }

    // ========================
    // COUPON METHODS
    // ========================

    async validateCoupon(couponData) {
        try {
            const response = await this.client.post('/coupons/validate', couponData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Invalid coupon code');
        }
    }

    async applyCoupon(couponData) {
        try {
            const response = await this.client.post('/coupons/apply', couponData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to apply coupon');
        }
    }

    async getCoupons(params = {}) {
        try {
            const response = await this.client.get('/coupons', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch coupons');
        }
    }

    async getCouponById(couponId) {
        try {
            const response = await this.client.get(`/coupons/${couponId}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch coupon');
        }
    }

    async getCouponByCode(code) {
        try {
            const response = await this.client.get(`/coupons/code/${code}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch coupon');
        }
    }

    async createCoupon(couponData) {
        try {
            const response = await this.client.post('/coupons', couponData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to create coupon');
        }
    }

    async updateCoupon(couponId, couponData) {
        try {
            const response = await this.client.put(`/coupons/${couponId}`, couponData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to update coupon');
        }
    }

    async deleteCoupon(couponId, force = false) {
        try {
            const response = await this.client.delete(`/coupons/${couponId}?force=${force}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to delete coupon');
        }
    }

    async getCouponStatistics(params = {}) {
        try {
            const response = await this.client.get('/coupons/stats/overview', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch coupon statistics');
        }
    }

    async exportCoupons(format = 'json') {
        try {
            const response = await this.client.get(`/coupons/export?format=${format}`);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to export coupons');
        }
    }

    // ========================
    // ANALYTICS METHODS
    // ========================

    async getDashboardAnalytics(params = {}) {
        try {
            const response = await this.client.get('/analytics/dashboard', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch dashboard analytics');
        }
    }

    async getSalesAnalytics(params = {}) {
        try {
            const response = await this.client.get('/analytics/sales', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch sales analytics');
        }
    }

    async getProductAnalytics(params = {}) {
        try {
            const response = await this.client.get('/analytics/products', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch product analytics');
        }
    }

    async getCustomerAnalytics(params = {}) {
        try {
            const response = await this.client.get('/analytics/customers', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch customer analytics');
        }
    }

    async getRealTimeAnalytics() {
        try {
            const response = await this.client.get('/analytics/realtime');
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch real-time analytics');
        }
    }

    async getShareAnalytics(params = {}) {
        try {
            const response = await this.client.get('/analytics/shares', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch share analytics');
        }
    }

    async trackShare(shareData) {
        try {
            const response = await this.client.post('/analytics/shares/track', shareData);
            return response;
        } catch (error) {
            console.warn('Failed to track share:', error.message);
            throw error;
        }
    }

    async trackPayment(paymentData) {
        try {
            const response = await this.client.post('/analytics/payments/track', paymentData);
            return response;
        } catch (error) {
            console.warn('Failed to track payment:', error.message);
            throw error;
        }
    }

    async generateReport(reportData) {
        try {
            const response = await this.client.post('/analytics/report', reportData);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to generate report');
        }
    }

    // ========================
    // AUTOMATION METHODS
    // ========================

    async getAutomationStatus() {
        try {
            const response = await this.client.get('/automation/status');
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch automation status');
        }
    }

    async startAutomation() {
        try {
            const response = await this.client.post('/automation/start');
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to start automation');
        }
    }

    async stopAutomation() {
        try {
            const response = await this.client.post('/automation/stop');
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to stop automation');
        }
    }

    async updateAutomationSettings(settings) {
        try {
            const response = await this.client.put('/automation/settings', settings);
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to update automation settings');
        }
    }

    async getAutomationLogs(params = {}) {
        try {
            const response = await this.client.get('/automation/logs', { params });
            return response;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch automation logs');
        }
    }

    // ========================
    // HELPER METHODS
    // ========================

    getToken() {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    setToken(token) {
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);
    }

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('refreshToken');
    }

    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    handleError(context, error) {
        console.error(`${context}:`, error);
        
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request made but no response:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    }

    handleApiError(error, defaultMessage = 'An error occurred') {
        // Extract meaningful error message
        let errorMessage = defaultMessage;
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Handle network errors specifically
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
            errorMessage = 'Cannot connect to server. Please check if backend is running.';
            console.error('Backend server is not running. Please start it on port 8000.');
        }

        // Create a clean error object
        const apiError = new Error(errorMessage);
        apiError.originalError = error;
        apiError.status = error.response?.status;
        apiError.data = error.response?.data;
        
        return apiError;
    }

    async handleResponseError(error) {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const newToken = await this.refreshToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return this.client(originalRequest);
                }
            } catch (refreshError) {
                this.clearAuth();
                // Redirect to login only in browser environment
                if (typeof window !== 'undefined') {
                    window.location.href = '/login?session=expired';
                }
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(this.handleApiError(error));
    }

    // Request cancellation
    createCancelToken() {
        return axios.CancelToken.source();
    }

    // Batch requests
    async batchRequests(requests) {
        try {
            const responses = await Promise.all(requests);
            return responses;
        } catch (error) {
            console.error('Batch request failed:', error);
            throw error;
        }
    }

    // ========================
    // ADDITIONAL CONFIGURATION METHODS
    // ========================

    // Update base URL dynamically
    updateBaseURL(newBaseURL) {
        this.baseURL = newBaseURL;
        this.client.defaults.baseURL = newBaseURL;
    }

    // Set custom headers
    setCustomHeader(key, value) {
        this.client.defaults.headers.common[key] = value;
    }

    // Remove custom header
    removeCustomHeader(key) {
        delete this.client.defaults.headers.common[key];
    }

    // Set timeout
    setTimeout(timeout) {
        this.client.defaults.timeout = timeout;
    }

    // Test connection
    async testConnection() {
        try {
            const response = await this.client.get('/health');
            return {
                success: true,
                data: response,
                message: 'Connection successful'
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: 'Connection failed'
            };
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

// Export both the instance and the class
export { ApiService };
export default apiService;