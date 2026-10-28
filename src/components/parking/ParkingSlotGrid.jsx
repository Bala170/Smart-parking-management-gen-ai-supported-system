import React, { useState } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { Car, Clock, ShieldCheck, Wrench, AlertCircle, Sparkles, Zap, Radio, CheckCircle2 } from 'lucide-react';

export const ParkingSlotGrid = ({ slots, onSelectSlot, selectedSlotId, showInteractive = true }) => {
  const [activeModalSlot, setActiveModalSlot] = useState(null);

  const zones = [
    { key: 'A', name: 'Zone A - Two-Wheeler UHF RFID Bay', description: 'Ultra-High Frequency RFID sensor automated slots with magnetic loop sync', icon: Radio },
    { key: 'B', name: 'Zone B - Standard Four-Wheeler Bay', description: 'Dual optical camera & ground ultrasonic presence verification', icon: Car },
    { key: 'C', name: 'Zone C - EV Fast Charge & Delegated Bay', description: 'Priority lane for electric vehicles & authorized delegated pickups', icon: Zap },
  ];

  const getSlotStyle = (status, isUser, isSelected) => {
    if (isUser) {
      return 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400 ring-offset-2 scale-[1.02]';
    }
    if (isSelected) {
      return 'bg-blue-50 text-blue-900 border-blue-500 ring-2 ring-blue-500 shadow-xs scale-[1.02]';
    }

    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50/70 text-emerald-900 border-emerald-300/80 hover:bg-emerald-100/80 hover:border-emerald-400 hover:shadow-xs';
      case 'OCCUPIED':
        return 'bg-slate-100/90 text-slate-700 border-slate-300 hover:bg-slate-200/80 hover:border-slate-400';
      case 'RESERVED':
        return 'bg-purple-50/70 text-purple-900 border-purple-300/80 hover:bg-purple-100/80 hover:border-purple-400';
      case 'MAINTENANCE':
        return 'bg-amber-50/70 text-amber-900 border-amber-300/80 hover:bg-amber-100/80 hover:border-amber-400';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleSlotClick = (slot) => {
    if (onSelectSlot) {
      onSelectSlot(slot);
    }
    if (showInteractive) {
      setActiveModalSlot(slot);
    }
  };

  return (
    <div className="space-y-6">
      {/* Refined Legend Bar */}
      <div className="flex flex-wrap items-center gap-3.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs">
        <span className="font-bold text-slate-700 mr-1 text-[11px] uppercase tracking-wider">
          Telemetry Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-50 border border-emerald-400" />
          <span className="text-slate-600 text-[11px]">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-400" />
          <span className="text-slate-600 text-[11px]">Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-blue-600 border border-blue-700 shadow-2xs" />
          <span className="text-slate-900 font-bold text-[11px]">Your Parked Vehicle (A-12)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-purple-50 border border-purple-400" />
          <span className="text-slate-600 text-[11px]">Reserved / VIP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-50 border border-amber-400" />
          <span className="text-slate-600 text-[11px]">Sensor Calibration</span>
        </div>
      </div>

      {/* Grid by Zones */}
      {zones.map((zone) => {
        const zoneSlots = slots.filter((s) => s.zone === zone.key);
        const availableCount = zoneSlots.filter((s) => s.status === 'AVAILABLE').length;
        const totalCount = zoneSlots.length;
        const ZoneIcon = zone.icon;

        return (
          <div
            key={zone.key}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] transition-all"
          >
            {/* Zone Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                  <ZoneIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">{zone.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{zone.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  {availableCount} Available
                </span>
                <span className="text-slate-400">/ {totalCount} Bays</span>
              </div>
            </div>

            {/* Bays Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3">
              {zoneSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isUser = slot.isCurrentUsers;

                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    className={`group relative p-3.5 rounded-2xl border flex flex-col items-center justify-between min-h-[96px] transition-all duration-200 cursor-pointer active:scale-95 ${getSlotStyle(
                      slot.status,
                      isUser,
                      isSelected
                    )}`}
                  >
                    {/* Top Tag & Indicator */}
                    <div className="w-full flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-extrabold tracking-tight">{slot.id}</span>
                      {isUser ? (
                        <span className="text-[9px] bg-white text-blue-900 font-extrabold px-1.5 py-0.2 rounded-full shadow-2xs">
                          YOU
                        </span>
                      ) : (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            slot.status === 'AVAILABLE'
                              ? 'bg-emerald-500'
                              : slot.status === 'OCCUPIED'
                              ? 'bg-slate-400'
                              : slot.status === 'RESERVED'
                              ? 'bg-purple-500'
                              : 'bg-amber-500'
                          }`}
                        />
                      )}
                    </div>

                    {/* Center Icon */}
                    <div className="my-1 transition-transform duration-200 group-hover:scale-110">
                      {zone.key === 'C' && slot.status === 'AVAILABLE' ? (
                        <Zap className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Car
                          className={`w-5 h-5 ${
                            isUser
                              ? 'text-white'
                              : slot.status === 'OCCUPIED'
                              ? 'text-slate-500'
                              : slot.status === 'AVAILABLE'
                              ? 'text-emerald-600'
                              : slot.status === 'RESERVED'
                              ? 'text-purple-600'
                              : 'text-amber-600'
                          }`}
                        />
                      )}
                    </div>

                    {/* Bottom Status label */}
                    <div className="w-full text-center">
                      <span
                        className={`text-[9.5px] uppercase font-bold tracking-wider ${
                          isUser
                            ? 'text-blue-100'
                            : slot.status === 'AVAILABLE'
                            ? 'text-emerald-700'
                            : slot.status === 'OCCUPIED'
                            ? 'text-slate-600'
                            : slot.status === 'RESERVED'
                            ? 'text-purple-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {isUser ? 'My Vehicle' : slot.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Interactive Slot Detail Modal */}
      <Modal
        isOpen={!!activeModalSlot}
        onClose={() => setActiveModalSlot(null)}
        title={`Bay Telemetry: ${activeModalSlot?.id}`}
        subtitle={`Zone ${activeModalSlot?.zone} • ${activeModalSlot?.type || 'Standard Bay'}`}
      >
        {activeModalSlot && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-slate-600 font-semibold">Sensor Status:</span>
              <StatusBadge status={activeModalSlot.status} />
            </div>

            <div className="space-y-2 border border-slate-200/80 rounded-2xl p-4 bg-white shadow-2xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Vehicle Identifier:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {activeModalSlot.vehicle || 'None (Bay Vacant)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Active Session ID:</span>
                <span className="font-mono font-semibold text-slate-700">
                  {activeModalSlot.session || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Occupancy Ingress Time:</span>
                <span className="text-slate-800 font-medium">
                  {activeModalSlot.entryTime || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-medium">Sensor Loop Mesh:</span>
                <span className="text-slate-700 font-mono font-medium">Dual Ultrasonic + RFID Ground Loop</span>
              </div>
            </div>

            {activeModalSlot.note && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-[11px] flex items-center gap-2">
                <Wrench className="w-4 h-4 shrink-0 text-amber-600" />
                <span><strong>Maintenance Note:</strong> {activeModalSlot.note}</span>
              </div>
            )}

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Automated loop sensors constantly verify physical presence against active sessions in the database, preventing unauthorized occupancy and tag spoofing.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
