import { activeParkingSession, initialSlots, parkingHistory } from '../data/mockData';

let slotsState = [...initialSlots];
let currentSessionState = { ...activeParkingSession };
let historyState = [...parkingHistory];

export const parkingService = {
  // GET /api/parking/status
  async getParkingStatus() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const total = slotsState.length;
    const occupied = slotsState.filter((s) => s.status === 'OCCUPIED').length;
    const available = slotsState.filter((s) => s.status === 'AVAILABLE').length;
    const reserved = slotsState.filter((s) => s.status === 'RESERVED').length;
    const maintenance = slotsState.filter((s) => s.status === 'MAINTENANCE').length;

    return {
      total,
      occupied,
      available,
      reserved,
      maintenance,
      occupancyPercentage: Math.round((occupied / total) * 100),
    };
  },

  // GET /api/parking/session
  async getActiveSession() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return currentSessionState;
  },

  // GET /api/parking/slots
  async getParkingSlots(zone = null) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (zone) {
      return slotsState.filter((s) => s.zone === zone);
    }
    return slotsState;
  },

  // GET /api/history
  async getHistory(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let data = [...historyState];
    if (filters.status) {
      data = data.filter((item) => item.status === filters.status);
    }
    if (filters.retrievalMethod) {
      data = data.filter((item) => item.retrievalMethod === filters.retrievalMethod);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (item) =>
          item.sessionId.toLowerCase().includes(q) ||
          item.vehicleNumber.toLowerCase().includes(q) ||
          item.slot.toLowerCase().includes(q)
      );
    }
    return data;
  },

  // PUT /api/parking/slots/{id}
  async updateSlot(slotId, updateData) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    slotsState = slotsState.map((s) => (s.id === slotId ? { ...s, ...updateData } : s));
    return slotsState.find((s) => s.id === slotId);
  }
};
