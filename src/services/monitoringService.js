import api from './apiClient';

export const monitoringService = {
  getSummary: () => api.getMonitoringSummary(),
  getCameras: () => api.getMonitoringCameras(),
  getZones: () => api.getMonitoringZones(),
  getDetections: (limit) => api.getMonitoringDetections(limit),
  ingestDemoFrame: (data) => api.ingestDemoFrame(data),
};
