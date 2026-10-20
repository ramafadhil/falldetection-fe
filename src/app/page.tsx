"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, Play, Square, Trash2, RefreshCw } from "lucide-react";

interface IncidentAlert {
  id: number;
  device_id: number;
  confidence: number;
  event_timestamp: string;
  thumbnail_path: string | null;
}

const API_BASE_URL = "http://localhost:8000";

export default function Dashboard() {
  const [alerts, setAlerts] = useState<IncidentAlert[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);

  // 1. Fetch Alert History & Detection Engine Status
  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/incident-alerts`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/detection/status`);
      if (res.ok) {
        const data = await res.json();
        setIsRunning(data.is_running);
      }
    } catch (error) {
      console.error("Error fetching engine status:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchStatus();

    // Polling data alert setiap 5 detik
    const interval = setInterval(() => {
      fetchAlerts();
      fetchStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 2. Control Camera Engine (Start / Stop)
  const handleToggleEngine = async () => {
    setLoadingAction(true);
    const endpoint = isRunning ? "/api/detection/stop" : "/api/detection/start";
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: "POST" });
      if (res.ok) {
        setIsRunning(!isRunning);
      }
    } catch (error) {
      console.error("Error toggling engine:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  // 3. Delete Alert Incident
  const handleDeleteAlert = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/incident-alerts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlerts(alerts.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <AlertTriangle className="text-amber-500 w-8 h-8" />
              Elderly Fall Detection System
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time computer vision safety monitoring & alert dashboard
            </p>
          </div>

          {/* Engine Status & Toggle Button */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 text-xs font-semibold">
              <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              {isRunning ? "ENGINE ACTIVE" : "ENGINE OFF"}
            </div>

            <button
              onClick={handleToggleEngine}
              disabled={loadingAction}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isRunning
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              } disabled:opacity-50`}
            >
              {loadingAction ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : isRunning ? (
                <>
                  <Square className="w-4 h-4 fill-current" /> Stop Camera
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Start Camera
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Alerts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-400" />
              Recent Incident Logs ({alerts.length})
            </h2>
            <button
              onClick={fetchAlerts}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/80 mx-auto mb-3" />
              <p className="font-medium text-slate-300">Tidak ada insiden terdeteksi</p>
              <p className="text-xs mt-1 text-slate-500">Sistem dalam keadaan aman</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all shadow-lg flex flex-col"
                >
                  {/* Thumbnail Snapshot */}
                  <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
                    {alert.thumbnail_path ? (
                      <img
                        src={`${API_BASE_URL}/${alert.thumbnail_path}`}
                        alt="Fall Snapshot"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Camera className="w-4 h-4" /> No Thumbnail
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      FALL DETECTED
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start text-xs text-slate-400">
                        <span>Device ID: #{alert.device_id}</span>
                        <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-sm font-medium text-slate-200 mt-2">
                        {new Date(alert.event_timestamp).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex justify-end">
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Log
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}