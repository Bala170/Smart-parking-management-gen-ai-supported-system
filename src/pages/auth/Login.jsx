import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Radio, Lock, Mail, Phone, ShieldCheck, ArrowRight, Sparkles, Key, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const [loginMode, setLoginMode] = useState('password');
  const [identifier, setIdentifier] = useState('svbalamurugan@engg.edu');
  const [password, setPassword] = useState('password123');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const role = identifier.includes('admin') ? 'admin' : 'user';
      await login({ identifier, password, role });
      navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please provide registered mobile number');
      return;
    }
    setOtpSent(true);
    setError('');
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ identifier, otp, role: 'user' });
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (roleType) => {
    login({ role: roleType });
    navigate(roleType === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  };

  return (
    <main id="main-content" className="min-h-[100dvh] bg-slate-50 flex flex-col justify-center items-center p-4">
      <a href="#main-content" className="skip-link">Skip to sign in</a>
      <div className="w-full max-w-md">
        <div className="text-left mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-blue-600 text-white mb-4">
            <Radio className="w-6 h-6" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Parkwise
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-sm leading-relaxed">
            Smart parking near busy public destinations
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7">
          <div className="flex border-b border-slate-100 mb-6 gap-2">
            <button
              onClick={() => { setLoginMode('password'); setError(''); }}
              className={'flex-1 pb-3 text-xs font-bold text-center transition-all cursor-pointer ' + (
                loginMode === 'password'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              Password Login
            </button>
            <button
              onClick={() => { setLoginMode('otp'); setError(''); }}
              className={'flex-1 pb-3 text-xs font-bold text-center transition-all cursor-pointer ' + (
                loginMode === 'otp'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              Login with OTP
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loginMode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email or Registered Mobile
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-blue-600 font-medium">
                    Demo: password123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-slate-600 font-medium cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono font-bold transition-all"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-500/20"
                >
                  Send OTP Code
                </button>
              ) : (
                <form onSubmit={handleOtpLogin} className="space-y-4">
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-2xl text-[11px] text-blue-900">
                    OTP sent to registered number. <em>(Demo code: <strong>123456</strong> or <strong>482915</strong>)</em>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      6-Digit Security OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="482915"
                      className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-7 pt-5 border-t border-slate-100">
            <span className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              One-Click Evaluation Accounts
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => demoLogin('user')}
                className="p-3 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 border border-slate-200/80 rounded-2xl text-left cursor-pointer transition-all active:scale-95 shadow-2xs group"
              >
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Vehicle Owner</span>
                </div>
                <div className="text-[10.5px] text-slate-500 mt-0.5 truncate">Balamurugan S.</div>
              </button>
              <button
                type="button"
                onClick={() => demoLogin('admin')}
                className="p-3 bg-slate-50 hover:bg-amber-50/50 hover:border-amber-200 border border-slate-200/80 rounded-2xl text-left cursor-pointer transition-all active:scale-95 shadow-2xs group"
              >
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Admin Operator</span>
                </div>
                <div className="text-[10.5px] text-slate-500 mt-0.5 truncate">Command Center</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          <span>Need a new vehicle RFID tag? </span>
          <Link to="/register" className="text-blue-400 hover:text-blue-300 hover:underline font-bold">
            Register Vehicle & Portal Account
          </Link>
        </div>
      </div>
    </main>
  );
};
