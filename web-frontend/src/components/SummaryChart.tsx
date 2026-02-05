import { Bar, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import "../charts/chartConfig";

/* ─── shared palette tokens ─── */
const CYAN    = "rgba(99,202,255,0.75)";
const EMERALD = "rgba(52,211,153,0.75)";
const ROSE    = "rgba(251,113,133,0.75)";
const AMBER   = "rgba(251,191,36,0.75)";
const VIOLET  = "rgba(167,139,250,0.75)";
const SLATE   = "rgba(148,163,184,0.65)";

const DONUT_COLORS = [CYAN, EMERALD, AMBER, ROSE, VIOLET, SLATE];

export interface TypeMetric {
  count: number;
  avg_flowrate: number;
  avg_pressure: number;
  avg_temperature: number;
}

export interface SummaryData {
  total_equipment:    number;
  avg_flowrate:       number;
  avg_pressure:       number;
  avg_temperature:    number;
  type_distribution?: Record<string, number>;
  type_metrics?:      Record<string, TypeMetric>;
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

  /* ── Grouped Bar - Per-Type Metrics ── */
  const typeMetrics = data.type_metrics || {};
  const typeLabels = Object.keys(typeMetrics);
  
  const groupedBarData = {
    labels: typeLabels,
    datasets: [
      {
        label: "Avg Flowrate",
        data: typeLabels.map(t => typeMetrics[t]?.avg_flowrate || 0),
        backgroundColor: CYAN,
        borderColor: "rgba(99,202,255,0.9)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Avg Pressure",
        data: typeLabels.map(t => typeMetrics[t]?.avg_pressure || 0),
        backgroundColor: EMERALD,
        borderColor: "rgba(52,211,153,0.9)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Avg Temperature",
        data: typeLabels.map(t => typeMetrics[t]?.avg_temperature || 0),
        backgroundColor: ROSE,
        borderColor: "rgba(251,113,133,0.9)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const groupedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" as const },
    plugins: {
      legend: { 
        display: true, 
        position: "top" as const,
        labels: darkLegend.labels 
      },
      tooltip: {
        backgroundColor: "#151d2f",
        titleColor: "#63caff",
        bodyColor:  "#f0f4f8",
        borderColor: "rgba(99,202,255,0.25)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: darkScales,
  };

  /* ── Horizontal Bar - Equipment Ranking ── */
  const sortedDist = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  
  const horizontalBarData = {
    labels: sortedDist.map(([label]) => label),
    datasets: [
      {
        label: "Equipment Count",
        data: sortedDist.map(([, count]) => count),
        backgroundColor: sortedDist.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]),
        borderColor: sortedDist.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length].replace("0.75", "1")),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    animation: { duration: 900, easing: "easeOutQuart" as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#151d2f",
        titleColor: "#63caff",
        bodyColor:  "#f0f4f8",
        borderColor: "rgba(99,202,255,0.25)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks:  { color: "#8b9bb5", font: { family: "'Share Tech Mono', monospace", size: 13 } },
        grid:   { color: "rgba(99,202,255,0.07)" },
        border: { color: "rgba(99,202,255,0.12)" },
      },
      y: {
        ticks:  { color: "#8b9bb5", font: { family: "'Share Tech Mono', monospace", size: 13 } },
        grid:   { display: false },
        border: { color: "rgba(99,202,255,0.12)" },
      },
    },
  };

  /* ── Radar Chart - Multi-metric overview ── */
  const radarData = {
    labels: ["Flowrate", "Pressure", "Temperature", "Equipment Count"],
    datasets: [
      {
        label: "Dataset Metrics",
        data: [
          data.avg_flowrate,
          data.avg_pressure * 10, // Scale up for visibility
          data.avg_temperature,
          data.total_equipment * 5, // Scale up for visibility
        ],
        backgroundColor: "rgba(99,202,255,0.2)",
        borderColor: CYAN,
        borderWidth: 2,
        pointBackgroundColor: CYAN,
        pointBorderColor: "#151d2f",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#151d2f",
        titleColor: "#63caff",
        bodyColor:  "#f0f4f8",
        borderColor: "rgba(99,202,255,0.25)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(99,202,255,0.15)" },
        grid: { color: "rgba(99,202,255,0.1)" },
        pointLabels: { color: "#8b9bb5", font: { family: "'Share Tech Mono', monospace", size: 12 } },
        ticks: { display: false },
      },
    },
  };

  /* ── Polar Area - Alternative Distribution View ── */
  const polarData = {
    labels: distLabels,
    datasets: [
      {
        data: distValues,
        backgroundColor: distLabels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]),
        borderColor: "#151d2f",
        borderWidth: 2,
      },
    ],
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" as const },
    plugins: {
      legend: { position: "right" as const, labels: darkLegend.labels },
      tooltip: {
        backgroundColor: "#151d2f",
        titleColor: "#63caff",
        bodyColor:  "#f0f4f8",
        borderColor: "rgba(99,202,255,0.25)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: {
      r: {
        grid: { color: "rgba(99,202,255,0.1)" },
        ticks: { display: false },
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

      {/* ── charts row 1 ── */}
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: distLabels.length ? "1.2fr 1fr" : "1fr", marginBottom: 18 }}>

        {/* Bar card - Average Parameters */}
        <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.15)", borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 13, color: "#63caff", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
            ◈ Average Parameters
          </p>
          <div style={{ height: 300 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut card - Type Distribution */}
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

      {/* ── charts row 2 - Grouped Bar + Horizontal Bar ── */}
      {typeLabels.length > 0 && (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1.2fr 1fr", marginBottom: 18 }}>

          {/* Grouped Bar - Per-Type Metrics Comparison */}
          <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.15)", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 13, color: "#a78bfa", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
              ◈ Metrics by Equipment Type
            </p>
            <div style={{ height: 300 }}>
              <Bar data={groupedBarData} options={groupedBarOptions} />
            </div>
          </div>

          {/* Horizontal Bar - Equipment Ranking */}
          <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.15)", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 13, color: "#fbbf24", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
              ◈ Equipment Ranking
            </p>
            <div style={{ height: 300 }}>
              <Bar data={horizontalBarData} options={horizontalBarOptions} />
            </div>
          </div>
        </div>
      )}

      {/* ── charts row 3 - Radar + Polar Area ── */}
      {distLabels.length > 0 && (
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr 1fr" }}>

          {/* Radar Chart - Multi-metric Overview */}
          <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.15)", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 13, color: "#fb7185", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
              ◈ Metrics Overview
            </p>
            <div style={{ height: 300 }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Polar Area - Alternative Distribution */}
          <div style={{ background: "#151d2f", border: "1px solid rgba(99,202,255,0.15)", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 13, color: "#38bdf8", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
              ◈ Type Polar View
            </p>
            <div style={{ height: 300 }}>
              <PolarArea data={polarData} options={polarOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryChart;