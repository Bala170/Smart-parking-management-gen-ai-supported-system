import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Car,
  Phone,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  QrCode,
  Share2,
  Sparkles
} from 'lucide-react';
import { delegationService } from '../../services/delegationService';
import { activeParkingSession } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeCard } from '../../components/common/QRCodeCard';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../context/NotificationContext';

export const DelegatedRetrieval = () => {
  const [delegations, setDelegations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newDelegationSuccess, setNewDelegationSuccess] = useState(null);

  // Form Fields
  const [delegateeName, setDelegateeName] = useState('');
  const [delegateePhone, setDelegateePhone] = useState('');
  const [validFrom, setValidFrom] = useState('2026-10-10T10:00');
  const [validUntil, setValidUntil] = useState('2026-10-10T14:00');
  const [purpose, setPurpose] = useState('');

  const [filterTab, setFilterTab] = useState('ACTIVE'); // 'ACTIVE' or 'ALL'
  const { showToast } = useNotifications();

  useEffect(() => {
    fetchDelegations();
  }, []);

  const fetchDelegations = async () => {
    try {
      const data = await delegationService.getDelegations();
      setDelegations(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!delegateeName || !delegateePhone) {
      showToast('Please fill authorized person name and phone', 'error');
      return;
    }

    try {
      const created = await delegationService.createDelegation({
        delegateeName,
        delegateePhone,
        validFrom,
        validUntil,
        purpose,
        vehicleNumber: activeParkingSession.vehicleNumber,
        vehicleModel: activeParkingSession.vehicleModel,
      });

      setNewDelegationSuccess(created);
      setIsCreating(false);
      setDelegateeName('');
      setDelegateePhone('');
      setPurpose('');
      fetchDelegations();
      showToast('Temporary vehicle delegation pass created successfully', 'success');
    } catch (err) {
      showToast('Failed to create delegation', 'error');
    }
  };

  const handleRevoke = async (id) => {
    if (window.confirm(`Are you sure you want to revoke authorization ${id}? The delegate will immediately lose gate access.`)) {
      await delegationService.revokeDelegation(id);
      fetchDelegations();
      showToast(`Delegation ${id} revoked`, 'warning');
      if (newDelegationSuccess?.id === id) {
        setNewDelegationSuccess(null);
      }
    }
  };

  const activeDelegations = delegations.filter((d) => d.status === 'ACTIVE');
  const displayedDelegations = filterTab === 'ACTIVE' ? activeDelegations : delegations;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Delegate Vehicle Retrieval
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Issue time-bound, cryptographically verified retrieval authorization to a trusted person
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Authorization</span>
        </button>
      </div>

      {/* Selected Vehicle Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Vehicle Scheduled for Retrieval
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium">Vehicle License Plate</span>
            <span className="font-extrabold text-slate-900 font-mono text-sm">{activeParkingSession.vehicleNumber}</span>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium">Make & Model</span>
            <span className="font-semibold text-slate-800">{activeParkingSession.vehicleModel}</span>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
            <span className="text-slate-500 block text-[11px] font-medium">Current Parking Bay</span>
            <span className="font-extrabold text-blue-700 text-sm font-sans">{activeParkingSession.parkingSlot} ({activeParkingSession.zone})</span>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium">Active Session</span>
            <span className="font-mono text-slate-700 font-semibold">{activeParkingSession.sessionId}</span>
          </div>
        </div>
      </div>

      {/* Newly Created Delegation Showcase */}
      {newDelegationSuccess && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-7 shadow-lg shadow-emerald-500/10 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                DELEGATION ACTIVE
              </span>
              <span className="font-mono text-xs text-slate-500">ID: {newDelegationSuccess.id}</span>
            </div>
            <StatusBadge status={newDelegationSuccess.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 flex justify-center">
              <QRCodeCard
                value={newDelegationSuccess.qrPayload}
                title="Delegated Retrieval Pass"
                tokenId={newDelegationSuccess.id}
                vehicleNumber={newDelegationSuccess.vehicleNumber}
                slot={newDelegationSuccess.slot}
                validUntil={newDelegationSuccess.validUntil}
              />
            </div>

            <div className="md:col-span-7 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-400 font-medium">Authorized Person:</span>
                  <span className="font-extrabold text-slate-900">{newDelegationSuccess.delegateeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-400 font-medium">Mobile Phone:</span>
                  <span className="font-mono font-bold text-slate-800">{newDelegationSuccess.delegateePhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-400 font-medium">Validity Window:</span>
                  <span className="font-bold text-amber-800">
                    {newDelegationSuccess.formattedFrom} → {newDelegationSuccess.formattedUntil}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-400 font-medium">Gate Verification OTP:</span>
                  <span className="font-mono text-base font-extrabold text-blue-700">{newDelegationSuccess.otp}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Delegation Purpose:</span>
                  <span className="text-slate-700">{newDelegationSuccess.purpose || 'Authorized pickup'}</span>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-[11px] flex items-start gap-2.5 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  “This authorization is temporary and can only be used within the specified validity period.”
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleRevoke(newDelegationSuccess.id)}
                  className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke Authorization</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs / Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('ACTIVE')}
            className={`py-2 px-3.5 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
              filterTab === 'ACTIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Active Delegations ({activeDelegations.length})
          </button>
          <button
            onClick={() => setFilterTab('ALL')}
            className={`py-2 px-3.5 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
              filterTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All History ({delegations.length})
          </button>
        </div>
      </div>

      {/* Delegation Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedDelegations.map((del) => (
          <div key={del.id} className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">{del.delegateeName}</span>
                  <span className="font-mono text-[11px] text-slate-400 block mt-0.5">{del.id}</span>
                </div>
                <StatusBadge status={del.status} />
              </div>

              <div className="space-y-2 text-xs py-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile Phone:</span>
                  <span className="font-mono font-bold text-slate-800">{del.delegateePhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Validity:</span>
                  <span className="text-slate-700 font-medium">{del.formattedFrom} to {del.formattedUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gate Verification OTP:</span>
                  <span className="font-mono font-extrabold text-blue-700 text-sm">{del.otp}</span>
                </div>
                {del.purpose && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{del.purpose}"
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">Bay: {del.slot} • {del.vehicleNumber}</span>
              {del.status === 'ACTIVE' && (
                <button
                  onClick={() => handleRevoke(del.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create Temporary Delegation Authorization"
        subtitle="Grant time-limited vehicle retrieval clearance"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Authorized Person Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Arun Kumar M."
              value={delegateeName}
              onChange={(e) => setDelegateeName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Authorized Person Mobile Number
            </label>
            <input
              type="text"
              required
              placeholder="+91 94441 87654"
              value={delegateePhone}
              onChange={(e) => setDelegateePhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Valid From</label>
              <input
                type="datetime-local"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Valid Until</label>
              <input
                type="datetime-local"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Purpose / Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Authorized to pick up bike for scheduled service maintenance"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-[11px] leading-relaxed">
            Security Notice: Authorization produces single-use QR and OTP credentials. Delegated pick-up must be completed before the validity expiry.
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold cursor-pointer shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              Create Temporary Authorization
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
