import React, { useState } from 'react';
import {
  ListOrdered,
  Radio,
  Car,
  Search,
  ShieldCheck,
  ExternalLink,
  Clock,
  CreditCard,
  QrCode
} from 'lucide-react';
import { activeParkingSession } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../context/NotificationContext';

export const ActiveSessions = () => {
  const [sessions, setSessions] = useState([
    {
      ...activeParkingSession,
      user: "Balamurugan S. (USR-0091)",
      barrierStatus: "Locked (Exit Gate 2)",
    },
    {
      sessionId: "PS-2026-00125",
      vehicleNumber: "TN-18-D-9988",
      vehicleModel: "Royal Enfield Hunter 350",
      rfidTag: "RFID-11A0-9944",
      parkingSlot: "C-11",
      zone: "Zone C",
      entryGate: "Gate 1 - North RFID Reader",
      formattedEntryTime: "Today at 08:20 AM",
      durationMinutes: 137,
      currentFee: 40,
      digitalTokenId: "DTK-99014-A2",
      digitalTokenStatus: "ACTIVE",
      user: "Kavitha R. (USR-0104)",
      barrierStatus: "Locked (Exit Gate 2)",
    },
    {
      sessionId: "PS-2026-00121",
      vehicleNumber: "TN-05-BB-1122",
      vehicleModel: "Maruti Suzuki Swift",
      rfidTag: "RFID-88B1-CC02",
      parkingSlot: "C-08",
      zone: "Zone C",
      entryGate: "Gate 1 - North RFID Reader",
      formattedEntryTime: "Today at 08:12 AM",
      durationMinutes: 145,
      currentFee: 60,
      digitalTokenId: "DTK-88102-M4",
      digitalTokenStatus: "ACTIVE",
      user: "Murugesan P. (USR-0045)",
      barrierStatus: "Locked (Exit Gate 2)",
    },
    {
      sessionId: "PS-2026-00119",
      vehicleNumber: "TN-22-Y-5512",
      vehicleModel: "Yamaha MT-15",
      rfidTag: "RFID-33D4-FF10",
      parkingSlot: "A-09",
      zone: "Zone A",
      entryGate: "Gate 1 - North RFID Reader",
      formattedEntryTime: "Today at 08:10 AM",
      durationMinutes: 147,
      currentFee: 40,
      digitalTokenId: "DTK-77190-Q8",
      digitalTokenStatus: "ACTIVE",
      user: "Vignesh S. (USR-0038)",
      barrierStatus: "Locked (Exit Gate 2)",
    }
  ]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [search, setSearch] = useState('');
  const { showToast } = useNotifications();

  const handleManualRelease = (sessionId) => {
    if (window.confirm(`Issue manual override release for session ${sessionId}? This will signal the exit boom barrier.`)) {
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId
            ? { ...s, barrierStatus: "Boom Barrier Commanded (Manual)", digitalTokenStatus: "RELEASED" }
            : s
        )
      );
      showToast(`Manual release dispatched for ${sessionId}`, 'warning');
      setSelectedSession(null);
    }
  };

  const filtered = sessions.filter(
    (s) =>
      s.sessionId.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.parkingSlot.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Active In-Perimeter Parking Sessions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time session ledger linked to gate barriers and ultrasonic bay presence
          </p>
        </div>

        <span className="text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl">
          {sessions.length} Live Sessions
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search active sessions by plate, session ID, or bay..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Owner / User</th>
                <th className="py-3 px-4">Bay</th>
                <th className="py-3 px-4">RFID Sensor Tag</th>
                <th className="py-3 px-4">Ingress Time</th>
                <th className="py-3 px-4">Accrued Fee</th>
                <th className="py-3 px-4">Barrier State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.sessionId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{s.sessionId}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-800 block">{s.vehicleNumber}</span>
                    <span className="text-[10px] text-slate-400">{s.vehicleModel}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{s.user}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">{s.parkingSlot}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{s.rfidTag}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.formattedEntryTime}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{s.currentFee}.00</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {s.barrierStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedSession(s)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title={`Session Telemetry: ${selectedSession?.sessionId}`}
        subtitle={`${selectedSession?.vehicleNumber} • ${selectedSession?.vehicleModel}`}
      >
        {selectedSession && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Allocated Slot:</span>
                <span className="font-bold text-blue-700">{selectedSession.parkingSlot} ({selectedSession.zone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Hardware RFID Tag:</span>
                <span className="font-mono text-slate-900">{selectedSession.rfidTag}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Digital Token ID:</span>
                <span className="font-mono text-slate-900">{selectedSession.digitalTokenId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Calculated Fee:</span>
                <span className="font-bold text-slate-900">₹{selectedSession.currentFee}.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Gate State:</span>
                <span className="text-slate-700">{selectedSession.barrierStatus}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleManualRelease(selectedSession.sessionId)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
              >
                Trigger Manual Gate Release
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
