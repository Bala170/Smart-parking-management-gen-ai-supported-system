import React from 'react';
import { CreditCard, Download, TrendingUp, DollarSign, Receipt, ArrowUpRight } from 'lucide-react';
import { paymentTransactions } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export const AdminPayments = () => {
  const { showToast } = useNotifications();

  const handleExport = () => {
    showToast('Revenue audit report exported', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Tariff Collections & Revenue Audit</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated entry, FASTag reconciliation, and public parking tariffs
          </p>
        </div>

        <button
          onClick={handleExport}
          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Revenue Ledger</span>
        </button>
      </div>

      {/* Tariffs Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Zone A (Two-Wheeler)</span>
          <div className="text-2xl font-bold text-slate-900">₹20 / hr</div>
          <p className="text-xs text-slate-500">First 30 minutes complimentary</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Zone B (Four-Wheeler)</span>
          <div className="text-2xl font-bold text-slate-900">₹40 / hr</div>
          <p className="text-xs text-slate-500">Cap at ₹240/day max</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Zone C (EV Fast Charge)</span>
          <div className="text-2xl font-bold text-slate-900">₹50 / hr</div>
          <p className="text-xs text-slate-500">Includes 7.4kW AC smart charging</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Settled Tolling Transactions</h3>
          <span className="text-xs text-slate-500 font-medium">Auto-synced with Gate Barrier Controller</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Vehicle Plate</th>
                <th className="py-3 px-4">Settlement Channel</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{tx.id}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{tx.sessionId}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{tx.vehicle}</td>
                  <td className="py-3.5 px-4 text-slate-700">{tx.method}</td>
                  <td className="py-3.5 px-4 text-slate-500">{tx.date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{tx.amount}.00</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-right">{tx.receiptNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
