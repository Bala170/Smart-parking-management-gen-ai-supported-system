import { activeParkingSession } from '../data/mockData';

export const recoveryService = {
  // Step 1: POST /api/recovery/identify
  async identifySession(vehicleNumber, mobile) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const cleanVeh = vehicleNumber.replace(/\s+/g, '').toUpperCase();
    const cleanActiveVeh = activeParkingSession.vehicleNumber.replace(/\s+/g, '').toUpperCase();

    if (cleanVeh === cleanActiveVeh || cleanVeh.includes("4821") || cleanVeh.includes("1904")) {
      return {
        success: true,
        sessionFound: true,
        sessionId: activeParkingSession.sessionId,
        vehicleNumber: activeParkingSession.vehicleNumber,
        maskedMobile: mobile ? mobile.replace(/(\+?\d{2})(\d{5})(\d{3})/, '$1-*****-$3') : '+91-*****456',
        slot: activeParkingSession.parkingSlot,
      };
    }

    throw new Error('No active parking session found for the provided vehicle and mobile number.');
  },

  // Step 2: POST /api/recovery/request-otp
  async sendOtp(mobile) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      message: 'Secure OTP sent to registered mobile number.',
      demoHintOtp: '482915', // For review demonstration
    };
  },

  // Step 2: POST /api/recovery/verify-otp
  async verifyOtp(otp) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (otp === '482915' || otp === '123456') {
      return {
        success: true,
        verificationToken: 'MOCK-VERIFIED-RECOV-TOKEN-77192',
        verified: true,
      };
    }
    throw new Error('Invalid OTP code. Please check and retry.');
  },

  // Step 4: POST /api/recovery/generate-credential
  async generateRecoveryCredential(verificationToken) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const expiration = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity
    const recoveryTokenId = `REC-CRED-${Date.now().toString().slice(-6)}`;
    return {
      success: true,
      recoveryToken: recoveryTokenId,
      vehicleNumber: activeParkingSession.vehicleNumber,
      vehicleModel: activeParkingSession.vehicleModel,
      slot: activeParkingSession.parkingSlot,
      sessionId: activeParkingSession.sessionId,
      expirationTime: expiration,
      validMinutes: 60,
      qrPayload: `SEC-RECOVERY:${recoveryTokenId}:${activeParkingSession.vehicleNumber}:EXP-${Date.now() + 3600000}`,
      securityNotice: 'Single-use emergency retrieval credential. Valid for 60 minutes only.',
    };
  }
};
