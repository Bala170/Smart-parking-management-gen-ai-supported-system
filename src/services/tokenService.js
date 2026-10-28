import { activeParkingSession } from '../data/mockData';

let tokenState = {
  tokenId: activeParkingSession.digitalTokenId,
  sessionId: activeParkingSession.sessionId,
  vehicleNumber: activeParkingSession.vehicleNumber,
  vehicleModel: activeParkingSession.vehicleModel,
  parkingSlot: activeParkingSession.parkingSlot,
  entryTime: activeParkingSession.entryTime,
  validUntil: activeParkingSession.digitalTokenValidUntil,
  status: activeParkingSession.digitalTokenStatus,
  qrPayload: `SEC-TOKEN:${activeParkingSession.digitalTokenId}:${activeParkingSession.vehicleNumber}:EXP-1728573600`,
  issueTimestamp: "2026-10-10 08:15:22",
  securityFingerprint: "SHA256:7e8a91b...29ef",
};

export const tokenService = {
  // GET /api/token/session/{sessionId}
  async getDigitalToken(sessionId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return tokenState;
  },

  // POST /api/token/generate
  async generateToken(sessionId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    tokenState = {
      ...tokenState,
      tokenId: `DTK-${Date.now().toString().slice(-5)}-${randomSuffix}`,
      status: 'ACTIVE',
      validUntil: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    };
    return tokenState;
  },

  // POST /api/token/revoke
  async revokeToken(tokenId) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    tokenState.status = 'REVOKED';
    return { success: true, message: 'Digital token revoked securely.' };
  }
};
