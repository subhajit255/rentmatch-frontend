import React, { useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const renterSteps = [
  {
    num: "01",
    icon: "✍️",
    title: "Create your rental profile",
    desc: "Tell us what you're looking for once, then use your profile across every match.",
    bullets: ["Budget and preferred suburbs", "Move-in date and household details"],
  },
  {
    num: "02",
    icon: "✨",
    title: "See your best matches",
    desc: "We surface homes aligned with your needs, so you spend less time on unsuitable listings.",
    bullets: ["Clear match indicators", "Save and compare favourites"],
  },
  {
    num: "03",
    icon: "🔑",
    title: "Connect and move forward",
    desc: "Express interest, organise an inspection and share your profile when you're ready.",
    bullets: ["Direct, transparent communication", "Your details stay in your control"],
  },
];

const landlordSteps = [
  {
    num: "01",
    icon: "🏠",
    title: "List your property",
    desc: "Add the essentials and explain the type of household that will suit the home.",
    bullets: ["Flexible listing preferences", "One simple property dashboard"],
  },
  {
    num: "02",
    icon: "🎯",
    title: "Review matched renters",
    desc: "See relevant renter profiles based on your property and lease requirements.",
    bullets: ["Structured profiles at a glance", "Focus on genuine fit"],
  },
  {
    num: "03",
    icon: "🤝",
    title: "Connect with confidence",
    desc: "Invite suitable renters to take the next step and keep your shortlist organised.",
    bullets: ["Less back-and-forth", "Works for owners and managers"],
  },
];

const benefits = [
  { icon: "⚡", title: "Quicker shortlists", desc: "Relevant matches rise to the top without endless scrolling." },
  { icon: "🧭", title: "Clear preferences", desc: "Know the key requirements before taking the next step." },
  { icon: "🛡️", title: "Privacy first", desc: "Share your details with the people you choose." },
  { icon: "🇦🇺", title: "Built for Australia", desc: "Local language, weekly rent and familiar rental journeys." },
];

/* ─────────────────────────────────────────────
   SHARED STYLE TOKENS
───────────────────────────────────────────── */
const wrapStyle: React.CSSProperties = {
  width: "min(1160px, calc(100% - 40px))",
  margin: "0 auto",
};

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#075d51",
  marginBottom: 4,
};

const primaryBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 46,
  padding: "0 22px",
  borderRadius: 999,
  background: "#075d51",
  color: "white",
  fontWeight: 700,
  border: "1px solid #075d51",
  textDecoration: "none",
  cursor: "pointer",
  fontSize: 15,
  transition: "background .2s, transform .2s",
};

const matchCardStyle: React.CSSProperties = {
  position: "relative",
  background: "white",
  border: "1px solid rgba(219,229,226,.8)",
  borderRadius: 28,
  padding: 26,
  boxShadow: "0 20px 50px rgba(16,42,42,.09)",
};

const badgeStyle: React.CSSProperties = {
  padding: "7px 11px",
  borderRadius: 999,
  background: "#dff5eb",
  color: "#075d51",
  fontSize: 12,
  fontWeight: 800,
};

