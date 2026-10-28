import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Clock,
  CreditCard,
  Radio,
  QrCode,
  KeyRound,
  UserCheck,
  History,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Flame,
  Sparkles,
  Zap,
  MapPin, Bus, Train, Search, Hospital, Trees, Building2
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { parkingService } from '../../services/parkingService';
import { ParkingSlotGrid } from '../../components/parking/ParkingSlotGrid';
import { PageSkeleton } from '../../components/common/PageSkeleton';

export const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSession, setActiveSession] = useState(null);
  const [parkingStats, setParkingStats] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placeFilter, setPlaceFilter] = useState('All destinations');
  const [placeSearch, setPlaceSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const publicPlaces = [
    { name: 'Central Bus Terminal', short: 'Intercity transit', kind: 'Bus terminal', icon: Bus, free: 42, total: 180, access: 'Local and intercity buses', rate: '₹20 / hr', crowd: 'Busy' },
    { name: 'City Railway Junction', short: 'Rail transit', kind: 'Railway station', icon: Train, free: 18, total: 120, access: 'Regional and long-distance trains', rate: '₹30 / hr', crowd: 'High demand' },
    { name: 'Central Market District', short: 'Shopping area', kind: 'Market', icon: MapPin, free: 27, total: 96, access: 'Retail, shops and street market', rate: '₹25 / hr', crowd: 'Busy' },
    { name: 'Riverside Public Park', short: 'Parks & recreation', kind: 'Park', icon: Trees, free: 64, total: 150, access: 'Park and recreation grounds', rate: '₹15 / hr', crowd: 'Moderate' },
    { name: 'Regional Medical Centre', short: 'Healthcare', kind: 'Hospital', icon: Hospital, free: 31, total: 110, access: 'Hospital and visitor parking', rate: '₹20 / hr', crowd: 'Busy' },
    { name: 'Civic Exhibition Grounds', short: 'Events & civic venues', kind: 'Event venue', icon: Building2, free: 86, total: 240, access: 'Exhibition, stadium and event access', rate: '₹25 / hr', crowd: 'Moderate' },
  ];
  const visiblePlaces = publicPlaces.filter((place) =>
    (placeFilter === 'All destinations' || place.kind === placeFilter) &&
    `${place.name} ${place.short} ${place.kind}`.toLowerCase().includes(placeSearch.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [session, stats, slotList] = await Promise.all([
          parkingService.getActiveSession(),
          parkingService.getParkingStatus(),
          parkingService.getParkingSlots(),
        ]);
        setActiveSession(session);
        setParkingStats(stats);
        setSlots(slotList);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <PageSkeleton label="Loading parking availability and session details" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {user.name}
            </h1>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              RFID Node Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Find a space before you reach a busy public destination.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/user/token"
            className="flex items-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital Token QR</span>
          </Link>
          <Link
            to="/user/recovery"
            className="flex items-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <KeyRound className="w-4 h-4" />
            <span>Recover Token</span>
          </Link>
        </div>
      </div>

      {/* Public destination parking finder */}
      <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-12">
        <div className="bg-blue-700 px-6 py-7 text-white sm:px-8 lg:col-span-4 lg:py-8">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Public place parking</div>
          <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">Park near where life happens.</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-blue-100">Compare parking near transit, markets, parks, hospitals and event venues.</p>
          <label className="mt-6 flex min-w-0 items-center gap-2.5 rounded-xl border border-white/25 bg-white px-3.5 py-3 text-sm text-slate-700 focus-within:ring-2 focus-within:ring-white/60">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input aria-label="Search public parking destinations" value={placeSearch} onChange={(event) => setPlaceSearch(event.target.value)} placeholder="Search destinations" className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-500" />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {['All destinations', 'Bus terminal', 'Railway station', 'Market', 'Park', 'Hospital', 'Event venue'].map((filter) => (
              <button key={filter} onClick={() => setPlaceFilter(filter)} aria-pressed={placeFilter === filter} className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${placeFilter === filter ? 'border-white bg-white text-blue-800' : 'border-white/35 text-white hover:bg-white/10'}`}>{filter}</button>
            ))}
          </div>
          <div className="mt-7 border-t border-white/20 pt-4 text-[11px] leading-relaxed text-blue-100">Sample project availability · No booking is made from this preview.</div>
        </div>
        <div className="px-5 py-5 sm:px-7 lg:col-span-8 lg:px-8">
          <div className="mb-2 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Destination board</p><h3 className="mt-1 text-base font-bold text-slate-900">Public parking locations</h3></div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Illustrative sample</span>
          </div>
          <div className="divide-y divide-slate-200">
          {visiblePlaces.map((place) => {
            const PlaceIcon = place.icon;
            const availability = Math.round((place.free / place.total) * 100);
            const active = selectedPlace === place.name;
            return <article key={place.name} className={`grid gap-3 py-4 transition sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${active ? 'bg-blue-50/60' : ''}`}>
              <div className="flex min-w-0 items-center gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}`}><PlaceIcon className="h-5 w-5" /></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{place.short} · {place.kind}</p><h4 className="mt-0.5 truncate text-sm font-bold text-slate-900">{place.name}</h4><p className="mt-0.5 text-[11px] text-slate-500">{place.access} · {place.total} bays · {place.crowd}</p></div></div>
              <div className="flex items-center justify-between gap-4 pl-[52px] sm:justify-end sm:pl-0"><div className="min-w-[105px]"><div className="flex items-baseline gap-1"><span className="text-xl font-extrabold tracking-tight text-slate-900">{place.free}</span><span className="text-[11px] text-slate-500">free</span></div><div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${availability}%` }} /></div></div><span className="w-[70px] text-right text-[11px] font-semibold text-slate-600">{place.rate}</span><button onClick={() => setSelectedPlace(active ? null : place.name)} aria-pressed={active} className={`min-w-[82px] rounded-lg px-3 py-2 text-[11px] font-bold transition active:scale-[0.98] ${active ? 'bg-blue-100 text-blue-800' : 'bg-slate-900 text-white hover:bg-slate-700'}`}>{active ? 'Selected' : 'Select'}</button></div>
            </article>;
          })}
          {visiblePlaces.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No destinations match “{placeSearch}”. Try another search or category.</p>}
          </div>
        </div>
        {selectedPlace && <div className="border-t border-blue-100 bg-blue-50 px-5 py-3 text-xs font-medium text-blue-900 lg:col-span-12">{selectedPlace} selected · this preview does not create a reservation.</div>}
      </section>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Parking Bay"
          value={activeSession ? `Bay ${activeSession.parkingSlot}` : 'None'}
          subtitle={activeSession ? 'Parked in Zone A (Two-Wheeler)' : 'No ongoing session'}
          icon={Radio}
          badgeText={activeSession ? 'Active Session' : 'Idle'}
          className={activeSession ? 'border-blue-200/90 bg-blue-50/20' : ''}
        />
        <StatCard
          title="Current Vehicle"
          value={activeSession?.vehicleNumber || 'TN-09-BK-4821'}
          subtitle={activeSession?.vehicleModel || 'Honda CB350 H\'ness'}
          icon={Car}
        />
        <StatCard
          title="Parking Duration"
          value={activeSession ? '2h 22m' : '0m'}
          subtitle="Ingress recorded at 08:15 AM today"
          icon={Clock}
        />
        <StatCard
          title="Accrued Parking Fee"
          value={activeSession ? `₹${activeSession.currentFee}.00` : '₹0.00'}
          subtitle="Tariff Rate: ₹20 / hr (Tier A)"
          icon={CreditCard}
        />
      </div>

      {/* Main Grid: Active Session + Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Active Parking Session (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Parking Telemetry</h3>
                  <p className="text-xs text-slate-400 font-mono">Session: {activeSession.sessionId}</p>
                </div>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Vehicle License Plate</span>
                <span className="font-extrabold text-slate-900 text-sm font-mono">{activeSession.vehicleNumber}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Make & Model</span>
                <span className="font-semibold text-slate-800">{activeSession.vehicleModel}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Assigned Parking Bay</span>
                <span className="font-extrabold text-blue-700 text-sm font-sans">{activeSession.parkingSlot} ({activeSession.zone})</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">RFID Hardware Tag</span>
                <span className="font-mono text-slate-700 font-semibold">{activeSession.rfidTag}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Gate 1 Ingress Time</span>
                <span className="text-slate-800 font-medium">{activeSession.formattedEntryTime}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Digital Token State</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeSession.digitalTokenStatus} ({activeSession.digitalTokenId})
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Multi-Factor Retrieval Engine enabled for this active session</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/user/token"
                className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                View Credential QR
              </Link>
              <Link
                to="/user/payments"
                className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                Pay Fee (₹{activeSession.currentFee})
              </Link>
            </div>
          </div>
        </div>

        {/* Section B: Quick Operations (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 tracking-tight">
              Quick Operations
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Authorized retrieval & security delegation workflows
            </p>

            <div className="space-y-2.5">
              <Link
                to="/user/token"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-xs font-semibold text-slate-800 group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span>View Digital Token</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/user/recovery"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/30 transition-all text-xs font-semibold text-slate-800 group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <span>Recover Lost Token</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/user/delegation"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-xs font-semibold text-slate-800 group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span>Delegate Vehicle Retrieval</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/user/payments"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/30 transition-all text-xs font-semibold text-slate-800 group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span>Make Parking Payment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/user/history"
              className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>Inspect full parking session history →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Section C: Live public parking occupancy */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Live public parking occupancy</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sensor monitored bays across connected public locations</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">Total: <strong>{parkingStats?.total}</strong> Bays</span>
            <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Available: <strong>{parkingStats?.available}</strong></span>
            <span className="text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">Occupied: <strong>{parkingStats?.occupied}</strong></span>
            <span className="text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">Reserved: <strong>{parkingStats?.reserved}</strong></span>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex mb-6 p-0.5 shadow-inner">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 shadow-2xs"
            style={{ width: `${parkingStats?.occupancyPercentage}%` }}
            title={`Occupied: ${parkingStats?.occupancyPercentage}%`}
          />
          <div
            className="bg-purple-400 h-full rounded-full transition-all duration-500 ml-1"
            style={{ width: `${Math.round(((parkingStats?.reserved || 0) / (parkingStats?.total || 1)) * 100)}%` }}
            title="Reserved"
          />
        </div>

        {/* Visual Slots Grid preview */}
        <ParkingSlotGrid slots={slots} showInteractive={true} selectedSlotId="A12" />
      </div>

      {/* Section D: Recent Activity Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Retrieval & Security Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tamper-evident audit timeline for registered vehicles</p>
          </div>
          <Link to="/user/history" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
            View All History →
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5 text-xs p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 shadow-2xs">
              <Radio className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Vehicle Entry via Gate 1 RFID Reader</span>
                <span className="text-slate-400 text-[10.5px] font-mono">Today, 08:15 AM</span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Honda CB350 (TN-09-BK-4821) allocated Bay A-12. Session PS-2026-00124 generated.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 text-xs p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Digital Token DTK-88219-X9 Activated</span>
                <span className="text-slate-400 text-[10.5px] font-mono">Today, 08:16 AM</span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Dynamic QR credential generated for multi-factor vehicle retrieval validation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 text-xs p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 shadow-2xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Delegated Retrieval Pass DEL-2026-0941 Created</span>
                <span className="text-slate-400 text-[10.5px] font-mono">Today, 09:30 AM</span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Authorized Arun Kumar M. (+91 94441 87654) with 4-hour window and OTP verification challenge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

