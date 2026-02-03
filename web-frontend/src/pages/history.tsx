import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import SummaryChart from "../components/SummaryChart";
import type { SummaryData } from "../components/SummaryChart";

interface Dataset {
  id:                number;
  filename:          string;
  uploaded_at:       string;
  total_equipment:   number;
  avg_flowrate:      number;
  avg_pressure:      number;
  avg_temperature:   number;
  type_distribution?: Record<string, number>;
}

/* ── skeleton card ── */
const SkeletonCard = () => (
  <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.1)", borderRadius: 14, padding: 24 }} className="animate-pulse">
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
      {/* badge placeholder 48×48 */}
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1c2640", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, borderRadius: 6, background: "#1c2640", width: "55%" }} />
        <div style={{ height: 11, borderRadius: 6, background: "#1c2640", width: "32%", marginTop: 8 }} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
      {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 56, borderRadius: 10, background: "#1c2640" }} />)}
    </div>
  </div>
);

/* ── single history card ── */
const HistoryCard = ({ ds, index }: { ds: Dataset; index: number }) => {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const summaryData: SummaryData = {
    total_equipment:   ds.total_equipment,
    avg_flowrate:      ds.avg_flowrate,
    avg_pressure:      ds.avg_pressure,
    avg_temperature:   ds.avg_temperature,
    type_distribution: ds.type_distribution,
  };

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`report/${ds.id}/`, { responseType: "blob" });
      const url  = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href  = url; link.download = `report_${ds.filename.replace(".csv","")}.pdf`;
      document.body.appendChild(link); link.click();
      link.remove(); URL.revokeObjectURL(url);
    } catch { alert("Download failed"); }
    finally { setDownloading(false); }
  };

  const badge = ["#63caff","#34d399","#fb7185","#fbbf24","#a78bfa"][index % 5];

  return (
    <div className="animate-fadeUp"
         style={{ animationDelay: `${index * 0.08}s`, background: "#151d2f",
                  border: `1px solid ${open ? badge + "40" : "rgba(99,202,255,0.14)"}`,
                  borderRadius: 14, overflow: "hidden", transition: "all 0.3s",
                  boxShadow: open ? `0 0 22px ${badge}18` : "none" }}>

      {/* ── clickable header row ── */}
      <button onClick={() => setOpen(p => !p)}
              style={{ width: "100%", textAlign: "left", padding: "20px 28px",
                       display: "flex", alignItems: "center", gap: 18,
                       background: open ? "rgba(99,202,255,0.03)" : "transparent",
                       border: "none", cursor: "pointer", transition: "background 0.2s" }}>

        {/* index badge — 48×48 */}
        <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: badge + "18", border: `1px solid ${badge}30` }}>
          <span style={{ color: badge, fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700 }}>
            {index + 1}
          </span>
        </div>

        {/* text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontSize: 18, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ds.filename}
          </p>
          <p style={{ color: "#4e5d73", fontFamily: "'Share Tech Mono', monospace", fontSize: 13, margin: "4px 0 0 0" }}>
            {new Date(ds.uploaded_at).toLocaleString()}
          </p>
        </div>

        {/* mini stats — hidden on mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }} className="hidden sm:flex">
          {[
            { label: "Items", val: ds.total_equipment, c: "#63caff" },
            { label: "Flow",  val: ds.avg_flowrate,    c: "#34d399" },
            { label: "Press", val: ds.avg_pressure,    c: "#fb7185" },
            { label: "Temp",  val: ds.avg_temperature, c: "#fbbf24" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "right" }}>
              <p style={{ color: s.c, fontFamily: "'Orbitron', sans-serif", fontSize: 15, fontWeight: 700, margin: 0 }}>{s.val}</p>
              <p style={{ color: "#4e5d73", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, margin: "2px 0 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* chevron 20×20 */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b9bb5" strokeWidth="2.5" strokeLinecap="round"
             style={{ flexShrink: 0, transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* ── expandable detail ── */}
      {open && (
        <div className="animate-slideDown" style={{ padding: "20px 28px 28px 28px", borderTop: "1px solid rgba(99,202,255,0.1)" }}>

          {/* section label */}
          <p style={{ fontSize: 13, color: badge, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "4px 0 20px 0" }}>
            ◈ Dataset Analytics
          </p>

          {/* charts */}
          <SummaryChart data={summaryData} />

          {/* PDF download button */}
          <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
            <button onClick={downloadReport} disabled={downloading}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 28px", borderRadius: 12, border: "none",
                      background: downloading ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg,#34d399,#22a878)",
                      color: downloading ? "#4e5d73" : "#0a0e1a",
                      cursor: downloading ? "not-allowed" : "pointer",
                      boxShadow: downloading ? "none" : "0 3px 18px rgba(52,211,153,0.3)",
                      fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.08em",
                      transition: "all 0.2s",
                    }}>
              {downloading
                ? <><span className="animate-spinSlow" style={{ display: "inline-block", width: 18, height: 18, border: "2.5px solid #34d399", borderTopColor: "transparent", borderRadius: "50%" }} /> Generating…</>
                : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> DOWNLOAD PDF</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── main page ── */
const History = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get("history/");
      setDatasets(res.data);
    } catch { setError("Failed to load history"); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className="min-h-screen" style={{ background: "#0a0e1a" }}>
      {/* subtle bg grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035]"
           style={{ backgroundImage: "linear-gradient(#63caff 1px, transparent 1px), linear-gradient(90deg, #63caff 1px, transparent 1px)",
                    backgroundSize: "56px 56px" }} />

      {/* ── wider container ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-14">

        {/* page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 13, color: "#63caff", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px 0" }}>◈ Dataset Vault</p>
            <h1 style={{ fontSize: 32, color: "#fff", fontFamily: "'Orbitron', sans-serif", fontWeight: 700, margin: 0 }}>Upload History</h1>
          </div>

          {/* refresh button */}
          <button onClick={() => { setLoading(true); fetchHistory(); }}
                  style={{ display: "flex", alignItems: "center", gap: 8,
                           padding: "10px 20px", borderRadius: 10,
                           background: "rgba(99,202,255,0.1)", border: "1px solid rgba(99,202,255,0.2)", cursor: "pointer",
                           transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,202,255,0.18)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,202,255,0.1)")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#63caff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
            <span style={{ color: "#63caff", fontFamily: "'Share Tech Mono', monospace", fontSize: 14 }}>Refresh</span>
          </button>
        </div>

        {/* ── loading skeletons ── */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── error ── */}
        {!loading && error && (
          <div className="animate-fadeUp"
               style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)", borderRadius: 14, padding: 32, textAlign: "center" }}>
            <svg style={{ display: "block", margin: "0 auto 16px" }} width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ color: "#fb7185", fontFamily: "'Rajdhani', sans-serif", fontSize: 18, margin: 0 }}>{error}</p>
            <button onClick={() => { setLoading(true); setError(""); fetchHistory(); }}
                    style={{ marginTop: 14, padding: "8px 20px", borderRadius: 8,
                             background: "rgba(251,113,133,0.15)", border: "1px solid rgba(251,113,133,0.3)", color: "#fb7185",
                             fontFamily: "'Share Tech Mono', monospace", fontSize: 14, cursor: "pointer" }}>
              Retry
            </button>
          </div>
        )}

        {/* ── empty ── */}
        {!loading && !error && datasets.length === 0 && (
          <div className="animate-fadeUp"
               style={{ background: "rgba(17,24,39,0.6)", border: "2px dashed rgba(99,202,255,0.25)", borderRadius: 18, padding: 64, textAlign: "center" }}>
            <svg style={{ display: "block", margin: "0 auto 20px" }} width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4e5d73" strokeWidth="1.2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p style={{ color: "#fff", fontFamily: "'Orbitron', sans-serif", fontSize: 18, margin: 0 }}>No datasets yet</p>
            <p style={{ color: "#4e5d73", fontFamily: "'Share Tech Mono', monospace", fontSize: 14, margin: "8px 0 0 0" }}>
              Upload a CSV on the Upload page to see analytics here.
            </p>
          </div>
        )}

        {/* ── card list ── */}
        {!loading && !error && datasets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {datasets.map((ds, i) => <HistoryCard key={ds.id} ds={ds} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;