/* ─────────────────────────────────────────────
   STEP CARD SUB-COMPONENT
───────────────────────────────────────────── */
const StepCard = ({
  num,
  icon,
  title,
  desc,
  bullets,
}: {
  num: string;
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      style={{
        position: "relative",
        border: "1px solid #dbe5e2",
        borderRadius: 22,
        padding: 30,
        background: "#fff",
        transition: "transform .2s, box-shadow .2s",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 50px rgba(16,42,42,.09)" : "none",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 30,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(145deg,#f1f8f5,#fff)",
          border: "1px solid #e6efec",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "absolute",
          zIndex: 1,
          right: 45,
          top: 52,
          fontSize: 30,
          lineHeight: 1,
        }}
      >
        {icon}
      </span>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "#dff5eb",
          color: "#075d51",
          fontFamily: "Manrope,sans-serif",
          fontWeight: 800,
          fontSize: 16,
          marginBottom: 52,
        }}
      >
        {num}
      </div>
      <h3
        style={{
          fontFamily: "Manrope,sans-serif",
          fontSize: 22,
          letterSpacing: "-0.035em",
          marginBottom: 10,
          fontWeight: 800,
          marginTop: 0,
        }}
      >
        {title}
      </h3>
      <p style={{ color: "#5d7070", margin: 0 }}>{desc}</p>
      <ul
        style={{
          padding: 0,
          margin: "18px 0 0",
          listStyle: "none",
          color: "#075d51",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {bullets.map((b) => (
          <li key={b} style={{ marginTop: 7 }}>
            <span style={{ marginRight: 8 }}>✓</span>
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
};

/* ─────────────────────────────────────────────
   BENEFIT CARD SUB-COMPONENT
───────────────────────────────────────────── */
const BenefitCard = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #dbe5e2",
        borderRadius: 18,
        padding: 22,
        transition: "box-shadow .2s, transform .2s",
        boxShadow: hovered ? "0 20px 50px rgba(16,42,42,.09)" : "none",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <b
        style={{
          display: "block",
          fontFamily: "Manrope,sans-serif",
          fontWeight: 700,
          fontSize: 17,
          margin: "8px 0",
        }}
      >
        {title}
      </b>
      <p style={{ fontSize: 14, margin: 0, color: "#5d7070" }}>{desc}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const HowItWorks = () => {
  const [view, setView] = useState<"renter" | "landlord">("renter");
  const [animating, setAnimating] = useState(false);

  const steps = view === "renter" ? renterSteps : landlordSteps;

  const handleSwitch = (next: "renter" | "landlord") => {
    if (next === view) return;
    setAnimating(true);
    setTimeout(() => {
      setView(next);
      setAnimating(false);
    }, 220);
  };

  return (
    <main
      style={{
        fontFamily: '"DM Sans", system-ui, sans-serif',
        color: "#102a2a",
        background: "#fff",
        margin: 0,
        lineHeight: 1.55,
      }}
    >
      {/* ── HERO ────────────────────────────────────── */}
      <section
        style={{
          overflow: "hidden",
          background:
            "linear-gradient(145deg,#f4fbf7 0%,#eff8f4 65%,#e5f6ee 100%)",
          padding: "82px 0 74px",
        }}
      >
        <div style={wrapStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              alignItems: "center",
              gap: 70,
            }}
            className="hiw-hero-grid"
          >
            {/* Left copy */}
            <div>
              <span style={eyebrowStyle}>A better way to rent</span>
              <h1
                style={{
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontSize: "clamp(32px, 5.8vw, 72px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.035em",
                  margin: "18px 0 22px",
                  fontWeight: 800,
                }}
              >
                Find the right rental.{" "}
                <em style={{ fontStyle: "normal", color: "#075d51" }}>
                  Find the right match.
                </em>
              </h1>
              <p
                style={{
                  fontSize: 19,
                  color: "#5d7070",
                  maxWidth: 590,
                  margin: "0 0 32px",
                }}
              >
                RentMatch brings renters and landlords together based on what
                matters—from location and budget to lifestyle and lease
                preferences.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#how" style={primaryBtnStyle}>
                  See how it works →
                </a>
                <a
                  href="/find-property"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0 12px",
                    fontWeight: 700,
                    color: "#075d51",
                    textDecoration: "none",
                  }}
                >
                  Browse rentals
                </a>
              </div>
            </div>

            {/* Right: match card */}
            <div style={matchCardStyle}>
              <div
                style={{
                  position: "absolute",
                  zIndex: -1,
                  width: 230,
                  height: 230,
                  borderRadius: "50%",
                  background: "#b9e567",
                  opacity: 0.35,
                  right: -60,
                  top: -55,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <strong
                  style={{ fontFamily: "Manrope,sans-serif", fontSize: 17 }}
                >
                  Your latest match
                </strong>
                <span style={badgeStyle}>96% match</span>
              </div>

              {/* Property card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg,#0a695b,#0f7a69)",
                  borderRadius: 20,
                  padding: 22,
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 15,
                  }}
                >
                  <div>
                    <small style={{ opacity: 0.8 }}>
                      Available now · Newport, NSW
                    </small>
                    <h3
                      style={{
                        fontFamily: "Manrope,sans-serif",
                        fontSize: 22,
                        margin: "8px 0 5px",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      Light-filled coastal home
                    </h3>
                    <p style={{ margin: 0, opacity: 0.8 }}>
                      3 bed · 2 bath · 1 car
                    </p>
                  </div>
                  <span style={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                    $850/wk
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 7,
                    flexWrap: "wrap",
                    marginTop: 20,
                  }}
                >
                  {["Pet friendly", "12-month lease", "Near transport"].map(
                    (t) => (
                      <span
                        key={t}
                        style={{
                          background: "rgba(255,255,255,.13)",
                          padding: "7px 10px",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* People row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {[
                  {
                    avatar: "👩",
                    label: "Verified renter",
                    sub: "Profile complete",
                  },
                  {
                    avatar: "🏡",
                    label: "Verified listing",
                    sub: "Ready to inspect",
                  },
                ].map((p) => (
                  <div
                    key={p.label}
                    style={{
                      border: "1px solid #dbe5e2",
                      borderRadius: 15,
                      padding: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#eaf0ff",
                        fontSize: 18,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {p.avatar}
                    </span>
                    <div>
                      <strong style={{ fontSize: 13, display: "block" }}>
                        {p.label}
                      </strong>
                      <small style={{ color: "#5d7070" }}>{p.sub}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how" style={{ padding: "92px 0" }}>
        <div style={wrapStyle}>
          <div
            style={{ textAlign: "center", maxWidth: 690, margin: "0 auto 42px" }}
          >
            <span style={eyebrowStyle}>Simple from day one</span>
            <h2
              style={{
                fontFamily: "Manrope,sans-serif",
                fontSize: "clamp(34px, 4vw, 50px)",
                lineHeight: 1.12,
                letterSpacing: "-0.035em",
                margin: "12px 0 14px",
                fontWeight: 800,
              }}
            >
              How RentMatch works
            </h2>
            <p style={{ color: "#5d7070", fontSize: 17 }}>
              Choose your journey to see how we make finding a home—or the
              right tenant—simpler.
            </p>

            {/* Toggle */}
            <div
              role="tablist"
              aria-label="Choose journey"
              style={{
                display: "inline-flex",
                background: "#edf2f0",
                padding: 5,
                borderRadius: 999,
                marginTop: 18,
                gap: 4,
              }}
            >
              {(["renter", "landlord"] as const).map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => handleSwitch(v)}
                  style={{
                    border: 0,
                    background: view === v ? "#075d51" : "transparent",
                    color: view === v ? "#fff" : "#5d7070",
                    padding: "12px 24px",
                    borderRadius: 999,
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: 14,
                    boxShadow:
                      view === v ? "0 6px 18px rgba(7,93,81,.18)" : "none",
                    transition: "all .2s",
                    fontFamily: "inherit",
                  }}
                >
                  {v === "renter" ? "I'm a renter" : "I'm a landlord"}
                </button>
              ))}
            </div>
          </div>

          {/* Steps grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 22,
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity .22s ease, transform .22s ease",
            }}
            className="hiw-steps-grid"
          >
            {steps.map((s) => (
              <StepCard key={s.num + view} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RENTMATCH ────────────────────────────── */}
      <section style={{ background: "#f7faf8", padding: "92px 0" }}>
        <div style={wrapStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.85fr 1.15fr",
              gap: 80,
              alignItems: "center",
            }}
            className="hiw-why-grid"
          >
            <div>
              <span style={eyebrowStyle}>Why RentMatch</span>
              <h2
                style={{
                  fontFamily: "Manrope,sans-serif",
                  fontSize: "clamp(34px, 4vw, 48px)",
                  lineHeight: 1.13,
                  letterSpacing: "-0.035em",
                  margin: "14px 0",
                  fontWeight: 800,
                }}
              >
                Less searching.
                <br />
                More matching.
              </h2>
              <p style={{ color: "#5d7070", marginBottom: 28 }}>
                Traditional rental platforms make everyone sort through volume.
                RentMatch focuses on compatibility, clarity and better first
                conversations.
              </p>
              <a href="/email-verification" style={primaryBtnStyle}>
                Create your free profile →
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {benefits.map((b) => (
                <BenefitCard key={b.title} {...b} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section style={{ padding: "70px 0" }}>
        <div style={wrapStyle}>
          <div
            style={{
              background: "#075d51",
              color: "#fff",
              borderRadius: 30,
              padding: "54px 58px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 35,
              position: "relative",
              overflow: "hidden",
            }}
            className="hiw-cta-box"
          >
            <div
              style={{
                position: "absolute",
                width: 250,
                height: 250,
                borderRadius: "50%",
                background: "#b9e567",
                opacity: 0.13,
                right: -70,
                top: -100,
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontFamily: "Manrope,sans-serif",
                  fontSize: "clamp(30px, 4vw, 46px)",
                  letterSpacing: "-0.035em",
                  margin: "0 0 8px",
                  fontWeight: 800,
                }}
              >
                Ready to meet your match?
              </h2>
              <p style={{ margin: 0, opacity: 0.78, fontSize: 17 }}>
                Create your profile and turn a long search into a smarter
                shortlist.
              </p>
            </div>
            <a
              href="/email-verification"
              style={{
                ...primaryBtnStyle,
                background: "white",
                color: "#075d51",
                borderColor: "white",
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 1,
              }}
            >
              Get started free →
            </a>
          </div>
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
        .hiw-hero-grid  { grid-template-columns: 1.05fr 0.95fr !important; }
        .hiw-steps-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .hiw-why-grid   { grid-template-columns: 0.85fr 1.15fr !important; }
        @media (max-width: 900px) {
          .hiw-hero-grid  { grid-template-columns: 1fr !important; }
          .hiw-steps-grid { grid-template-columns: 1fr !important; }
          .hiw-why-grid   { grid-template-columns: 1fr !important; }
          .hiw-cta-box    { flex-direction: column !important; align-items: flex-start !important; padding: 42px !important; }
        }
        @media (max-width: 560px) {
          .hiw-cta-box { padding: 34px 26px !important; }
        }
      `}</style>
    </main>
  );
};

export default HowItWorks;
