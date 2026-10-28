import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Car, QrCode, KeyRound, UserCheck, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { parkingService } from '../../services/parkingService';
import { ParkingSlotGrid } from '../../components/parking/ParkingSlotGrid';
import { PageSkeleton } from '../../components/common/PageSkeleton';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ActiveParking = () => {
  const [session, setSession] = useState(null);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, sl, st] = await Promise.all([
        parkingService.getActiveSession(),
        parkingService.getParkingSlots(),
        parkingService.getParkingStatus(),
      ]);
      setSession(s);
      setSlots(sl);
      setStatus(st);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <PageSkeleton label="Loading active parking session" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Parking Session</h1>
              <StatusBadge status="ACTIVE" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Your vehicle is secured in <strong>Bay {session.parkingSlot}</strong> under automated RFID loop monitoring.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/user/token"
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Digital Token</span>
            </Link>
            <Link
              to="/user/delegation"
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-2xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Delegate Retrieval</span>
            </Link>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium">Vehicle License Plate</span>
            <span className="font-extrabold text-slate-900 font-mono text-sm">{session.vehicleNumber}</span>
            <span className="text-slate-500 block text-[11px] mt-0.5">{session.vehicleModel}</span>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
            <span className="text-slate-500 block text-[11px] font-medium">Assigned Parking Bay</span>
            <span className="font-extrabold text-blue-700 text-sm font-sans">{session.parkingSlot}</span>
            <span className="text-blue-900/70 block text-[11px] mt-0.5">{session.zone}</span>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium">Duration / Ingress</span>
            <span className="font-extrabold text-slate-800 text-sm font-sans">2h 22m</span>
            <span className="text-slate-500 block text-[11px] mt-0.5">{session.formattedEntryTime}</span>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-medium">Current Fee</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">₹{session.currentFee}.00</span>
            <span className="text-emerald-700 block text-[11px] font-semibold mt-0.5">Pay at Gate 2 Exit</span>
          </div>
        </div>
      </div>

      {/* Visual Spatial Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)]">
        <div className="mb-5">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Spatial Parking Grid & Bay Sensors</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive bay layout across Zones A, B, and C. Click any slot to inspect active sensor telemetry.
          </p>
        </div>
        <ParkingSlotGrid slots={slots} showInteractive={true} selectedSlotId="A12" />
      </div>
    </div>
  );
};
