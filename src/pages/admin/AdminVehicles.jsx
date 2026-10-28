import React, { useState } from 'react';
import { Car, Search, Filter, Radio, ShieldCheck, Download, Plus } from 'lucide-react';
import { initialVehicles } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([
    ...initialVehicles,
    {
      id: "VEH-04",
      vehicleNumber: "TN-01-AX-1002",
      model: "Ather 450X (EV)",
      type: "Two-Wheeler (EV)",
      color: "Space Grey",
      rfidTag: "RFID-1122-3344",
      rfidStatus: "Active",
      registrationDate: "2024-11-20",
      parkingStatus: "Parked",
      slot: "A-01",
    },
    {
      id: "VEH-05",
      vehicleNumber: "TN-14-AK-7112",
      model: "Toyota Innova Crysta",
      type: "Four-Wheeler",
      color: "Super White",
      rfidTag: "RFID-9901-8822",
      rfidStatus: "Active",
      registrationDate: "2025-02-14",
      parkingStatus: "Idle",
      slot: null,
    }
  ]);
  const [search, setSearch] = useState('');

  const filtered = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.rfidTag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Perimeter Vehicle Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central database of RFID transponders mapped to institutional vehicle permits
          </p>
        </div>

        <span className="text-xs font-mono font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-200">
          {vehicles.length} Enrolled Vehicles
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by vehicle plate, model, or RFID transponder ID..."
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
                <th className="py-3 px-4">Vehicle ID</th>
                <th className="py-3 px-4">Plate #</th>
                <th className="py-3 px-4">Model & Make</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Assigned RFID Transponder</th>
                <th className="py-3 px-4">RFID Status</th>
                <th className="py-3 px-4">Parking State</th>
                <th className="py-3 px-4">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{v.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{v.vehicleNumber}</td>
                  <td className="py-3.5 px-4 text-slate-700">{v.model}</td>
                  <td className="py-3.5 px-4 text-slate-600">{v.type}</td>
                  <td className="py-3.5 px-4 font-mono text-blue-700 font-bold">{v.rfidTag}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={v.rfidStatus} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={v.parkingStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{v.registrationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
