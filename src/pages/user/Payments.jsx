import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  Wallet,
  CheckCircle2,
  Clock,
  Car,
  Receipt,
  Download,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { activeParkingSession, currentUser } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState('UPI'); // 'UPI', 'CARD', 'WALLET'
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const { showToast } = useNotifications();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const list = await paymentService.getTransactions();
    setTransactions(list);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await paymentService.processPayment({
        amount: activeParkingSession.currentFee,
        method: selectedMethod === 'UPI' ? 'Instant UPI (Auto-Clearing)' : selectedMethod === 'WALLET' ? 'Digital Wallet' : 'Credit/Debit Card (RuPay)',
        vehicle: activeParkingSession.vehicleNumber,
        sessionId: activeParkingSession.sessionId,
      });

      setPaymentSuccess(res.transaction);
      showToast('Payment settled! Gate barrier exit authorization logged.', 'success');
      loadTransactions();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)]">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Parking Fee & Settlements</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pay parking charges via UPI, FASTag auto-debit, or digital wallet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Due Fee & Payment Interface (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Active Parking Session Due
                </span>
                <span className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums mt-0.5 block">
                  ₹{activeParkingSession.currentFee}.00
                </span>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/90 rounded-full text-xs font-bold shadow-2xs">
                Payment Pending
              </span>
            </div>

            {/* Session attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Vehicle Plate:</span>
                <span className="font-mono font-bold text-slate-900">{activeParkingSession.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Parking Bay:</span>
                <span className="font-extrabold text-blue-700 font-sans">{activeParkingSession.parkingSlot}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Duration:</span>
                <span className="text-slate-800 font-medium">2h 22m (Ongoing)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Session ID:</span>
                <span className="font-mono font-semibold text-slate-700">{activeParkingSession.sessionId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Tariff Rate:</span>
                <span className="text-slate-700 font-medium">₹{activeParkingSession.hourlyRate}/hr</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Exit Gateway:</span>
                <span className="text-slate-800 font-medium">Gate 2 Automated</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2.5">
                Select Settlement Channel:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode, desc: 'Instant UPI Intent' },
                  { id: 'CARD', label: 'Card', icon: CreditCard, desc: 'Debit / RuPay' },
                  { id: 'WALLET', label: 'Digital Wallet', icon: Wallet, desc: `Bal: ₹${currentUser.walletBalance}` },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
                        selectedMethod === m.id
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-2 ${selectedMethod === m.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div className="font-bold text-xs text-slate-900">{m.label}</div>
                      <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5 truncate">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Confirmation Box */}
            {paymentSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Payment Succeeded! Receipt #{paymentSuccess.receiptNo}</span>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Amount <strong>₹{paymentSuccess.amount}.00</strong> cleared via {paymentSuccess.method}. Exit clearance transmitted to Gate 2 boom barrier.
                </p>
              </div>
            ) : (
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>{isProcessing ? 'Authorizing Transaction...' : `Confirm & Settle ₹${activeParkingSession.currentFee}.00`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="text-[11px] text-slate-400 text-center leading-relaxed">
              Payments are simulated for demonstration. Full gateway integration with Razorpay/UPI ready in FastAPI backend.
            </div>
          </div>
        </div>

        {/* Transaction History (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4 tracking-tight">
              Recent Invoices & Receipts
            </h3>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs space-y-1.5 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{tx.id}</span>
                    <span className="font-extrabold text-slate-900 font-sans tabular-nums text-sm">₹{tx.amount}.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{tx.date}</span>
                    <StatusBadge status={tx.status} />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between pt-1.5 border-t border-slate-200/60 font-mono">
                    <span>{tx.method}</span>
                    <span>{tx.receiptNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => showToast('Statement download initiated', 'info')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Monthly Statement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
