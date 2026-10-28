import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Camera, RefreshCw, TriangleAlert, Wifi } from 'lucide-react';
import { monitoringService } from '../../services/monitoringService';

const demoSlots = ['A01', 'A03', 'A06', 'A09', 'A12'];

export const LiveMonitoring = () => {
  const [summary, setSummary] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [demoRunning, setDemoRunning] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextSummary, nextCameras, nextDetections] = await Promise.all([
        monitoringService.getSummary(),
        monitoringService.getCameras(),
        monitoringService.getDetections(20),
      ]);
      setSummary(nextSummary);
      setCameras(nextCameras);
      setDetections(nextDetections);
    } catch (err) {
      setError(err.message || 'Unable to load live monitoring data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  const primaryCamera = useMemo(() => cameras[0], [cameras]);

  const runDemo = async () => {
    if (!primaryCamera) return;
    setDemoRunning(true);
    setError('');
    try {
      await monitoringService.ingestDemoFrame({
        camera_id: primaryCamera.id,
        occupied_slot_codes: demoSlots,
        vehicle_plates: { A12: 'TN-09-BK-4821' },
      });
      await load();
    } catch (err) {
      setError(err.message || 'Demo ingestion failed.');
    } finally {
      setDemoRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Operations / Vision</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">Live Monitoring</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Camera health, detected vehicles, and slot trust state in one operator view.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={runDemo} disabled={demoRunning || !primaryCamera} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
            <Activity className="h-4 w-4" /> {demoRunning ? 'Processing…' : 'Run demo frame'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && !summary ? <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading monitoring telemetry…</div> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ['Occupied', summary?.occupied_slots, 'text-blue-700'],
              ['Available', summary?.available_slots, 'text-emerald-700'],
              ['Stale slots', summary?.stale_slots, 'text-amber-700'],
              ['Online cameras', `${summary?.online_cameras}/${summary?.total_cameras}`, 'text-slate-900'],
              ['Last event', summary?.last_event_at ? new Date(summary.last_event_at).toLocaleTimeString() : '—', 'text-slate-900'],
            ].map(([label, value, color]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className={`mt-2 text-2xl font-extrabold ${color}`}>{value}</p></div>)}
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-900">Camera health</h2><Camera className="h-5 w-5 text-blue-700" /></div>
              <div className="space-y-3">{cameras.length ? cameras.map((camera) => <div key={camera.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3"><div><p className="font-semibold text-slate-800">{camera.name}</p><p className="text-xs text-slate-500">{camera.camera_code}</p></div><span className={`inline-flex items-center gap-1 text-xs font-bold ${camera.status === 'ONLINE' ? 'text-emerald-700' : 'text-slate-500'}`}><Wifi className="h-3.5 w-3.5" />{camera.status}</span></div>) : <p className="text-sm text-slate-500">No cameras configured yet.</p>}</div>
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-900">Recent detections</h2><span className="text-xs text-slate-500">{detections.length} events</span></div>
              <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="pb-2">Time</th><th className="pb-2">Plate</th><th className="pb-2">Confidence</th><th className="pb-2">Source</th></tr></thead><tbody>{detections.map((event) => <tr key={event.id} className="border-b border-slate-100"><td className="py-3 text-slate-500">{new Date(event.detected_at).toLocaleTimeString()}</td><td className="py-3 font-semibold text-slate-800">{event.vehicle_plate || 'Unidentified'}</td><td className="py-3">{Math.round(event.confidence * 100)}%</td><td className="py-3 text-xs uppercase text-slate-500">{event.source}</td></tr>)}</tbody></table>{!detections.length && <p className="py-6 text-sm text-slate-500">Run the demo frame to generate a detection event.</p>}</div>
            </section>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /><p><strong>Trust rule:</strong> slots become stale when no fresh sensor or camera update arrives within 90 seconds. Stale state must be treated as unknown, not available.</p></div>
        </>
      )}
    </div>
  );
};
