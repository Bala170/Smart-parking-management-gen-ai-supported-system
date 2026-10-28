import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  Download,
  Share2,
  KeyRound,
  Clock,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Radio,
  Car
} from 'lucide-react';
import { tokenService } from '../../services/tokenService';
import { QRCodeCard } from '../../components/common/QRCodeCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';

export const DigitalToken = () => {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQrExpanded, setShowQrExpanded] = useState(true);
  const { showToast } = useNotifications();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const data = await tokenService.getDigitalToken('PS-2026-00124');
        setTokenData(data);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Parking Retrieval Token',
        text: `Digital Retrieval Token for ${tokenData.vehicleNumber}: ${tokenData.tokenId}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Digital Token ${tokenData.tokenId} for Vehicle ${tokenData.vehicleNumber}`);
      showToast('Token link copied to clipboard', 'info');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs font-semibold text-slate-500">Generating cryptographic digital pass...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">DIGITAL PARKING CREDENTIAL</h1>
            <StatusBadge status={tokenData.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic single-use retrieval credential signed by Gate 1 RFID entry node
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrExpanded(!showQrExpanded)}
            className="py-2.5 px-3.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>{showQrExpanded ? 'Hide QR' : 'Show QR'}</span>
          </button>
          <button
            onClick={handleShare}
            className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <Link
            to="/user/recovery"
            className="py-2.5 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>Recover Token</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Token Card / QR Visual (md:col-span-5) */}
        <div className="md:col-span-5">
          {showQrExpanded && (
            <QRCodeCard
              value={tokenData.qrPayload}
              title="Digital Parking Credential"
              tokenId={tokenData.tokenId}
              vehicleNumber={tokenData.vehicleNumber}
              slot={tokenData.parkingSlot}
              validUntil={tokenData.validUntil}
              status={tokenData.status}
            />
          )}
        </div>

        {/* Detailed Metadata (md:col-span-7) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.02)] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
              Credential Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Token ID:</span>
                <span className="font-mono font-bold text-slate-900">{tokenData.tokenId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Session ID:</span>
                <span className="font-mono font-semibold text-slate-700">{tokenData.sessionId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Vehicle License Plate:</span>
                <span className="font-extrabold text-slate-900 font-mono">{tokenData.vehicleNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Make & Model:</span>
                <span className="font-semibold text-slate-800">{tokenData.vehicleModel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Allocated Parking Bay:</span>
                <span className="font-extrabold text-blue-700 font-sans">{tokenData.parkingSlot}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Entry Timestamp:</span>
                <span className="text-slate-800 font-medium">{tokenData.issueTimestamp}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Validity Window:</span>
                <span className="text-amber-800 font-bold">Until 06:00 PM Today</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-medium">Cryptographic Hash:</span>
                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]">{tokenData.securityFingerprint}</span>
              </div>
            </div>

            {/* Instruction box */}
            <div className="p-4 bg-blue-50/80 border border-blue-200/90 rounded-2xl text-xs text-blue-900 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-bold">
                <Info className="w-4 h-4 text-blue-700 shrink-0" />
                <span>“Use this digital token for authorized vehicle retrieval.”</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800">
                When approaching the Gate 2 exit portal, present the digital QR code to the barrier scanner. Once verified alongside vehicle physical loop presence and payment settlement, the automated gate will lift.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200/90 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">System Security Notice:</span>
            <p className="leading-relaxed">
              This digital token is tied directly to your active parking session in the database. Tokens cannot be reused after gate exit. If lost or compromised, immediately use the Lost Token Recovery workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
