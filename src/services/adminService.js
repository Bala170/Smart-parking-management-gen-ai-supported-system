import {
  adminKPIs,
  hourlyOccupancyData,
  dailyRevenueData,
  retrievalMethodsStats,
  initialAuditLogs,
  retrievalManagementList
} from '../data/mockData';

let auditLogsState = [...initialAuditLogs];
let retrievalsState = [...retrievalManagementList];

export const adminService = {
  // GET /api/admin/kpis
  async getKPIs() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return { ...adminKPIs };
  },

  // GET /api/admin/occupancy-trend
  async getOccupancyTrend() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...hourlyOccupancyData];
  },

  // GET /api/admin/revenue-trend
  async getRevenueTrend() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...dailyRevenueData];
  },

  // GET /api/admin/retrieval-stats
  async getRetrievalStats() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...retrievalMethodsStats];
  },

  // GET /api/admin/audit-logs
  async getAuditLogs(filter = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let logs = [...auditLogsState];
    if (filter.status) {
      logs = logs.filter((l) => l.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.event.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q) ||
          l.vehicle.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q)
      );
    }
    return logs;
  },

  // GET /api/admin/retrievals
  async getRetrievals() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...retrievalsState];
  },

  // POST /api/admin/retrievals/{id}/action
  async updateRetrievalStatus(id, action) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    retrievalsState = retrievalsState.map((r) => {
      if (r.id === id) {
        if (action === 'AUTHORIZE') {
          return { ...r, authStatus: 'Authorized - Physical Gate Released', gateStatus: 'Boom Barrier Lifted' };
        } else if (action === 'REJECT') {
          return { ...r, authStatus: 'Rejected - Security Hold', gateStatus: 'Gate Locked' };
        }
      }
      return r;
    });
    return retrievalsState.find((r) => r.id === id);
  }
};
