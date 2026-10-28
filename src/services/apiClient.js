const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_BASE_URL;

let authToken = localStorage.getItem('auth_token');
let mockMonitoringDetections = [];

function getHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (authToken) h['Authorization'] = 'Bearer ' + authToken;
  return h;
}

async function request(endpoint, options = {}) {
  if (USE_MOCK) {
    return mockRequest(endpoint, options);
  }
  const url = API_BASE + endpoint;
  const res = await fetch(url, {
    headers: getHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'HTTP ' + res.status);
  }
  return res.json();
}

function setToken(token) {
  authToken = token;
  if (token) localStorage.setItem('auth_token', token);
  else localStorage.removeItem('auth_token');
}

function clearToken() {
  authToken = null;
  localStorage.removeItem('auth_token');
}

async function mockRequest(endpoint, options) {
  await new Promise(r => setTimeout(r, 150));
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;
  
  const { 
    currentUser, adminUser, initialVehicles, initialSlots, activeParkingSession, 
    parkingHistory, paymentTransactions, userNotifications, initialDelegations,
    retrievalManagementList, adminKPIs, hourlyOccupancyData, retrievalMethodsStats, dailyRevenueData
  } = await import('../data/mockData');
  
  if (endpoint === '/auth/login' && method === 'POST') {
    const role = body?.role || 'user';
    return { success: true, user: role === 'admin' ? adminUser : currentUser, token: 'mock-jwt', role };
  }
  if (endpoint === '/auth/register' && method === 'POST') {
    return { success: true, user: { ...currentUser, ...body }, token: 'mock-jwt', role: 'user' };
  }
  if (endpoint === '/auth/me') {
    return currentUser;
  }
  
  if (endpoint === '/vehicles' && method === 'GET') return initialVehicles;
  if (endpoint === '/vehicles' && method === 'POST') {
    const v = { ...body, id: 'VEH-' + (initialVehicles.length+1), rfidStatus: 'Pending Verification', parkingStatus: 'Idle' };
    initialVehicles.push(v);
    return v;
  }
  
  if (endpoint === '/parking-slots' && method === 'GET') return initialSlots;
  
  if (endpoint === '/parking-sessions/my' && method === 'GET') return [activeParkingSession];
  if (endpoint.startsWith('/parking-sessions/') && method === 'GET') return activeParkingSession;
  if (endpoint === '/parking-sessions' && method === 'POST') return { ...activeParkingSession, ...body };
  if (endpoint.includes('/end') && method === 'POST') return { ...activeParkingSession, status: 'COMPLETED', ...body };
  if (endpoint.includes('/fee') && method === 'GET') return { duration_minutes: 142, current_fee: 40, hourly_rate: 20 };
  
  if (endpoint === '/tokens/generate' && method === 'POST') return { token_code: 'DTK-MOCK123', status: 'ACTIVE', valid_until: new Date(Date.now()+2*3600000).toISOString() };
  if (endpoint === '/tokens/my' && method === 'GET') return [{ token_code: 'DTK-MOCK123', status: 'ACTIVE' }];
  
  if (endpoint === '/payments' && method === 'POST') return { txn_code: 'TXN-MOCK', status: 'SUCCESS', amount: body?.amount };
  if (endpoint === '/payments/my' && method === 'GET') return paymentTransactions;
  if (endpoint.startsWith('/payments/session/') && method === 'GET') return { paid: false, amount_due: 40 };
  
  if (endpoint === '/parking-sessions' && method === 'GET') return parkingHistory;
  
  if (endpoint === '/recovery/request' && method === 'POST') return { success: true, recovery_id: 'RECOV-MOCK', message: 'OTP sent', new_token_code: '123456' };
  if (endpoint === '/recovery/verify-otp' && method === 'POST') return { success: true, recovery_id: 'RECOV-MOCK', message: 'Recovery successful', new_token_code: 'DTK-NEW' };
  
  if (endpoint === '/delegation' && method === 'POST') return { delegation_code: 'DEL-MOCK', status: 'ACTIVE', otp: '123456' };
  if (endpoint === '/delegation/my' && method === 'GET') return initialDelegations;
  if (endpoint === '/delegation/validate' && method === 'POST') return { valid: true };
  
  if (endpoint === '/retrieval/validate' && method === 'POST') return { request_code: 'RET-MOCK', auth_status: 'AUTHORIZED', payment_status: 'Paid', gate_status: 'READY_TO_OPEN' };
  
  if (endpoint === '/admin/stats' && method === 'GET') return adminKPIs;
  if (endpoint === '/admin/slots' && method === 'GET') return initialSlots;
  if (endpoint === '/admin/active-sessions' && method === 'GET') return [activeParkingSession];
  if (endpoint === '/admin/retrievals' && method === 'GET') return retrievalManagementList;
  if (endpoint === '/admin/delegations' && method === 'GET') return initialDelegations;
  if (endpoint === '/admin/users' && method === 'GET') return [currentUser, adminUser];
  if (endpoint === '/admin/vehicles' && method === 'GET') return initialVehicles;
  if (endpoint === '/admin/payments' && method === 'GET') return paymentTransactions;
  if (endpoint === '/monitoring/cameras' && method === 'GET') return [{ id: 1, name: 'Demo Lot Camera', camera_code: 'CAM-DEMO-01', status: 'ONLINE', enabled: true }];
  if (endpoint === '/monitoring/zones' && method === 'GET') return [{ id: 1, name: 'Zone A', zone_code: 'A', description: 'Demo zone' }];
  if (endpoint === '/monitoring/summary' && method === 'GET') return { total_slots: initialSlots.length, occupied_slots: initialSlots.filter(s => s.status === 'OCCUPIED').length, available_slots: initialSlots.filter(s => s.status === 'AVAILABLE').length, stale_slots: 0, online_cameras: 1, total_cameras: 1, last_event_at: new Date().toISOString() };
  if (endpoint.startsWith('/monitoring/detections') && method === 'GET') return mockMonitoringDetections;
  if (endpoint === '/monitoring/demo/ingest' && method === 'POST') {
    mockMonitoringDetections = body.occupied_slot_codes.map((slot, index) => ({ id: index + 1, camera_id: body.camera_id, slot_id: null, vehicle_plate: body.vehicle_plates?.[slot] || null, vehicle_type: 'Two-Wheeler', confidence: 0.97, detected_at: new Date().toISOString(), source: body.source || 'demo' }));
    return mockMonitoringDetections;
  }
  
  if (endpoint === '/audit' && method === 'GET') return [];
  if (endpoint === '/audit/stats' && method === 'GET') return {};
  
  return { error: 'Mock not implemented for ' + endpoint };
}

