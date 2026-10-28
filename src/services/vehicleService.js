import { initialVehicles } from '../data/mockData';

let vehiclesState = [...initialVehicles];

export const vehicleService = {
  // GET /api/vehicles
  async getVehicles() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...vehiclesState];
  },

  // POST /api/vehicles
  async addVehicle(vehicleData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newVehicle = {
      id: `VEH-${String(vehiclesState.length + 1).padStart(2, '0')}`,
      vehicleNumber: vehicleData.vehicleNumber.toUpperCase().trim(),
      model: vehicleData.model.trim(),
      type: vehicleData.type || 'Two-Wheeler',
      color: vehicleData.color || 'Standard',
      rfidTag: `RFID-${Math.random().toString(16).substring(2, 6).toUpperCase()}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
      rfidStatus: 'Pending Verification',
      registrationDate: new Date().toISOString().split('T')[0],
      parkingStatus: 'Idle',
      activeSessionId: null,
      slot: null,
    };
    vehiclesState = [newVehicle, ...vehiclesState];
    return newVehicle;
  },

  // DELETE /api/vehicles/{id}
  async removeVehicle(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    vehiclesState = vehiclesState.filter((v) => v.id !== id);
    return { success: true };
  },

  // PUT /api/vehicles/{id}
  async updateVehicle(id, updateData) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    vehiclesState = vehiclesState.map((v) => (v.id === id ? { ...v, ...updateData } : v));
    return vehiclesState.find((v) => v.id === id);
  }
};
