import { useState, useRef } from "react";
import api from "../api/axios";

/* ── decorative orb data ── */
const ORBS = [
  {
    top: "8%",
    left: "12%",
    w: 280,
    h: 280,
    delay: "0s",
    bg: "radial-gradient(circle, rgba(99,202,255,0.18) 0%, transparent 70%)",
  },
  {
    top: "60%",
    left: "75%",
    w: 220,
    h: 220,
    delay: "1.2s",
    bg: "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
  },
  {
    top: "70%",
    left: "5%",
    w: 180,
    h: 180,
    delay: "2.4s",
    bg: "radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)",
  },
  {
    top: "15%",
    left: "72%",
    w: 150,
    h: 150,
    delay: "0.8s",
    bg: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
  },
  {
    top: "48%",
    left: "38%",
    w: 110,
    h: 110,
    delay: "1.8s",
    bg: "radial-gradient(circle, rgba(99,202,255,0.10) 0%, transparent 70%)",
  },
];

const DEMO_CREDENTIALS = {
  username: "test1",
  password: "admin.test1",
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  /* shake on bad credentials */
  const shake = () => {
    const el = formRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "shake 0.4s ease";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("auth/token/login/", { username, password });
      localStorage.setItem("token", res.data.auth_token);
      window.location.href = "/upload";
    } catch {
      setError("Invalid username or password");
      shake();
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-10px); }
          40%     { transform: translateX(10px); }
          60%     { transform: translateX(-6px); }
          80%     { transform: translateX(6px); }
        }
      `}</style>

      {/* ── full-screen dark background ── */}
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0e1a 0%, #0f1627 50%, #0a0e1a 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(#63caff 1px, transparent 1px), linear-gradient(90deg, #63caff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* floating orbs */}
        {ORBS.map((o, i) => (
          <div
            key={i}
            className="animate-floatOrb"
            style={{
              position: "absolute",
              top: o.top,
              left: o.left,
              width: o.w,
              height: o.h,
              animationDelay: o.delay,
              animationDuration: `${6 + i * 1.4}s`,
              background: o.bg,
              borderRadius: "50%",
              filter: "blur(3px)",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* ── card wrapper — hard width, centred ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 440,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {/* top accent line */}
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(90deg, transparent, #63caff, #34d399, transparent)",
              borderRadius: "8px 8px 0 0",
            }}
          />

          {/* logo circle — sits on top of the accent line */}
          <div
            style={{
              position: "absolute",
              top: -28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #63caff, #34d399)",
              boxShadow: "0 0 24px rgba(99,202,255,0.45)",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0e1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* ── form / glass card ── */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              background: "rgba(17,24,39,0.78)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(99,202,255,0.2)",
              borderTop: "none",
              borderRadius: "0 0 18px 18px",
              padding: "56px 36px 36px 36px",
              boxSizing: "border-box",
            }}
          >
            {/* title block — enough top padding to clear the logo */}
            <h1
              style={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "0 0 6px 0",
              }}
            >
              ChemViz
            </h1>
            <p
              style={{
                textAlign: "center",
                color: "#8b9bb5",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 32px 0",
              }}
            >
              Equipment Parameter Visualizer
            </p>

            {/* error banner */}
            {error && (
              <div
                className="animate-fadeUp"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(251,113,133,0.1)",
                  border: "1px solid rgba(251,113,133,0.28)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 20,
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="10" cy="10" r="9" fill="#fb7185" />
                  <path
                    d="M10 5v5"
                    stroke="#0a0e1a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="14" r="1" fill="#0a0e1a" />
                </svg>
                <span
                  style={{
                    color: "#fb7185",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 13,
                  }}
                >
                  {error}
                </span>
              </div>
            )}

            {/* ── USERNAME ── */}
            <label
              style={{
                display: "block",
                color: "#8b9bb5",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Username
            </label>
            <div style={{ position: "relative", marginBottom: 22 }}>
              {/* icon */}
              <svg
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4e5d73"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  paddingLeft: 42,
                  paddingRight: 16,
                  paddingTop: 13,
                  paddingBottom: 13,
                  background: "#0f1623",
                  border: "1px solid rgba(99,202,255,0.2)",
                  borderRadius: 10,
                  color: "#fff",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#63caff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,202,255,0.18)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(99,202,255,0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* ── PASSWORD ── */}
            <label
              style={{
                display: "block",
                color: "#8b9bb5",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative", marginBottom: 30 }}>
              {/* icon */}
              <svg
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4e5d73"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  paddingLeft: 42,
                  paddingRight: 16,
                  paddingTop: 13,
                  paddingBottom: 13,
                  background: "#0f1623",
                  border: "1px solid rgba(99,202,255,0.2)",
                  borderRadius: 10,
                  color: "#fff",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#63caff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,202,255,0.18)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(99,202,255,0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* ── SIGN IN button ── */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "14px 0",
                borderRadius: 10,
                border: "none",
                background: loading
                  ? "rgba(99,202,255,0.35)"
                  : "linear-gradient(135deg, #63caff, #34d399)",
                boxShadow: loading
                  ? "none"
                  : "0 4px 22px rgba(99,202,255,0.38)",
                color: "#0a0e1a",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: 18,
                      height: 18,
                      border: "2.5px solid #0a0e1a",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                    }}
                    className="animate-spinSlow"
                  />
                  Authenticating…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* ── DEMO CREDENTIALS ── */}
            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: "1px dashed rgba(99,202,255,0.18)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: 10,
                  color: "#8b9bb5",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Demo Access
              </p>

              <button
                type="button"
                onClick={fillDemoCredentials}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  background: "rgba(99,202,255,0.12)",
                  border: "1px solid rgba(99,202,255,0.28)",
                  color: "#63caff",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99,202,255,0.22)";
                  e.currentTarget.style.boxShadow = "0 0 18px rgba(99,202,255,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(99,202,255,0.12)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Use Demo Credentials
              </button>

              <p
                style={{
                  marginTop: 10,
                  color: "#4e5d73",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                Username: <span style={{ color: "#63caff" }}>test1</span><br />
                Password: <span style={{ color: "#63caff" }}>admin.test1</span>
              </p>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
