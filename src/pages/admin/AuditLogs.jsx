import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Radio,
  KeyRound,
  UserCheck,
  AlertOctagon,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../context/NotificationContext';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const { showToast } = useNotifications();

  useEffect(() => {
    loadLogs();
  }, [search, statusFilter]);

  const loadLogs = async () => {
    try {
      const data = await adminService.getAuditLogs({
        search,
        status: statusFilter || undefined,
      });
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAudit = () => {
    const headers = ['Audit ID', 'Timestamp', 'Event', 'User', 'Vehicle', 'Action', 'Status', 'IP/Device Node', 'Details'];
    const rows = logs.map((l) => [
      l.id,
      l.timestamp,
      l.event,
      l.user,
      l.vehicle,
      l.action,
      l.status,
      `${l.ipAddress} (${l.gateNode})`,
      `"${l.details}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `security_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Cryptographic audit trail exported', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Security Audit Logs</h1>
            <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-mono font-medium">
              Tamper-Evident Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically timestamped transaction history across RFID sensors, MFA challenges, and barrier gates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLogs}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportAudit}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search audit trail by event, user, vehicle, IP, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="">All Event Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="REJECTED">REJECTED (Security Intercept)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor / User</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Node / IP Address</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{log.id}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-sans">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-slate-800">
                    <span className="flex items-center gap-1.5">
                      {log.status === 'REJECTED' || log.status === 'FAILED' ? (
                        <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      )}
                      <span>{log.event}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-sans">{log.user}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{log.vehicle}</td>
                  <td className="py-3.5 px-4 text-[11px] text-blue-700 font-bold">{log.action}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-500">
                    {log.ipAddress} <span className="text-[10px] text-slate-400">({log.gateNode})</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Event: ${selectedLog?.id}`}
        subtitle={`${selectedLog?.event} • ${selectedLog?.timestamp}`}
      >
        {selectedLog && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Event Name:</span>
                <span className="font-bold text-slate-900 font-sans">{selectedLog.event}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Actor:</span>
                <span className="font-medium text-slate-800 font-sans">{selectedLog.user}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Vehicle ID:</span>
                <span className="font-bold text-slate-900">{selectedLog.vehicle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Action Code:</span>
                <span className="text-blue-700 font-bold">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Execution Status:</span>
                <StatusBadge status={selectedLog.status} />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Source Node / IP:</span>
                <span className="text-slate-800">{selectedLog.ipAddress} ({selectedLog.gateNode})</span>
              </div>
              <div className="py-2">
                <span className="text-slate-500 block font-sans mb-1">Telemetry Payload Summary:</span>
                <p className="font-sans text-slate-700 bg-white p-3 rounded-lg border border-slate-200 text-[11px] leading-relaxed">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl font-sans text-blue-900 text-[11px]">
              This log entry is hashed in the local ledger. Modifying logs invalidates downstream chain verification.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
