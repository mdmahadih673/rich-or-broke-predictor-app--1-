import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "landing" | "scanning" | "result";
type ResultType = "rich" | "broke" | "chaos";

interface ResultData {
  type: ResultType;
  status: string;
  balance: string;
  reason: string;
  titles: string[];
  emoji: string;
  color: string;
  glow: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SCAN_MESSAGES = [
  "Initializing AI Financial Analysis… 🤖",
  "Checking bank account… 🏦",
  "Analyzing spending habits… 📊",
  "Counting unnecessary food deliveries 🍔",
  "Checking wallet condition… 👜",
  "Detecting savings level… 🔍",
  "Evaluating lifestyle choices 💀",
  "Cross-referencing with cosmic debt database… 🌌",
  "Consulting financial astrology charts… ⭐",
  "Calculating snack expenditure ratio… 🍟",
  "Running broke-ness probability matrix… 📉",
  "Almost done… (probably) 😬",
];

const RICH_RESULTS: ResultData[] = [
  {
    type: "rich",
    status: "Future Billionaire Energy 💸",
    balance: "Overflow Error 💰💰💰",
    reason: "You accidentally became rich by doing absolutely nothing 😎",
    titles: ["Future CEO 🏢", "Crypto King 👑", "Luxury Lifestyle Unlocker 🚗", "Money Printer Go Brrr 🖨️"],
    emoji: "💰",
    color: "#FFD700",
    glow: "0 0 40px #FFD70088, 0 0 80px #FFD70044",
  },
  {
    type: "rich",
    status: "Generational Wealth Incoming 🤑",
    balance: "৳∞ (Yes, infinity)",
    reason: "A distant uncle you never knew left you everything 👴",
    titles: ["Diamond Hands Legend 💎", "Yacht Owner 🛥️", "Private Jet Passenger ✈️", "Budget? Never Heard Of It 💅"],
    emoji: "👑",
    color: "#FFD700",
    glow: "0 0 40px #FFD70088, 0 0 80px #FFD70044",
  },
  {
    type: "rich",
    status: "Accidental Millionaire 🎰",
    balance: "More than your dreams",
    reason: "You went viral doing something embarrassing and got brand deals 🎥",
    titles: ["Influencer Tycoon 📱", "Brand Deal Magnet ✨", "Accidental Entrepreneur 🚀", "Silver Spoon Receiver 🥄"],
    emoji: "🚀",
    color: "#FFD700",
    glow: "0 0 40px #FFD70088, 0 0 80px #FFD70044",
  },
];

const BROKE_RESULTS: ResultData[] = [
  {
    type: "broke",
    status: "Financially Creative 🥲",
    balance: "৳17.50",
    reason: "Too many 'just one more snack' moments 🍟",
    titles: ["Professional Borrower 🤝", "EMI Survivor 📉", "Discount Hunter 🛒", "Ramen Connoisseur 🍜"],
    emoji: "💀",
    color: "#FF4444",
    glow: "0 0 40px #FF444488, 0 0 80px #FF444444",
  },
  {
    type: "broke",
    status: "Economically Challenged 😭",
    balance: "৳2 (borrowed)",
    reason: "You invested in crypto at the peak… twice 📉",
    titles: ["Buy High Sell Low Champion 📊", "Debt Collector's Favorite 📞", "Wallet Ghost 👻", "Free WiFi Seeker 📶"],
    emoji: "😭",
    color: "#FF4444",
    glow: "0 0 40px #FF444488, 0 0 80px #FF444444",
  },
  {
    type: "broke",
    status: "Permanently Pre-Rich 🫠",
    balance: "৳0.00 (404 Not Found)",
    reason: "Subscribed to 47 streaming services you forgot about 📺",
    titles: ["Subscription Hoarder 📋", "ATM Card Decliner 💳", "Masterclass in Spending 🎓", "Living on Vibes Only ✨"],
    emoji: "🫠",
    color: "#FF4444",
    glow: "0 0 40px #FF444488, 0 0 80px #FF444444",
  },
];

const CHAOS_RESULTS: ResultData[] = [
  {
    type: "chaos",
    status: "Financial Status: Unknown 🤡",
    balance: "ERROR 404 💀",
    reason: "Your financial destiny is genuinely confused about itself",
    titles: ["Market Gambler 🎲", "Lucky Unlucky Person 🍀", "Schrödinger's Wallet 📦", "Chaotic Neutral Investor 🃏"],
    emoji: "🤡",
    color: "#AA44FF",
    glow: "0 0 40px #AA44FF88, 0 0 80px #AA44FF44",
  },
  {
    type: "chaos",
    status: "Quantum Financial State 🌀",
    balance: "Both Rich AND Broke simultaneously",
    reason: "You exist in a financial superposition until someone checks your account",
    titles: ["Crypto Degen 🐸", "Moon or Bust 🌙", "Diamond Hands or Crying 😭", "The Wildcard 🃏"],
    emoji: "🌀",
    color: "#AA44FF",
    glow: "0 0 40px #AA44FF88, 0 0 80px #AA44FF44",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getResult(): ResultData {
  const roll = Math.random();
  if (roll < 0.33) return getRandom(RICH_RESULTS);
  if (roll < 0.66) return getRandom(BROKE_RESULTS);
  return getRandom(CHAOS_RESULTS);
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiPiece({ index }: { index: number }) {
  const emojis = ["💰", "💵", "🤑", "💎", "✨", "👑", "💸", "🏆"];
  const emoji = emojis[index % emojis.length];
  const left = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 3}s`;
  const duration = `${3 + Math.random() * 4}s`;
  const size = `${16 + Math.floor(Math.random() * 20)}px`;

  return (
    <div
      style={{
        position: "fixed",
        top: "-40px",
        left,
        fontSize: size,
        animation: `confettiFall ${duration} ${delay} linear infinite`,
        zIndex: 0,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {emoji}
    </div>
  );
}

function BrokeParticle({ index }: { index: number }) {
  const emojis = ["💀", "😭", "📉", "🥲", "💸", "🫠", "😤"];
  const emoji = emojis[index % emojis.length];
  const left = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 3}s`;
  const duration = `${4 + Math.random() * 4}s`;
  const size = `${14 + Math.floor(Math.random() * 16)}px`;

  return (
    <div
      style={{
        position: "fixed",
        top: "-40px",
        left,
        fontSize: size,
        animation: `confettiFall ${duration} ${delay} linear infinite`,
        zIndex: 0,
        pointerEvents: "none",
        userSelect: "none",
        opacity: 0.6,
      }}
    >
      {emoji}
    </div>
  );
}

// ─── Floating Background Emojis ───────────────────────────────────────────────
function FloatingBg() {
  const items = ["💰", "💀", "📉", "🤑", "💸", "👜", "🏦", "💎", "🎲", "🃏", "📊", "🥲"];
  return (
    <>
      {items.map((e, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: `${20 + Math.floor((i * 7) % 28)}px`,
            left: `${(i * 8.5) % 95}%`,
            top: `${(i * 13) % 90}%`,
            opacity: 0.06,
            animation: `floatBg ${6 + (i % 5)}s ease-in-out ${i * 0.4}s infinite alternate`,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          {e}
        </div>
      ))}
    </>
  );
}

// ─── Premium Popup ─────────────────────────────────────────────────────────────
function PremiumPopup({ onClose }: { onClose: () => void }) {
  const [payFailed, setPayFailed] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, rgba(20,20,40,0.98), rgba(10,10,30,0.98))",
          border: "1px solid rgba(255,215,0,0.4)",
          borderRadius: "24px",
          padding: "36px 32px",
          maxWidth: "380px",
          width: "100%",
          boxShadow: "0 0 60px rgba(255,215,0,0.2), 0 20px 60px rgba(0,0,0,0.8)",
          animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            fontSize: "20px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {!payFailed ? (
          <>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔒</div>
            <h2 style={{ color: "#FFD700", fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>
              Premium Financial Report
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "20px", lineHeight: 1.6 }}>
              Unlock your <strong style={{ color: "#FFD700" }}>full AI financial destiny</strong> including hidden debt
              scores, future bankruptcy dates, and more tragic details!
            </p>
            <div
              style={{
                background: "rgba(255,215,0,0.1)",
                border: "1px solid rgba(255,215,0,0.3)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", textDecoration: "line-through" }}>
                ৳4,999
              </div>
              <div style={{ color: "#FFD700", fontSize: "32px", fontWeight: 900 }}>৳49</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>One-time payment (totally real)</div>
            </div>
            <ul
              style={{
                textAlign: "left",
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                marginBottom: "24px",
                listStyle: "none",
                padding: 0,
                lineHeight: 2,
              }}
            >
              {["✅ Full 200-page financial disaster report", "✅ Personalized debt roadmap", "✅ 12 months of crying sessions", "✅ Certificate of Brokeness (framed)"].map(
                (item) => (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
            <button
              onClick={() => setPayFailed(true)}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                border: "none",
                borderRadius: "12px",
                color: "#000",
                fontWeight: 900,
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(255,215,0,0.5)",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              💳 Pay ৳49 Now
            </button>
          </>
        ) : (
          <div style={{ animation: "shakeAnim 0.5s ease" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>😭</div>
            <h2 style={{ color: "#FF4444", fontSize: "24px", fontWeight: 900, marginBottom: "12px" }}>
              Payment Failed!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", marginBottom: "8px" }}>
              Your wallet said <strong style={{ color: "#FF4444" }}>NO</strong>.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "24px" }}>
              Reason: Insufficient funds (we expected this 🙃)
            </p>
            <div
              style={{
                background: "rgba(255,68,68,0.1)",
                border: "1px solid rgba(255,68,68,0.3)",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Error Code: WALLET_EMPTY_AS_YOUR_DREAMS_404
            </div>
            <button
              onClick={onClose}
              style={{
                padding: "12px 28px",
                background: "rgba(255,68,68,0.2)",
                border: "1px solid rgba(255,68,68,0.4)",
                borderRadius: "12px",
                color: "#FF4444",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              😔 Accept My Fate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [name, setName] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMsgIndex, setScanMsgIndex] = useState(0);
  const [displayedMsg, setDisplayedMsg] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shaking, setShaking] = useState(false);
  const scanRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Typing animation
  const typeMessage = useCallback((msg: string) => {
    if (typeRef.current) clearInterval(typeRef.current);
    setDisplayedMsg("");
    let i = 0;
    typeRef.current = setInterval(() => {
      i++;
      setDisplayedMsg(msg.slice(0, i));
      if (i >= msg.length) clearInterval(typeRef.current!);
    }, 30);
  }, []);

  // Scan sequence
  useEffect(() => {
    if (screen !== "scanning") return;
    setScanProgress(0);
    setScanMsgIndex(0);
    typeMessage(SCAN_MESSAGES[0]);

    let progress = 0;
    let msgIdx = 0;
    const totalDuration = 4500;
    const interval = 50;
    const steps = totalDuration / interval;
    const progressPerStep = 100 / steps;
    scanRef.current = setInterval(() => {
      progress = Math.min(100, progress + progressPerStep + Math.random() * 0.5);
      setScanProgress(Math.min(100, progress));

      const newMsgIdx = Math.min(SCAN_MESSAGES.length - 1, Math.floor(progress / (100 / (SCAN_MESSAGES.length - 1))));
      if (newMsgIdx !== msgIdx) {
        msgIdx = newMsgIdx;
        setScanMsgIndex(newMsgIdx);
        typeMessage(SCAN_MESSAGES[newMsgIdx]);
      }

      if (progress >= 100) {
        clearInterval(scanRef.current!);
        setTimeout(() => {
          setResult(getResult());
          setScreen("result");
        }, 600);
      }
    }, interval);

    return () => {
      if (scanRef.current) clearInterval(scanRef.current);
      if (typeRef.current) clearInterval(typeRef.current);
    };
  }, [screen, typeMessage]);

  // Shake for broke
  useEffect(() => {
    if (screen === "result" && result?.type === "broke") {
      setShaking(true);
      setTimeout(() => setShaking(false), 800);
    }
  }, [screen, result]);

  const handlePredict = () => {
    if (!name.trim()) {
      const input = document.getElementById("name-input");
      if (input) {
        input.style.animation = "shakeAnim 0.4s ease";
        setTimeout(() => ((input as HTMLElement).style.animation = ""), 400);
      }
      return;
    }
    setScreen("scanning");
  };

  const handleTryAgain = () => {
    setResult(null);
    setScreen("landing");
    setScanProgress(0);
    setScanMsgIndex(0);
    setDisplayedMsg("");
  };

  const handleShare = () => {
    if (!result) return;
    const text = `🔮 ${name}'s Financial Future Revealed!\n\n💼 Status: ${result.status}\n💰 Balance: ${result.balance}\n📝 Reason: ${result.reason}\n🏆 Titles: ${result.titles.join(", ")}\n\nFind out YOUR future at: Rich or Broke Predictor 💸`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
  };

  return (
    <>
      {/* Global Styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #050510;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.3; }
        }
        @keyframes floatBg {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes shakeAnim {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-12px); }
          30%     { transform: translateX(10px); }
          45%     { transform: translateX(-8px); }
          60%     { transform: translateX(8px); }
          75%     { transform: translateX(-4px); }
          90%     { transform: translateX(4px); }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
          50%     { box-shadow: 0 0 40px rgba(255,215,0,0.7), 0 0 80px rgba(255,215,0,0.3); }
        }
        @keyframes titleGlow {
          0%,100% { text-shadow: 0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.3); }
          50%     { text-shadow: 0 0 40px rgba(255,215,0,0.9), 0 0 80px rgba(255,215,0,0.5), 0 0 120px rgba(255,215,0,0.3); }
        }
        @keyframes progressBar {
          0%   { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes scanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes cardEntrance {
          from { transform: translateY(60px) scale(0.95); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
        @keyframes richPulse {
          0%,100% { box-shadow: 0 0 40px rgba(255,215,0,0.3), 0 20px 60px rgba(0,0,0,0.8); }
          50%     { box-shadow: 0 0 80px rgba(255,215,0,0.6), 0 20px 60px rgba(0,0,0,0.8); }
        }
        @keyframes brokePulse {
          0%,100% { box-shadow: 0 0 40px rgba(255,68,68,0.3), 0 20px 60px rgba(0,0,0,0.8); }
          50%     { box-shadow: 0 0 80px rgba(255,68,68,0.6), 0 20px 60px rgba(0,0,0,0.8); }
        }
        @keyframes chaosPulse {
          0%,100% { box-shadow: 0 0 40px rgba(170,68,255,0.3), 0 20px 60px rgba(0,0,0,0.8); }
          50%     { box-shadow: 0 0 80px rgba(170,68,255,0.6), 0 20px 60px rgba(0,0,0,0.8); }
        }
        @keyframes spinEmoji {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        .glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .btn-glow:hover {
          transform: translateY(-2px);
          filter: brightness(1.15);
        }
        .btn-glow:active {
          transform: translateY(0) scale(0.97);
        }
        .title-text {
          animation: titleGlow 2.5s ease-in-out infinite;
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { outline: none; }
        .cursor::after {
          content: '|';
          animation: blink 0.8s step-end infinite;
        }
        @media (max-width: 480px) {
          .main-title { font-size: 28px !important; }
          .result-card { padding: 24px 20px !important; }
          .result-status { font-size: 20px !important; }
        }
      `}</style>

      {/* Floating Background */}
      <FloatingBg />

      {/* Confetti for rich */}
      {screen === "result" && result?.type === "rich" &&
        Array.from({ length: 20 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}

      {/* Broke particles */}
      {screen === "result" && result?.type === "broke" &&
        Array.from({ length: 10 }).map((_, i) => <BrokeParticle key={i} index={i} />)}

      {/* Premium Popup */}
      {showPremium && <PremiumPopup onClose={() => setShowPremium(false)} />}

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          animation: shaking ? "shakeAnim 0.8s ease" : undefined,
        }}
      >
        {/* ── LANDING SCREEN ── */}
        {screen === "landing" && (
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              textAlign: "center",
              animation: "slideUp 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,215,0,0.1)",
                border: "1px solid rgba(255,215,0,0.3)",
                borderRadius: "100px",
                padding: "6px 16px",
                color: "#FFD700",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              🤖 AI-Powered Financial Analysis v69.0
            </div>

            {/* Title */}
            <h1
              className="main-title title-text"
              style={{
                fontSize: "42px",
                fontWeight: 900,
                color: "#FFD700",
                lineHeight: 1.1,
                marginBottom: "16px",
                letterSpacing: "-1px",
              }}
            >
              💸 Rich or Broke<br />Predictor
            </h1>

            {/* Subtitle */}
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "16px",
                marginBottom: "8px",
                lineHeight: 1.6,
              }}
            >
              AI Financial Future Analysis System
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
                marginBottom: "40px",
                fontStyle: "italic",
              }}
            >
              100% Accurate... maybe 😭
            </p>

            {/* Card */}
            <div
              className="glass"
              style={{
                borderRadius: "24px",
                padding: "36px 32px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  textAlign: "left",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Your Name (for the AI to judge)
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                placeholder="Enter your name here..."
                maxLength={40}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "14px",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "20px",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255,215,0,0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                className="btn-glow"
                onClick={handlePredict}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#000",
                  fontSize: "18px",
                  fontWeight: 900,
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  animation: "pulseGlow 2s ease-in-out infinite",
                  boxShadow: "0 0 30px rgba(255,215,0,0.4)",
                }}
              >
                🔮 Predict My Future
              </button>
            </div>

            {/* Footer note */}
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
              Warning: Results may cause existential crisis 😬 &nbsp;•&nbsp; Not responsible for tears
            </p>
          </div>
        )}

        {/* ── SCANNING SCREEN ── */}
        {screen === "scanning" && (
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              textAlign: "center",
              animation: "fadeIn 0.5s ease",
            }}
          >
            {/* Scanning visual */}
            <div
              className="glass"
              style={{
                borderRadius: "24px",
                padding: "40px 32px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                marginBottom: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Scan line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #FFD700, transparent)",
                  animation: "scanLine 2s linear infinite",
                  opacity: 0.6,
                  zIndex: 2,
                }}
              />

              {/* Avatar scan */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 24px",
                  background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.1))",
                  border: "2px solid rgba(255,215,0,0.4)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  animation: "pulseGlow 1.5s ease-in-out infinite",
                  boxShadow: "0 0 30px rgba(255,215,0,0.3)",
                }}
              >
                🤖
              </div>

              <h2
                style={{
                  color: "#FFD700",
                  fontSize: "22px",
                  fontWeight: 800,
                  marginBottom: "8px",
                }}
              >
                Analyzing {name}'s Future...
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "13px",
                  marginBottom: "28px",
                }}
              >
                Please don't close this tab (it won't help anyway)
              </p>

              {/* Typing message */}
              <div
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,215,0,0.15)",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  marginBottom: "24px",
                  minHeight: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "10px",
                  textAlign: "left",
                }}
              >
                <span style={{ color: "#00FF88", fontSize: "12px", flexShrink: 0, fontFamily: "monospace" }}>
                  AI›
                </span>
                <span
                  className="cursor"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    lineHeight: 1.5,
                  }}
                >
                  {displayedMsg}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "100px",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${scanProgress}%`,
                    background: "linear-gradient(90deg, #FFD700, #00FF88, #FFD700)",
                    backgroundSize: "200% 100%",
                    animation: "progressBar 1.5s linear infinite",
                    borderRadius: "100px",
                    transition: "width 0.1s linear",
                    boxShadow: "0 0 10px rgba(255,215,0,0.6)",
                  }}
                />
              </div>
              <div
                style={{
                  color: "#FFD700",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {Math.floor(scanProgress)}% Complete
              </div>
            </div>

            {/* Scan steps list */}
            <div className="glass" style={{ borderRadius: "16px", padding: "16px 20px" }}>
              {SCAN_MESSAGES.slice(0, Math.min(scanMsgIndex + 1, SCAN_MESSAGES.length)).map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 0",
                    borderBottom:
                      i < Math.min(scanMsgIndex, SCAN_MESSAGES.length - 1)
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {i < scanMsgIndex ? "✅" : i === scanMsgIndex ? "⏳" : "⬜"}
                  </span>
                  <span
                    style={{
                      color: i < scanMsgIndex ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.8)",
                      fontSize: "13px",
                      textDecoration: i < scanMsgIndex ? "line-through" : "none",
                    }}
                  >
                    {msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULT SCREEN ── */}
        {screen === "result" && result && (
          <div
            style={{
              maxWidth: "560px",
              width: "100%",
              textAlign: "center",
              animation: "cardEntrance 0.7s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Big emoji */}
            <div
              style={{
                fontSize: "80px",
                marginBottom: "8px",
                animation: result.type === "rich" ? "bounce 1s ease-in-out infinite" : result.type === "chaos" ? "spinEmoji 3s linear infinite" : "shakeAnim 1s ease 0.5s",
              }}
            >
              {result.emoji}
            </div>

            {/* Result label */}
            <div
              style={{
                display: "inline-block",
                background:
                  result.type === "rich"
                    ? "rgba(255,215,0,0.15)"
                    : result.type === "broke"
                    ? "rgba(255,68,68,0.15)"
                    : "rgba(170,68,255,0.15)",
                border: `1px solid ${result.color}44`,
                borderRadius: "100px",
                padding: "6px 20px",
                color: result.color,
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              {result.type === "rich" ? "🟡 RICH RESULT" : result.type === "broke" ? "🔴 BROKE RESULT" : "🟣 CHAOS RESULT"}
            </div>

            {/* Main card */}
            <div
              className="result-card glass"
              style={{
                borderRadius: "24px",
                padding: "36px 32px",
                border: `1px solid ${result.color}33`,
                boxShadow:
                  result.type === "rich"
                    ? "0 0 60px rgba(255,215,0,0.2), 0 20px 60px rgba(0,0,0,0.8)"
                    : result.type === "broke"
                    ? "0 0 60px rgba(255,68,68,0.2), 0 20px 60px rgba(0,0,0,0.8)"
                    : "0 0 60px rgba(170,68,255,0.2), 0 20px 60px rgba(0,0,0,0.8)",
                animation:
                  result.type === "rich"
                    ? "richPulse 2s ease-in-out infinite"
                    : result.type === "broke"
                    ? "brokePulse 2s ease-in-out infinite"
                    : "chaosPulse 2s ease-in-out infinite",
                marginBottom: "16px",
              }}
            >
              {/* Name greeting */}
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "4px" }}>
                Financial Report for
              </p>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "26px",
                  fontWeight: 900,
                  marginBottom: "24px",
                  letterSpacing: "-0.5px",
                }}
              >
                {name} 📋
              </h2>

              {/* Stats grid */}
              {[
                { label: "Future Status", value: result.status },
                { label: "Bank Balance", value: result.balance },
                { label: "Root Cause", value: result.reason },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${result.color}22`,
                    borderRadius: "14px",
                    padding: "16px 20px",
                    marginBottom: "12px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      color: result.color,
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="result-status"
                    style={{
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}

              {/* Titles */}
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${result.color}22`,
                  borderRadius: "14px",
                  padding: "16px 20px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: result.color,
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  Certified Titles 🏆
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {result.titles.map((title) => (
                    <span
                      key={title}
                      style={{
                        background: `${result.color}18`,
                        border: `1px solid ${result.color}44`,
                        borderRadius: "8px",
                        padding: "6px 12px",
                        color: result.color,
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Funny disclaimer */}
              <p
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "11px",
                  marginTop: "20px",
                  fontStyle: "italic",
                }}
              >
                *This analysis was conducted by a very serious AI with zero actual data 🤖 (Results may vary based on
                cosmic alignment and snack budget)
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
              <button
                className="btn-glow"
                onClick={handleShare}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "14px 20px",
                  background: copied
                    ? "linear-gradient(135deg, #00C851, #007E33)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                  border: `1px solid ${copied ? "#00C85180" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: "14px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
              >
                {copied ? "✅ Copied!" : "📤 Share Result"}
              </button>
              <button
                className="btn-glow"
                onClick={handleTryAgain}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))",
                  border: "1px solid rgba(255,215,0,0.3)",
                  borderRadius: "14px",
                  color: "#FFD700",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backdropFilter: "blur(10px)",
                }}
              >
                🔄 Try Again
              </button>
            </div>

            {/* Premium upgrade */}
            <button
              className="btn-glow"
              onClick={() => setShowPremium(true)}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, rgba(170,68,255,0.2), rgba(100,0,255,0.1))",
                border: "1px solid rgba(170,68,255,0.4)",
                borderRadius: "14px",
                color: "#CC88FF",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>🔒</span>
              <span>Unlock Premium Financial Report — ৳49</span>
              <span
                style={{
                  background: "rgba(170,68,255,0.3)",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: "11px",
                  letterSpacing: "1px",
                }}
              >
                HOT
              </span>
            </button>

            {/* Accuracy disclaimer */}
            <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px", marginTop: "16px" }}>
              Accuracy: 100% (confidence: very low) 😬 &nbsp;•&nbsp; Made with 💸 and zero financial knowledge
            </p>
          </div>
        )}
      </div>
    </>
  );
}
