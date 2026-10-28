import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  Car,
  Lock,
  RefreshCw,
  AlertTriangle,
  QrCode,
  Printer
} from 'lucide-react';
import { recoveryService } from '../../services/recoveryService';
import { QRCodeCard } from '../../components/common/QRCodeCard';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { useNotifications } from '../../context/NotificationContext';

export const LostTokenRecovery = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState('TN-09-BK-4821');
  const [mobileNumber, setMobileNumber] = useState('+91 98401 23456');
  const [sessionData, setSessionData] = useState(null);

  const [otp, setOtp] = useState('482915');
  const [otpVerificationToken, setOtpVerificationToken] = useState(null);

  const [recoveryCredential, setRecoveryCredential] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useNotifications();

  // STEP 1: Identify Session
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await recoveryService.identifySession(vehicleNumber, mobileNumber);
      setSessionData(res);
      await recoveryService.sendOtp(mobileNumber);
      showToast('OTP sent to registered mobile number', 'info');
      setCurrentStep(2);
    } catch (err) {
      setError(err.message || 'Unable to locate session. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await recoveryService.verifyOtp(otp);
      setOtpVerificationToken(res.verificationToken);
      showToast('Multi-Factor OTP Verified successfully', 'success');
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || 'Invalid OTP code. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await recoveryService.sendOtp(mobileNumber);
      showToast('New OTP dispatched to mobile number', 'info');
    } catch (err) {
      showToast('Failed to resend OTP', 'error');
    }
  };

  // STEP 3: Confirm Vehicle and Proceed to Generate
  const handleStep3Confirm = async () => {
    setLoading(true);
    setError('');

    try {
      const cred = await recoveryService.generateRecoveryCredential(otpVerificationToken);
      setRecoveryCredential(cred);
      setCurrentStep(4);
      showToast('Recovery credential generated', 'success');
    } catch (err) {
      setError(err.message || 'Credential issuance failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setSessionData(null);
    setOtpVerificationToken(null);
    setRecoveryCredential(null);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Recover Your Parking Token
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure lost-token recovery via identity challenge and emergency credential issuance
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-5 border-t border-slate-100">
          {[
            { step: 1, label: 'Identify' },
            { step: 2, label: 'MFA OTP' },
            { step: 3, label: 'Verify' },
            { step: 4, label: 'Credential' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === item.step
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : currentStep > item.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > item.step ? <CheckCircle2 className="w-4.5 h-4.5" /> : item.step}
              </div>
              <span className={`text-[10.5px] mt-2 font-semibold ${
                currentStep === item.step ? 'text-blue-700 font-extrabold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Identify */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">STEP 1: Identify Parking Session</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide vehicle license plate number and registered owner mobile phone
            </p>
          </div>

          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vehicle Registration Plate #
              </label>
              <div className="relative">
                <Car className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="TN-09-BK-4821"
                  className="w-full font-mono uppercase pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-bold transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Registered Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98401 23456"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono font-bold transition-all"
                />
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-2xl text-[11px] text-blue-900 leading-relaxed shadow-2xs">
              Identity challenge ensures physical vehicle release cannot be unauthorizedly claimed by third parties.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Locating Active Session...' : 'Verify Session & Send OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: OTP Verification */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">STEP 2: Multi-Factor OTP Verification</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the 6-digit one-time authorization code sent to {sessionData?.maskedMobile}
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 shadow-2xs">
            Demo project challenge: enter <strong>482915</strong> or <strong>123456</strong>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                6-Digit Security OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="482915"
                className="w-full text-center tracking-widest text-xl font-mono font-extrabold py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend OTP</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Change mobile number
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Validating Token...' : 'Verify OTP & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: Vehicle Verification */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">STEP 3: Confirm Vehicle & Session Match</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review verified session attributes before generating single-use emergency credential
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-400 font-medium">Vehicle Registration:</span>
              <span className="font-mono font-extrabold text-slate-900 text-sm">TN-09-BK-4821</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-400 font-medium">Vehicle Model:</span>
              <span className="font-semibold text-slate-800">Honda CB350 H'ness</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-400 font-medium">Occupied Slot / Bay:</span>
              <span className="font-extrabold text-blue-700 font-sans">A-12 (Zone A)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-400 font-medium">Active Session ID:</span>
              <span className="font-mono font-semibold text-slate-700">{sessionData?.sessionId || 'PS-2026-00124'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-medium">Authorization Proof:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                MFA Identity Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all active:scale-95 cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleStep3Confirm}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Issuing Credential...' : 'Issue Emergency Retrieval Credential'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Credential Display */}
      {currentStep === 4 && recoveryCredential && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/25">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-extrabold text-emerald-950">
              “Your parking retrieval credential has been securely generated.”
            </h3>
            <p className="text-xs text-emerald-800 mt-1">
              Present this single-use credential to the Gate 2 automated scanner to complete retrieval.
            </p>
          </div>

          {/* QR and countdown */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04)] text-center space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Emergency Single-Use Pass
              </span>
              <CountdownTimer targetDate={recoveryCredential.expirationTime} initialMinutes={60} />
            </div>

            <QRCodeCard
              value={recoveryCredential.qrPayload}
              title="Emergency Retrieval Credential"
              tokenId={recoveryCredential.recoveryToken}
              vehicleNumber={recoveryCredential.vehicleNumber}
              slot={recoveryCredential.slot}
              validUntil={recoveryCredential.expirationTime}
            />

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={resetFlow}
                className="text-xs text-slate-500 font-semibold hover:underline cursor-pointer"
              >
                Perform another recovery
              </button>
              <button
                onClick={() => window.print()}
                className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                Print Emergency Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
