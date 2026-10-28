import React, { useState, useEffect } from 'react';
import {
  Grid3X3,
  Filter,
  Car,
  Wrench,
  CheckCircle2,
  Clock,
  Radio,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { parkingService } from '../../services/parkingService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../context/NotificationContext';

export const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [selectedZone, setSelectedZone] = useState('ALL'); // 'ALL', 'A', 'B', 'C'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingSlot, setEditingSlot] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [maintenanceNote, setMaintenanceNote] = useState('');

  const { showToast } = useNotifications();

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    const data = await parkingService.getParkingSlots();
    setSlots(data);
  };

  const handleSlotClick = (slot) => {
    setEditingSlot(slot);
    setNewStatus(slot.status);
    setMaintenanceNote(slot.note || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    try {
      await parkingService.updateSlot(editingSlot.id, {
        status: newStatus,
        note: newStatus === 'MAINTENANCE' ? maintenanceNote : null,
      });

      showToast(`Bay ${editingSlot.id} status updated to ${newStatus}`, 'success');
      setEditingSlot(null);
      loadSlots();
    } catch (err) {
      showToast('Failed to update slot status', 'error');
    }
  };

  const filteredSlots = slots.filter((s) => {
    if (selectedZone !== 'ALL' && s.zone !== selectedZone) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    return true;
  });

  const getSlotColor = (status, isUser) => {
    if (isUser) return 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300';
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
      case 'OCCUPIED':
        return 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300';
      case 'RESERVED':
        return 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100';
      case 'MAINTENANCE':
        return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Parking Slot (Bay) Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical sensor monitoring, maintenance overrides, and capacity allocation
          </p>
        </div>

        <button
          onClick={loadSlots}
          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Hardware Loops</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Zone:</span>
          {['ALL', 'A', 'B', 'C'].map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`py-1.5 px-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedZone === zone
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {zone === 'ALL' ? 'All Zones' : `Zone ${zone}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">State:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="ALL">All States</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="RESERVED">Reserved</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Bays Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              className={`p-4 rounded-xl border flex flex-col justify-between text-left min-h-[110px] transition-all cursor-pointer ${getSlotColor(
                slot.status,
                slot.isCurrentUsers
              )} hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono font-bold text-sm">{slot.id}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {slot.zone}
                </span>
              </div>

              <div className="my-1.5">
                <span className="font-semibold text-[11px] block truncate">
                  {slot.vehicle || 'Vacant Bay'}
                </span>
                <span className="text-[10px] opacity-75 block truncate">
                  {slot.type}
                </span>
              </div>

              <div className="flex items-center justify-between w-full text-[10px] pt-1 border-t border-black/10">
                <span className="font-semibold uppercase tracking-wider">{slot.status}</span>
                <span className="opacity-70 font-mono">{slot.entryTime || '--'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Slot Override Modal */}
      <Modal
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        title={`Configure Bay ${editingSlot?.id}`}
        subtitle={`Zone ${editingSlot?.zone} • ${editingSlot?.type}`}
      >
        {editingSlot && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Current Occupant:</span>
                <span className="font-mono font-bold text-slate-800">{editingSlot.vehicle || 'None'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Active Session ID:</span>
                <span className="font-mono text-slate-700">{editingSlot.session || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Entry Timestamp:</span>
                <span className="text-slate-700">{editingSlot.entryTime || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Operator State Override:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
              >
                <option value="AVAILABLE">AVAILABLE (Bay Vacant)</option>
                <option value="OCCUPIED">OCCUPIED (Vehicle Parked)</option>
                <option value="RESERVED">RESERVED (Permit / VIP / Delegated Hold)</option>
                <option value="MAINTENANCE">MAINTENANCE (Sensor Calibration / Inactive)</option>
              </select>
            </div>

            {newStatus === 'MAINTENANCE' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Maintenance Reason / Notes:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ultrasonic detector loop recalibration"
                  value={maintenanceNote}
                  onChange={(e) => setMaintenanceNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingSlot(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
              >
                Save Bay Configuration
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
