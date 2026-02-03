import { useState, useRef, useCallback } from "react";
import api from "../api/axios";
import SummaryChart from "../components/SummaryChart";
import type { SummaryData } from "../components/SummaryChart";

/* ── reusable Toast ── */
const Toast = ({
  show,
  type,
  msg,
}: {
  show: boolean;
  type: "success" | "error";
  msg: string;
}) => {
  if (!show) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-6 py-4 shadow-2xl animate-toastIn"
      style={{
        background:
          type === "success"
            ? "linear-gradient(135deg,#059669,#10b981)"
            : "linear-gradient(135deg,#dc2626,#ef4444)",
        color: "#fff",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 16,
        fontWeight: 600,
      }}
    >
      {type === "success" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {msg}
    </div>
  );
};

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    msg: string;
  }>({ show: false, type: "success", msg: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* helpers */
  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3200);
  }, []);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
    }
  }, []);

  /* demo upload */
  const uploadDemoFile = async () => {
  try {
    setLoading(true);

    const res = await fetch("/demo/sample_equipment_data.csv");
    const blob = await res.blob();

    const demoFile = new File(
      [blob],
      "sample_equipment_data.csv",
      { type: "text/csv" }
    );

    setFile(demoFile);
    showToast("success", "Demo CSV loaded!");
  } catch {
    showToast("error", "Failed to load demo file");
  } finally {
    setLoading(false);
  }
};


  /* upload */
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await api.post("upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const histRes = await api.get("history/");
      if (histRes.data && histRes.data.length > 0) {
        const latest = histRes.data[0];
        setSummary({
          total_equipment: latest.total_equipment,
          avg_flowrate: latest.avg_flowrate,
          avg_pressure: latest.avg_pressure,
          avg_temperature: latest.avg_temperature,
          type_distribution: latest.type_distribution,
        });
      }
      showToast("success", "Dataset uploaded & analysed!");
      setFile(null);
    } catch {
      showToast("error", "Upload failed — check CSV format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0e1a" }}>
      <Toast show={toast.show} type={toast.type} msg={toast.msg} />

      {/* subtle bg grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#63caff 1px, transparent 1px), linear-gradient(90deg, #63caff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* ── wider container, more breathing room ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-14">
        {/* page header */}
        <div className="mb-10">
          <p
            style={{
              fontSize: 13,
              color: "#63caff",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ◈ Data Ingestion
          </p>
          <h1
            style={{
              fontSize: 32,
              color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Upload CSV Dataset
          </h1>
          <p
            style={{
              color: "#8b9bb5",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 17,
              marginTop: 8,
            }}
          >
            Drop your equipment CSV below. Charts will appear instantly after
            upload.
          </p>
        </div>

        {/* ── drop zone ── */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{
            position: "relative",
            borderRadius: 18,
            border: `2px dashed ${dragOver ? "#63caff" : file ? "rgba(52,211,153,0.45)" : "rgba(99,202,255,0.22)"}`,
            minHeight: 340,
            background: dragOver
              ? "rgba(99,202,255,0.06)"
              : "rgba(17,24,39,0.55)",
            backdropFilter: "blur(10px)",
            boxShadow: dragOver
              ? "0 0 40px rgba(99,202,255,0.2), inset 0 0 50px rgba(99,202,255,0.04)"
              : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={pickFile}
            className="hidden"
          />

          {/* icon box — 80×80 */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: file
                ? "rgba(52,211,153,0.12)"
                : "rgba(99,202,255,0.1)",
              border: `1px solid ${file ? "rgba(52,211,153,0.3)" : "rgba(99,202,255,0.25)"}`,
              transition: "all 0.3s",
            }}
          >
            {file ? (
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <polyline points="16 13 12 17 8 13" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ) : (
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#63caff"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </div>

          {/* main text */}
          <p
            style={{
              color: "#fff",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 20,
              fontWeight: 600,
              margin: 0,
            }}
          >
            {file
              ? file.name
              : dragOver
                ? "Release to drop!"
                : "Drag & drop CSV here"}
          </p>
          <p
            style={{
              color: "#4e5d73",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 14,
              marginTop: 6,
            }}
          >
            {file
              ? `${(file.size / 1024).toFixed(1)} KB`
              : "or click to browse"}
          </p>

          {/* clear badge — 32×32 */}
          {file && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(251,113,133,0.12)",
                border: "1px solid rgba(251,113,133,0.25)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(251,113,133,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(251,113,133,0.12)")
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fb7185"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* ── upload button ── */}
        <div
          style={{ marginTop: 24, display: "flex", justifyContent: "center" }}
        >
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 56px",
              borderRadius: 14,
              border: "none",
              background:
                !file || loading
                  ? "rgba(99,202,255,0.18)"
                  : "linear-gradient(135deg,#63caff,#34d399)",
              color: !file || loading ? "#4e5d73" : "#0a0e1a",
              cursor: !file || loading ? "not-allowed" : "pointer",
              boxShadow:
                !file || loading ? "none" : "0 4px 28px rgba(99,202,255,0.35)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.12em",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <>
                <span
                  className="animate-spinSlow"
                  style={{
                    display: "inline-block",
                    width: 20,
                    height: 20,
                    border: "2.5px solid #63caff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                  }}
                />{" "}
                Uploading…
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>{" "}
                UPLOAD
              </>
            )}
          </button>
        </div>

        {/* ── demo upload ── */}
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          <button
            type="button"
            onClick={uploadDemoFile}
            disabled={loading}
            style={{
              padding: "12px 26px",
              borderRadius: 12,
              background: "rgba(99,202,255,0.12)",
              border: "1px dashed rgba(99,202,255,0.35)",
              color: "#63caff",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,202,255,0.22)";
              e.currentTarget.style.boxShadow =
                "0 0 18px rgba(99,202,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(99,202,255,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Load Demo Dataset
          </button>

          <p
            style={{
              marginTop: 8,
              color: "#4e5d73",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11,
            }}
          >
            Instantly analyze a sample CSV
          </p>
        </div>

        {/* ── summary charts (appear after upload) ── */}
        {summary && (
          <div className="animate-fadeUp" style={{ marginTop: 48 }}>
            {/* divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(99,202,255,0.25))",
                }}
              />
              <p
                style={{
                  fontSize: 13,
                  color: "#63caff",
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                ◈ Analysis Results
              </p>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(270deg, transparent, rgba(99,202,255,0.25))",
                }}
              />
            </div>

            <SummaryChart data={summary} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
