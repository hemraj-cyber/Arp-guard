import React, { useState, useEffect, useCallback } from "react";
import { useAuth, formatApiError } from "../App";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { Activity, UploadCloud, ShieldAlert, LogOut, RefreshCw, AlertTriangle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const fetchAlerts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/alerts`);
      setAlerts(data);
    } catch (e) {
      toast.error("Failed to load logs");
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    const formData = new FormData();
    formData.append("file", file);
    
    setLoading(true);
    const promise = axios.post(`${BACKEND_URL}/api/pcap/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    toast.promise(promise, {
      loading: 'Analyzing PCAP signature...',
      success: (res) => {
        fetchAlerts();
        return `Analysis complete. Found ${res.data.alerts_found} alerts.`;
      },
      error: (err) => formatApiError(err.response?.data?.detail) || "Analysis failed."
    });
    
    promise.finally(() => setLoading(false));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.tcpdump.pcap': ['.pcap', '.pcapng']
    },
    maxFiles: 1
  });

  const handleCapture = async () => {
    setCapturing(true);
    const promise = axios.post(`${BACKEND_URL}/api/network/capture`);
    
    toast.promise(promise, {
      loading: 'Sniffing interface traffic...',
      success: (res) => {
        fetchAlerts();
        return `Capture sequence finished.`;
      },
      error: "Capture sequence failed."
    });

    promise.finally(() => setCapturing(false));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-primary">
          <ShieldAlert className="h-6 w-6" />
          <h1 className="font-heading font-black text-xl tracking-widest uppercase">ARP GUARD :: CONTROL</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground hidden sm:block">Operative: {user?.email}</span>
          <button
            data-testid="logout-button"
            onClick={logout}
            className="flex items-center text-xs font-bold tracking-[0.1em] uppercase text-muted-foreground hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <main className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 content-start">
        
        {/* Left Column: Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-border bg-card p-6 rounded-none">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">TACTICAL UPLOAD</h2>
            <div
              {...getRootProps()}
              data-testid="pcap-upload-zone"
              className={`border-2 border-dashed ${isDragActive ? 'border-primary bg-primary/10' : 'border-border bg-background'} p-8 text-center cursor-pointer transition-colors`}
            >
              <input {...getInputProps()} data-testid="pcap-upload-input" />
              <UploadCloud className={`h-8 w-8 mx-auto mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm font-bold text-white mb-2">DROP PCAP FILE HERE</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">or click to browse</p>
            </div>
          </div>

          <div className="border border-border bg-card p-6 rounded-none">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">LIVE INTERCEPT</h2>
            <button
              data-testid="live-capture-button"
              onClick={handleCapture}
              disabled={capturing}
              className="w-full flex items-center justify-center space-x-2 bg-destructive hover:bg-destructive/90 text-white p-4 font-bold text-xs tracking-[0.1em] uppercase transition-colors disabled:opacity-50"
            >
              {capturing ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> <span>Sniffing...</span></>
              ) : (
                <><Activity className="h-4 w-4" /> <span>Initiate Capture</span></>
              )}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Engages scapy sniff sequence on eth0 for real-time anomaly detection.</p>
          </div>
        </div>

        {/* Right Column: Logs */}
        <div className="lg:col-span-3 border border-border bg-card flex flex-col min-h-[600px] rounded-none">
          <div className="border-b border-border p-4 flex justify-between items-center bg-muted/20">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">THREAT LOGS</h2>
            <button onClick={fetchAlerts} className="text-primary hover:text-primary/80"><RefreshCw className="h-4 w-4" /></button>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <ShieldAlert className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm font-bold tracking-widest uppercase">No anomalies detected</p>
                <p className="text-xs mt-2">Upload a PCAP or initiate live capture.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground tracking-widest sticky top-0 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-bold">Timestamp</th>
                    <th className="px-6 py-3 font-bold">Threat Type</th>
                    <th className="px-6 py-3 font-bold">Severity</th>
                    <th className="px-6 py-3 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {alerts.map((alert) => (
                    <tr key={alert._id} className="hover:bg-muted/30 transition-colors" data-testid={`alert-row-${alert._id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                        {alert.severity === 'Critical' || alert.severity === 'High' ? (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        ) : (
                          <Activity className="h-4 w-4 text-warning" />
                        )}
                        <span>{alert.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                          alert.severity === 'High' || alert.severity === 'Critical' 
                            ? 'bg-destructive/10 text-destructive border-destructive/20' 
                            : 'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs max-w-md truncate" title={alert.message}>
                        {alert.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