export const api = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  setToken,
  clearToken,
  
  getVehicles: () => request('/vehicles'),
  createVehicle: (data) => request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  
  getSlots: (zone) => request('/parking-slots' + (zone ? '?zone=' + zone : '')),
  getMySessions: () => request('/parking-sessions/my'),
  getSession: (id) => request('/parking-sessions/' + id),
  createSession: (data) => request('/parking-sessions', { method: 'POST', body: JSON.stringify(data) }),
  endSession: (id, data) => request('/parking-sessions/' + id + '/end', { method: 'POST', body: JSON.stringify(data) }),
  getFee: (id) => request('/parking-sessions/' + id + '/fee'),
  getHistory: (filters) => request('/parking-sessions'),
  
  generateToken: (data) => request('/tokens/generate', { method: 'POST', body: JSON.stringify(data) }),
  getMyTokens: () => request('/tokens/my'),
  validateToken: (code) => request('/tokens/validate', { method: 'POST', body: JSON.stringify({ token_code: code }) }),
  useToken: (id) => request('/tokens/' + id + '/use', { method: 'POST' }),
  
  createPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getMyPayments: () => request('/payments/my'),
  verifyPayment: (code) => request('/payments/verify', { method: 'POST', body: JSON.stringify({ txn_code: code }) }),
  getSessionPayment: (id) => request('/payments/session/' + id),
  
  requestRecovery: (data) => request('/recovery/request', { method: 'POST', body: JSON.stringify(data) }),
  verifyRecoveryOtp: (data) => request('/recovery/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  
  createDelegation: (data) => request('/delegation', { method: 'POST', body: JSON.stringify(data) }),
  getMyDelegations: () => request('/delegation/my'),
  validateDelegation: (code, otp) => request('/delegation/validate', { method: 'POST', body: JSON.stringify({ delegation_code: code, otp }) }),
  revokeDelegation: (id) => request('/delegation/' + id + '/revoke', { method: 'POST' }),
  
  validateRetrieval: (data) => request('/retrieval/validate', { method: 'POST', body: JSON.stringify(data) }),
  getMyRetrievals: () => request('/retrieval/my'),
  
  getAdminStats: () => request('/admin/stats'),
  getAdminSlots: (zone) => request('/admin/slots' + (zone ? '?zone=' + zone : '')),
  getAdminActiveSessions: () => request('/admin/active-sessions'),
  getAdminRetrievals: () => request('/admin/retrievals'),
  getAdminDelegations: () => request('/admin/delegations'),
  getAdminUsers: () => request('/admin/users'),
  getAdminVehicles: () => request('/admin/vehicles'),
  getAdminPayments: () => request('/admin/payments'),
  getMonitoringSummary: () => request('/monitoring/summary'),
  getMonitoringCameras: () => request('/monitoring/cameras'),
  getMonitoringZones: () => request('/monitoring/zones'),
  getMonitoringDetections: (limit = 50) => request('/monitoring/detections?limit=' + limit),
  getMonitoringSlots: () => request('/monitoring/slots'),
  ingestDemoFrame: (data) => request('/monitoring/demo/ingest', { method: 'POST', body: JSON.stringify(data) }),
  
  getAuditLogs: (params) => request('/audit'),
  getAuditStats: () => request('/audit/stats'),
  
  health: () => request('/health'),
};

export default api;
