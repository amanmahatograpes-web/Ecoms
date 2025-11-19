export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (password) => password && password.length >= 6;
export const validateMobile = (mobile) => /^[0-9]{10,15}$/.test(mobile);
