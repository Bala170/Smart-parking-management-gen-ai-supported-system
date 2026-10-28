import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Building, ShieldCheck } from 'lucide-react';
import { currentUser } from '../../data/mockData';

export const AdminUsers = () => {
  const [users] = useState([
    currentUser,
    {
      id: "USR-0044",
      name: "Senthil Kumar V.",
      email: "senthil.k@engg.edu",
      phone: "+91 98840 11992",
      role: "user",
      department: "Dept. of Mechanical Engineering",
      institution: "Public Parking Network",
      registeredVehiclesCount: 1,
      walletBalance: 280,
    },
    {
      id: "USR-0104",
      name: "Kavitha R.",
      email: "kavitha.r@engg.edu",
      phone: "+91 97910 44556",
      role: "user",
      department: "Dept. of Electrical Engineering",
      institution: "Public Parking Network",
      registeredVehiclesCount: 1,
      walletBalance: 520,
    },
    {
      id: "USR-0021",
      name: "Anand M.",
      email: "anand.m@engg.edu",
      phone: "+91 94441 22334",
      role: "user",
      department: "Dept. of Information Technology",
      institution: "Public Parking Network",
      registeredVehiclesCount: 2,
      walletBalance: 140,
    }
  ]);
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Registered Drivers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty, staff and student profiles authorized for automated smart parking privileges
          </p>
        </div>

        <span className="text-xs font-mono font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-200">
          {users.length} Active Accounts
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student/staff name, ID, or email..."
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
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Institutional Email</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Vehicles</th>
                <th className="py-3 px-4">Wallet Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{u.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{u.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{u.phone}</td>
                  <td className="py-3.5 px-4 text-slate-700">{u.department}</td>
                  <td className="py-3.5 px-4 font-medium text-blue-700">{u.registeredVehiclesCount} Registered</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">₹{u.walletBalance}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
