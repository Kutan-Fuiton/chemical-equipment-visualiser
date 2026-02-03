import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  {
    to: "/upload",
    label: "Upload",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    to: "/history",
    label: "History",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem("token");

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* ── thin cyan accent line above the nav ── */}
      <div style={{ height: 2, background: "linear-gradient(90deg, transparent 0%, #63caff 30%, #34d399 70%, transparent 100%)" }} />

      {/* ── main nav bar ── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 72,                                          /* tall bar */
        background: "rgba(10, 14, 26, 0.55)",                /* more transparent so glass reads */
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderBottom: "1px solid rgba(99,202,255,0.18)",
        /* subtle inner top highlight for depth */
        boxShadow: "inset 0 1px 0 rgba(99,202,255,0.08), 0 4px 24px rgba(0,0,0,0.35)",
      }}>

        {/* ── brand ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* logo square */}
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #63caff, #34d399)",
            boxShadow: "0 0 14px rgba(99,202,255,0.35)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0e1a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>

          {/* text */}
          <div>
            <span style={{ display: "block", color: "#fff", fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", lineHeight: 1.1 }}>
              ChemViz
            </span>
            <span style={{ display: "block", color: "#4e5d73", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 2 }}>
              Equipment Visualizer
            </span>
          </div>
        </div>

        {/* ── centre nav links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {NAV_LINKS.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                position: "relative",
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 22px",
                borderRadius: 10,
                textDecoration: "none",
                color: active ? "#fff" : "#8b9bb5",
                background: active ? "rgba(99,202,255,0.13)" : "transparent",
                border: active ? "1px solid rgba(99,202,255,0.28)" : "1px solid transparent",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.04em",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,202,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,202,255,0.18)"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#8b9bb5"; } }}
              >
                {icon}
                {label}
                {/* active bottom glow bar */}
                {active && (
                  <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                                 width: 32, height: 2, borderRadius: 2,
                                 background: "linear-gradient(90deg, transparent, #63caff, transparent)" }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── logout ── */}
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px",
          borderRadius: 10,
          border: "1px solid rgba(251,113,133,0.3)",
          background: "rgba(251,113,133,0.08)",
          color: "#fb7185",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.04em",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(251,113,133,0.18)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(251,113,133,0.5)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(251,113,133,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(251,113,133,0.08)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(251,113,133,0.3)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </nav>
    </>
  );
};

export default Navbar;