import { Bar, Doughnut } from "react-chartjs-2";
import "../charts/chartConfig";

/* ─── shared palette tokens ─── */
const CYAN    = "rgba(99,202,255,0.75)";
const EMERALD = "rgba(52,211,153,0.75)";
const ROSE    = "rgba(251,113,133,0.75)";
const AMBER   = "rgba(251,191,36,0.75)";
const VIOLET  = "rgba(167,139,250,0.75)";
const SLATE   = "rgba(148,163,184,0.65)";

const DONUT_COLORS = [CYAN, EMERALD, AMBER, ROSE, VIOLET, SLATE];

export interface SummaryData {
  total_equipment:    number;
  avg_flowrate:       number;
  avg_pressure:       number;
  avg_temperature:    number;
  type_distribution?: Record<string, number>;
}

interface Props {
  data: SummaryData;
}

/* dark Chart.js defaults — tick + legend bumped to 13 */
const darkScales = {
  x: {
    ticks:  { color: "#8b9bb5", font: { family: "'Share Tech Mono', monospace", size: 13 } },
    grid:   { color: "rgba(99,202,255,0.07)" },
    border: { color: "rgba(99,202,255,0.12)" },
  },
  y: {
    ticks:  { color: "#8b9bb5", font: { family: "'Share Tech Mono', monospace", size: 13 } },
    grid:   { color: "rgba(99,202,255,0.07)" },
    border: { color: "rgba(99,202,255,0.12)" },
  },
};

const darkLegend = {
  labels: { color: "#8b9bb5", font: { family: "'Share Tech Mono', monospace", size: 13 }, padding: 22, usePointStyle: true, pointStyle: "circle" },
};

const SummaryChart = ({ data }: Props) => {
  /* ── Bar ── */
  const barData = {
    labels: ["Flowrate", "Pressure", "Temperature"],
    datasets: [
      {
        label: "Average Value",
        data:  [data.avg_flowrate, data.avg_pressure, data.avg_temperature],
        backgroundColor: [CYAN, EMERALD, ROSE],
        borderColor:     ["rgba(99,202,255,0.9)","rgba(52,211,153,0.9)","rgba(251,113,133,0.9)"],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#151d2f",
        titleColor: "#63caff",
        bodyColor:  "#f0f4f8",
        borderColor: "rgba(99,202,255,0.25)",
        borderWidth: 1,
        titleFont:  { family: "'Orbitron', sans-serif", size: 13 },
        bodyFont:   { family: "'Share Tech Mono', monospace", size: 14 },
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: darkScales,
  };

  /* ── Doughnut ── */
  const dist = data.type_distribution || {};
  const distLabels = Object.keys(dist);
  const distValues = Object.values(dist);

  const donutData = {
    labels: distLabels,
    datasets: [
      {
        data: distValues,
        backgroundColor: distLabels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]),
        borderColor:     distLabels.map(() => "#151d2f"),
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" as const },
    cutout: "62%",
    plugins: {
      legend: { position: "right" as const, labels: darkLegend.labels },
      tooltip: {
        backgroundColor: "#151d2f",
        titleColor: "#63caff",
        bodyColor:  "#f0f4f8",
        borderColor: "rgba(99,202,255,0.25)",
        borderWidth: 1,
        titleFont:  { family: "'Orbitron', sans-serif", size: 13 },
        bodyFont:   { family: "'Share Tech Mono', monospace", size: 14 },
        cornerRadius: 10,
        padding: 12,
      },
    },
  };

  /* ── stat pills ── */
  const stats = [
    { label: "Total",  value: data.total_equipment, color: "#63caff" },
    { label: "Flow",   value: data.avg_flowrate,    color: "#34d399" },
    { label: "Press",  value: data.avg_pressure,    color: "#fb7185" },
    { label: "Temp",   value: data.avg_temperature, color: "#fbbf24" },
  ];

  return (
    <div className="animate-fadeUp">
      {/* ── stat pills — bigger dots, bigger text, more padding ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
                                      background: "#151d2f", border: `1px solid ${s.color}30`,
                                      borderRadius: 12, padding: "12px 20px" }}>
            <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#8b9bb5", fontFamily: "'Share Tech Mono', monospace", fontSize: 14 }}>{s.label}</span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 700, color: s.color, marginLeft: 6 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── charts row ── */}
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: distLabels.length ? "1.2fr 1fr" : "1fr" }}>

        {/* Bar card */}
        <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.15)", borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 13, color: "#63caff", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
            ◈ Average Parameters
          </p>
          <div style={{ height: 300 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut card */}
        {distLabels.length > 0 && (
          <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.15)", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 13, color: "#34d399", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
              ◈ Type Distribution
            </p>
            <div style={{ height: 300 }}>
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryChart;