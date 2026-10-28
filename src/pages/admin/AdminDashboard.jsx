import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Radio,
  Grid3X3,
  CreditCard,
  UserCheck,
  KeyRound,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { adminService } from '../../services/adminService';
import { parkingService } from '../../services/parkingService';
import { ParkingSlotGrid } from '../../components/parking/ParkingSlotGrid';
import { PageSkeleton } from '../../components/common/PageSkeleton';

export const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [occupancyData, setOccupancyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [retrievalStats, setRetrievalStats] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [k, occ, rev, ret, s] = await Promise.all([
          adminService.getKPIs(),
          adminService.getOccupancyTrend(),
          adminService.getRevenueTrend(),
          adminService.getRetrievalStats(),
          parkingService.getParkingSlots(),
        ]);
        setKpis(k);
        setOccupancyData(occ);
        setRevenueData(rev);
        setRetrievalStats(ret);
        setSlots(s);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <PageSkeleton label="Loading public parking operations" />;
  }

  const PIE_COLORS = ['#3F6072', '#355E4D', '#668394', '#A8792F'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Public Parking Operations
            </h1>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-mono font-medium">
              Public Location Network · Demo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor occupancy, peak demand and access across transit hubs and high traffic public areas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/retrievals"
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>Gate Clearance Console</span>
          </Link>
          <Link
            to="/admin/audit-logs"
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Security Audit Logs</span>
          </Link>
        </div>
      </div>

      {/* 8 KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={kpis.totalVehiclesRegistered}
          subtitle="Across connected public sites"
          icon={Car}
        />
        <StatCard
          title="Active Sessions"
          value={kpis.activeParkingSessions}
          subtitle="Vehicles currently in bays"
          icon={Radio}
          badgeText="Live"
          className="border-blue-200 bg-blue-50/10"
        />
        <StatCard
          title="Available Slots"
          value={`${kpis.availableSlots} / ${kpis.totalSlots}`}
          subtitle="Across Zones A, B & C"
          icon={Grid3X3}
        />
        <StatCard
          title="Occupied Slots"
          value={kpis.occupiedSlots}
          subtitle="56% Occupancy Index"
          icon={Activity}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${kpis.todayRevenue.toLocaleString()}`}
          subtitle="+14% vs yesterday"
          icon={CreditCard}
        />
        <StatCard
          title="Active Delegations"
          value={kpis.activeDelegations}
          subtitle="Authorized temporary pickups"
          icon={UserCheck}
        />
        <StatCard
          title="Recovery Requests"
          value={kpis.recoveryRequestsToday}
          subtitle="Lost token MFA queries"
          icon={KeyRound}
        />
        <StatCard
          title="Security Alerts"
          value={kpis.securityAlertsActive}
          subtitle="1 Unregistered RFID tap"
          icon={ShieldAlert}
          className="border-red-200 bg-red-50/20"
        />
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Parking Occupancy Trend (Hourly) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hourly Bay Occupancy Trend</h3>
              <p className="text-xs text-slate-500">Live sensor telemetry comparing Occupied vs Available capacity</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400">Peak: 11:00 AM</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE9" />
                <XAxis dataKey="time" stroke="#75817B" fontSize={11} />
                <YAxis stroke="#75817B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE3DD', borderRadius: '8px', color: '#1E2521', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="occupied" name="Occupied Slots" stroke="#3F6072" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="available" name="Available Slots" stroke="#43815D" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Retrieval Methods Breakdown (Pie) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900">Retrieval Methods Share</h3>
              <p className="text-xs text-slate-500">Verification channels used at Gate 2</p>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={retrievalStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {retrievalStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE3DD', borderRadius: '8px', color: '#1E2521', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-3 border-t border-slate-100">
            {retrievalStats.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section Row 2: Revenue Trend + Spatial Layout Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Revenue Bar Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-4 mb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Weekly Revenue Collection</h3>
            <p className="text-xs text-slate-500">UPI, FASTag and digital wallet collections</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE9" />
                <XAxis dataKey="day" stroke="#75817B" fontSize={11} />
                <YAxis stroke="#75817B" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE3DD', borderRadius: '8px', color: '#1E2521', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#355E4D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Slot Status Overview */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bays Spatial Telemetry</h3>
              <p className="text-xs text-slate-500">Live bay sensors across the connected public network</p>
            </div>
            <Link to="/admin/parking-slots" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage Bays →
            </Link>
          </div>

          <ParkingSlotGrid slots={slots} showInteractive={true} />
        </div>
      </div>
    </div>
  );
};
