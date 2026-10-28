import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Radio, Car, User, Mail, Phone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: 'Balamurugan S.',
    email: 'svbalamurugan@engg.edu',
    phone: '+91 98401 23456',
    vehicleNumber: 'TN-09-BK-4821',
    model: 'Honda CB350 H\'ness',
    type: 'Two-Wheeler',
    color: 'Pearl Night Black',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: 'password123', // In production, use a separate password field
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigate('/login');
  };

  return (
    <main id="main-content" className="min-h-[100dvh] bg-slate-50 flex flex-col justify-center items-center p-4">
      <a href="#main-content" className="skip-link">Skip to registration</a>
      <div className="w-full max-w-lg">
        <div className="text-left mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-blue-600 text-white mb-3">
            <Radio className="w-6 h-6" strokeWidth={1.8} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Register Vehicle & RFID Credential
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Enroll your vehicle for automated smart bay parking and token retrieval
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Vehicle Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Plate #</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TN-09-BK-4821"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      className="w-full font-mono uppercase text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Model</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Honda CB350 / Nexon EV"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                    >
                      <option value="Two-Wheeler">Two-Wheeler (Zone A)</option>
                      <option value="Four-Wheeler">Four-Wheeler Standard (Zone B)</option>
                      <option value="Four-Wheeler (EV)">Four-Wheeler EV (Zone C)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Upon submission, an RFID tag identifier is mapped to your vehicle. Physical tag pairing will occur at Gate 1 Verification Kiosk.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Registering...' : 'Complete Vehicle Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Vehicle Enrolled Successfully!</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Vehicle <strong>{formData.vehicleNumber}</strong> has been assigned digital parking credential identifier and is ready for automated RFID entry.
              </p>
              <button
                onClick={handleFinish}
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-medium">
            Sign In to Account
          </Link>
        </div>
      </div>
    </main>
  );
};
