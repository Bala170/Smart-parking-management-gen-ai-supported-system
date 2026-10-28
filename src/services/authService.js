import { currentUser, adminUser } from '../data/mockData';

// Service layer designed for seamless FastAPI integration (/api/auth/*)
export const authService = {
  async login(credentials) {
    // Simulated auth logic with mock accounts
    await new Promise((resolve) => setTimeout(resolve, 350));
    const { identifier, role } = credentials;
    
    if (role === 'admin' || identifier?.includes('admin')) {
      return {
        success: true,
        user: adminUser,
        token: 'mock-jwt-token-admin-8849102',
        role: 'admin',
      };
    }
    
    return {
      success: true,
      user: currentUser,
      token: 'mock-jwt-token-user-2940192',
      role: 'user',
    };
  },

  async loginWithOtp(phone, otp) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (otp === '123456' || otp?.length === 6) {
      return {
        success: true,
        user: currentUser,
        token: 'mock-jwt-token-otp-991023',
        role: 'user',
      };
    }
    throw new Error('Invalid OTP code. Please enter the 6-digit verification code.');
  },

  async register(userData) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      message: 'Account registered successfully. Welcome to Smart Parking Portal.',
      user: { ...currentUser, ...userData },
      token: 'mock-jwt-token-newuser-10029',
      role: 'user',
    };
  },

  async getCurrentUser() {
    return currentUser;
  },

  async logout() {
    return { success: true };
  }
};
