import React, { useState, useEffect } from 'react';
import {
  Car,
  Plus,
  Trash2,
  Edit,
  Radio,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Zap
} from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../context/NotificationContext';

export const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: '',
    model: '',
    type: 'Two-Wheeler',
    color: 'Metallic Black',
  });

  const { showToast } = useNotifications();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await vehicleService.addVehicle(newVehicle);
      showToast('New vehicle registered and RFID tag requested', 'success');
      setIsAddModalOpen(false);
      setNewVehicle({ vehicleNumber: '', model: '', type: 'Two-Wheeler', color: 'Metallic Black' });
      loadVehicles();
    } catch (err) {
      showToast('Failed to add vehicle', 'error');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle from your profile?')) {
      await vehicleService.removeVehicle(id);
      showToast('Vehicle removed from registry', 'warning');
      loadVehicles();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Registered Vehicles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your RFID vehicle identities, tag assignments, and active parking states
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((veh) => (
          <div
            key={veh.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all group"
          >
            <div>
              {/* Top Row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                    {veh.type.includes('EV') ? <Zap className="w-4 h-4 text-purple-600" /> : <Car className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-sm text-slate-900">{veh.vehicleNumber}</span>
                    <span className="block text-[10.5px] text-slate-400 capitalize">{veh.type}</span>
                  </div>
                </div>
                <StatusBadge status={veh.parkingStatus} />
              </div>

              {/* Specs */}
              <div className="space-y-2 py-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Model:</span>
                  <span className="font-semibold text-slate-800">{veh.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Color:</span>
                  <span className="text-slate-700">{veh.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">RFID Tag ID:</span>
                  <span className="font-mono text-blue-700 font-bold">{veh.rfidTag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Hardware Status:</span>
                  <span className="font-bold text-emerald-700">{veh.rfidStatus}</span>
                </div>
                {veh.slot && (
                  <div className="flex justify-between p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900">
                    <span className="font-medium text-[11px]">Currently Parked:</span>
                    <span className="font-bold text-sm font-sans">Bay {veh.slot}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedVehicle(veh)}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Telemetry Details</span>
              </button>
              <button
                onClick={() => handleRemove(veh.id)}
                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50"
                title="Remove vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Vehicle"
        subtitle="Associate license plate with automated RFID tracking"
      >
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Registration Plate #</label>
            <input
              type="text"
              required
              placeholder="e.g. TN-07-AA-9988"
              value={newVehicle.vehicleNumber}
              onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
              className="w-full font-mono uppercase px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Make & Model</label>
            <input
              type="text"
              required
              placeholder="e.g. TVS Apache RTR 160 / Hyundai i20"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Classification</label>
              <select
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              >
                <option value="Two-Wheeler">Two-Wheeler</option>
                <option value="Four-Wheeler">Four-Wheeler Standard</option>
                <option value="Four-Wheeler (EV)">Four-Wheeler (EV)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vehicle Color</label>
              <input
                type="text"
                value={newVehicle.color}
                onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold cursor-pointer shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              Register Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title={`Vehicle: ${selectedVehicle?.vehicleNumber}`}
        subtitle={selectedVehicle?.model}
      >
        {selectedVehicle && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-400 font-medium">Plate Number:</span>
                <span className="font-mono font-extrabold text-slate-900">{selectedVehicle.vehicleNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-400 font-medium">Model:</span>
                <span className="font-semibold text-slate-800">{selectedVehicle.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-400 font-medium">Classification:</span>
                <span className="text-slate-700 font-medium">{selectedVehicle.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-400 font-medium">Assigned UHF Tag:</span>
                <span className="font-mono text-blue-700 font-extrabold">{selectedVehicle.rfidTag}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Enrolled On:</span>
                <span className="text-slate-800 font-medium">{selectedVehicle.registrationDate}</span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-2xl text-blue-900 text-[11px] leading-relaxed">
              RFID tags are linked to gate boom barriers. Upon entering the perimeter, antenna readers authenticate the tag against this vehicle registry.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
