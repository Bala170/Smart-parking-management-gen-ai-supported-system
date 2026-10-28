import { initialDelegations, activeParkingSession, currentUser } from '../data/mockData';

let delegationsState = [...initialDelegations];

export const delegationService = {
  // GET /api/delegation/list
  async getDelegations() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...delegationsState];
  },

  // POST /api/delegation/create
  async createDelegation(data) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newDelegation = {
      id: `DEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleNumber: data.vehicleNumber || activeParkingSession.vehicleNumber,
      vehicleModel: data.vehicleModel || activeParkingSession.vehicleModel,
      slot: activeParkingSession.parkingSlot,
      sessionId: activeParkingSession.sessionId,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      delegateeName: data.delegateeName,
      delegateePhone: data.delegateePhone,
      relation: data.relation || 'Authorized Delegate',
      validFrom: data.validFrom || new Date().toISOString(),
      validUntil: data.validUntil || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      formattedFrom: 'Immediate',
      formattedUntil: 'In 4 hours',
      purpose: data.purpose || 'Authorized retrieval',
      status: 'ACTIVE',
      otp: randomOtp,
      qrPayload: `SEC-DEL:DELEGATED-ACCESS:${data.delegateePhone}:${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    delegationsState = [newDelegation, ...delegationsState];
    return newDelegation;
  },

  // POST /api/delegation/revoke
  async revokeDelegation(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    delegationsState = delegationsState.map((d) =>
      d.id === id ? { ...d, status: 'REVOKED' } : d
    );
    return { success: true, message: `Delegation ${id} has been revoked.` };
  },

  // POST /api/delegation/verify
  async verifyDelegation(id, otp) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const del = delegationsState.find((d) => d.id === id);
    if (!del) throw new Error('Delegation authorization not found.');
    if (del.status !== 'ACTIVE') throw new Error(`Delegation is no longer active (Status: ${del.status}).`);
    if (del.otp !== otp) throw new Error('Invalid delegation verification OTP.');
    return { success: true, verified: true, delegation: del };
  }
};
