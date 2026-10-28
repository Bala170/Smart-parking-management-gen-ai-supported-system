import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Printer, ShieldCheck, Clock, Download, Sparkles, Scan } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const QRCodeCard = ({
  value,
  title = "Digital Retrieval Credential",
  tokenId,
  vehicleNumber,
  slot,
  validUntil,
  status = "ACTIVE",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useNotifications();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    showToast('Credential token copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`relative bg-white rounded-xl border border-slate-200 printable-card text-center max-w-sm mx-auto overflow-hidden ${className}`}
    >
      <div className="h-1 w-full bg-blue-600" />

      {/* Main Ticket Interior */}
      <div className="p-6">
        {/* Header Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50/80 py-1.2 px-3.5 rounded-full mb-4 w-fit mx-auto border border-blue-200/70 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>{title}</span>
        </div>

        {/* QR Scanner Container with optical corner reticles */}
        <div className="relative p-5 bg-slate-50 border border-slate-200 rounded-lg inline-block mx-auto mb-5">
          {/* Top-left corner reticle */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-blue-600 rounded-tl-xs" />
          {/* Top-right corner reticle */}
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-blue-600 rounded-tr-xs" />
          {/* Bottom-left corner reticle */}
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-blue-600 rounded-bl-xs" />
          {/* Bottom-right corner reticle */}
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-blue-600 rounded-br-xs" />

          <QRCodeSVG
            value={value}
            size={170}
            level="H"
            includeMargin={false}
            className="mx-auto rounded-md"
          />

          <div className="mt-2.5 flex items-center justify-center gap-1 text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
            <Scan className="w-3 h-3 text-blue-600" />
            <span>Gate 2 Scanner Target</span>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-slate-200" />

        {/* Token Details */}
        <div className="space-y-2 text-left bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs mb-5">
          <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/70">
            <span className="text-slate-400 font-medium text-[11px]">Token ID:</span>
            <span className="font-mono font-bold text-slate-900">{tokenId}</span>
          </div>
          {vehicleNumber && (
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/70">
              <span className="text-slate-400 font-medium text-[11px]">Vehicle Plate:</span>
              <span className="font-mono font-bold text-slate-900">{vehicleNumber}</span>
            </div>
          )}
          {slot && (
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/70">
              <span className="text-slate-400 font-medium text-[11px]">Assigned Bay:</span>
              <span className="font-bold text-blue-700 font-sans">{slot}</span>
            </div>
          )}
          {validUntil && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Valid Until:
              </span>
              <span className="font-semibold text-amber-800">
                {typeof validUntil === 'string' && validUntil.includes('T')
                  ? new Date(validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : validUntil}
              </span>
            </div>
          )}
        </div>

        {/* Actions with tactile physics */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Token'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-xs shadow-blue-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>

        <p className="mt-4 text-[10.5px] text-slate-400 leading-relaxed">
          Present at Gate 2 automated scanner. Dynamic cryptographic validation ensures tamper-proof vehicle release.
        </p>
      </div>
    </div>
  );
};
