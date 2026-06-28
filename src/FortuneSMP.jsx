import { useState, useEffect, useRef } from "react";
import {
  Compass, Users, Swords, Sparkles, Heart, Mountain,
  Copy, Check, MessageCircle, Home as HomeIcon, Server, ArrowRight
} from "lucide-react";

/* ---------------------------------------------------------------
   FORTUNE SMP
   Palette  : void #0B0A14 / #14101F, parchment text #ECE6F5,
              enchant gold #F2B33D / #FFD773, lapis #5B7FE0 (rare accent)
   Type     : "Press Start 2P" (display, used sparingly) +
              "Sora" (body) + "JetBrains Mono" (server data/utility)
   Signature: an "enchanting table" panel — IP address floats inside
              a glowing rune circle with orbiting particles, and the
              hero skyline is built from hand-placed pixel blocks
              rather than a stock screenshot.
----------------------------------------------------------------*/

const DISCORD_URL = "https://discord.gg/XThaPgmzzD";
const JAVA_IP = "fortunesmp.mcsh.io";
const BEDROCK_IP = "fortunesmp.mcsh.io";
const BEDROCK_PORT = "19132";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .font-pixel { font-family: 'Press Start 2P', monospace; }
    .font-body { font-family: 'Sora', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    .fsmp-root { background: #0B0A14; color: #ECE6F5; }

    @keyframes drift {
      0% { transform: translateY(0) translateX(0); opacity: .25; }
      50% { transform: translateY(-18px) translateX(8px); opacity: .6; }
      100% { transform: translateY(0) translateX(0); opacity: .25; }
    }
    @keyframes glowpulse {
      0%, 100% { box-shadow: 0 0 18px 2px rgba(242,179,61,0.25), inset 0 0 24px rgba(242,179,61,0.06); }
      50% { box-shadow: 0 0 34px 6px rgba(242,179,61,0.45), inset 0 0 32px rgba(242,179,61,0.12); }
    }
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
    }
    @keyframes blockrise {
      0% { transform: translateY(14px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes flicker {
      0%, 100% { opacity: 1; }
      45% { opacity: .7; }
      55% { opacity: .85; }
    }
    @keyframes fadein {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scancloud {
      from { transform: translateX(-10%); }
      to   { transform: translateX(10%); }
    }

    .fsmp-fadein { animation: fadein .7s ease both; }
    .fsmp-particle { animation: drift 6s ease-in-out infinite; }
    .fsmp-enchant { animation: glowpulse 3.4s ease-in-out infinite; }
    .fsmp-flicker { animation: flicker 4s ease-in-out infinite; }
    .fsmp-block { animation: blockrise .5s ease both; }

    .fsmp-scrollbar::-webkit-scrollbar { width: 10px; }
    .fsmp-scrollbar::-webkit-scrollbar-track { background: #0B0A14; }
    .fsmp-scrollbar::-webkit-scrollbar-thumb { background: #3a2f55; border-radius: 6px; }

    html { scroll-behavior: smooth; }

    @media (prefers-reduced-motion: reduce) {
      .fsmp-particle, .fsmp-enchant, .fsmp-flicker, .fsmp-block, .fsmp-fadein { animation: none !important; }
    }
  `}</style>
);

/* ---------- small atoms ---------- */

function PixelBlock({ size = 18, color = "#F2B33D", style = {}, glow = false }) {
  return (
    <div
      className="fsmp-block"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: glow
          ? `0 0 ${size * 1.4}px ${color}55, inset -3px -3px 0 rgba(0,0,0,0.25), inset 3px 3px 0 rgba(255,255,255,0.18)`
          : `inset -3px -3px 0 rgba(0,0,0,0.25), inset 3px 3px 0 rgba(255,255,255,0.18)`,
        ...style,
      }}
    />
  );
}

function Particle({ left, top, delay, size = 3, color = "#FFD773" }) {
  return (
    <span
      className="fsmp-particle absolute rounded-full"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function NavBar({ page, setPage }) {
  const items = [
    { id: "home", label: "HOME", icon: HomeIcon },
    { id: "discord", label: "DISCORD", icon: MessageCircle },
    { id: "ip", label: "SERVER IP", icon: Server },
    { id: "thanks", label: "THANK YOU", icon: Heart },
  ];
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0B0A14]/80 border-b border-[#F2B33D]/15">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2 group"
        >
          <PixelBlock size={20} color="#F2B33D" glow />
          <span className="font-pixel text-[11px] sm:text-xs text-[#FFD773] tracking-wide group-hover:text-white transition-colors">
            FORTUNE SMP
          </span>
        </button>
        <div className="flex items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs">
          {items.map((it) => {
            const Icon = it.icon;
            const active = page === it.id;
            return (
              <button
                key={it.id}
                onClick={() => setPage(it.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-md transition-all duration-300 ${
                  active
                    ? "text-[#FFD773] bg-[#F2B33D]/10 shadow-[0_0_12px_rgba(242,179,61,0.25)]"
                    : "text-[#ECE6F5]/60 hover:text-[#FFD773] hover:bg-white/5"
                }`}
              >
                <Icon size={13} className="shrink-0" />
                <span className="hidden sm:inline">{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#F2B33D]/10 py-8 text-center font-mono text-[11px] text-[#ECE6F5]/40">
      © Fortune SMP — Made for Minecraft Players
    </footer>
  );
}

function GlowButton({ children, onClick, variant = "gold", icon: Icon, className = "" }) {
  const styles =
    variant === "gold"
      ? "bg-gradient-to-b from-[#FFD773] to-[#F2B33D] text-[#1a1306] hover:shadow-[0_0_36px_rgba(242,179,61,0.55)] border-[#FFE9A8]"
      : "bg-gradient-to-b from-[#6C7BF0] to-[#5865F2] text-white hover:shadow-[0_0_36px_rgba(88,101,242,0.55)] border-[#8B97F7]";
  return (
    <button
      onClick={onClick}
      className={`font-mono font-semibold text-sm tracking-wide px-7 py-3.5 rounded-lg border-b-4 ${styles} transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 justify-center ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

/* ---------- hero skyline made of pixel blocks ---------- */

function Skyline() {
  // simple silhouette: ground row + scattered tower/tree clusters
  const groundCols = 40;
  return (
    <div className="absolute bottom-0 left-0 w-full h-40 sm:h-56 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-end justify-center gap-0">
        {Array.from({ length: groundCols }).map((_, i) => {
          const h = 14 + Math.round(Math.abs(Math.sin(i * 0.7)) * 30) + (i % 7 === 0 ? 26 : 0);
          const tone = i % 5 === 0 ? "#3c2f1d" : i % 3 === 0 ? "#2b2417" : "#241d12";
          return (
            <div
              key={i}
              style={{
                width: `${100 / groundCols}%`,
                height: h,
                background: tone,
                boxShadow: "inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.05)",
              }}
            />
          );
        })}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0A14] to-transparent" />
    </div>
  );
}

/* ---------- HOME ---------- */

function Home({ setPage }) {
  const serverRef = useRef(null);
  const scrollToServer = () => {
    serverRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { icon: Mountain, title: "Survival Adventures", text: "Carve out your own corner of the world — mine, farm, build, and survive on your terms." },
    { icon: Compass, title: "Java + Bedrock Crossplay", text: "Play with friends no matter which edition they're on. One world, every platform." },
    { icon: Users, title: "Active Community", text: "Real players online day and night, always ready for one more build or one more trade." },
    { icon: Sparkles, title: "Custom Events", text: "Seasonal builds, tournaments, and surprises that keep the world feeling alive." },
    { icon: Heart, title: "Friendly Players", text: "A community that helps newcomers find their feet instead of griefing them on day one." },
    { icon: Swords, title: "Endless Exploration", text: "New biomes, new ruins, new stories — there's always another horizon to chase." },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 28 }).map((_, i) => (
            <Particle
              key={i}
              left={(i * 13) % 100}
              top={(i * 27) % 70}
              delay={i * 0.3}
              size={i % 4 === 0 ? 3 : 2}
              color={i % 3 === 0 ? "#FFD773" : "#9FB4FF"}
            />
          ))}
        </div>
        {/* moving cloud band */}
        <div
          className="absolute top-16 left-0 w-[140%] h-20 opacity-[0.05]"
          style={{
            background: "repeating-linear-gradient(90deg, #ECE6F5 0 60px, transparent 60px 140px)",
            animation: "scancloud 22s ease-in-out infinite alternate",
          }}
        />

        <div className="relative z-10 text-center fsmp-fadein">
          <div className="flex justify-center gap-1.5 mb-6">
            {["#F2B33D", "#FFD773", "#5B7FE0", "#FFD773", "#F2B33D"].map((c, i) => (
              <PixelBlock key={i} size={14} color={c} glow={i === 2} />
            ))}
          </div>
          <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-[#FFD773] fsmp-flicker leading-relaxed tracking-wide drop-shadow-[0_0_25px_rgba(242,179,61,0.5)]">
            FORTUNE SMP
          </h1>
          <p className="font-body mt-6 text-lg sm:text-xl text-[#ECE6F5]/90">
            A New Adventure Awaits...
          </p>
          <p className="font-body mt-1 text-sm sm:text-base text-[#ECE6F5]/55 max-w-md mx-auto">
            Join a community where legends are created.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton onClick={scrollToServer} icon={ArrowRight}>
              JOIN THE SERVER
            </GlowButton>
            <GlowButton variant="discord" icon={MessageCircle} onClick={() => window.open(DISCORD_URL, "_blank")}>
              JOIN DISCORD
            </GlowButton>
          </div>
        </div>

        <Skyline />
      </section>

      {/* ABOUT */}
      <section className="relative py-24 px-6 border-t border-[#F2B33D]/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs text-[#F2B33D] tracking-[0.2em] mb-3">ABOUT THE WORLD</p>
          <h2 className="font-pixel text-xl sm:text-2xl text-[#ECE6F5] mb-6 leading-relaxed">
            What is Fortune SMP?
          </h2>
          <p className="font-body text-[#ECE6F5]/70 leading-relaxed text-base sm:text-lg">
            Fortune SMP is a Minecraft survival community where players build, explore, compete,
            and create their own stories. No two adventures look the same — bring an idea, a friend,
            or just a pickaxe, and the world takes care of the rest.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-20 px-6 border-t border-[#F2B33D]/10">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-[#F2B33D] tracking-[0.2em] mb-3 text-center">WHAT YOU'LL FIND</p>
          <h2 className="font-pixel text-xl sm:text-2xl text-[#ECE6F5] mb-14 text-center leading-relaxed">
            Built For Players Like You
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group relative rounded-xl p-6 bg-white/[0.03] border border-[#F2B33D]/15 backdrop-blur-sm transition-all duration-300 hover:border-[#F2B33D]/50 hover:bg-white/[0.05] hover:-translate-y-1"
                  style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 28px rgba(242,179,61,0.18)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)")}
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-[#F2B33D]/10 text-[#FFD773] group-hover:bg-[#F2B33D]/20 transition-colors">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-body font-semibold text-[#ECE6F5] mb-2">{f.title}</h3>
                  <p className="font-body text-sm text-[#ECE6F5]/55 leading-relaxed">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section ref={serverRef} className="relative py-28 px-6 border-t border-[#F2B33D]/10 overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 14 }).map((_, i) => (
            <Particle key={i} left={(i * 19) % 100} top={(i * 31) % 100} delay={i * 0.4} color="#5B7FE0" size={2} />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <PixelBlock key={i} size={16} color={i === 2 ? "#5B7FE0" : "#F2B33D"} glow={i === 2} />
            ))}
          </div>
          <h2 className="font-pixel text-2xl sm:text-3xl text-[#FFD773] mb-4 leading-relaxed">
            Your Adventure Begins Here
          </h2>
          <p className="font-body text-[#ECE6F5]/60 mb-10">
            Two editions, one world. Grab the IP and step in.
          </p>
          <GlowButton icon={Server} onClick={() => setPage("ip")}>
            GET SERVER IP
          </GlowButton>
        </div>
      </section>
    </div>
  );
}

/* ---------- DISCORD ---------- */

function DiscordPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
      <div className="absolute inset-0">
        {Array.from({ length: 22 }).map((_, i) => (
          <Particle key={i} left={(i * 17) % 100} top={(i * 23) % 100} delay={i * 0.25} color="#7C8BFF" size={2.5} />
        ))}
      </div>
      <div className="relative z-10 max-w-xl w-full text-center fsmp-fadein">
        <div className="mx-auto mb-8 w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-b from-[#7C8BFF] to-[#5865F2] fsmp-enchant" style={{ boxShadow: "0 0 40px rgba(88,101,242,0.5)" }}>
          <MessageCircle size={42} className="text-white" />
        </div>
        <p className="font-mono text-xs text-[#7C8BFF] tracking-[0.2em] mb-3">THE GATHERING HALL</p>
        <h1 className="font-pixel text-2xl sm:text-3xl text-[#ECE6F5] mb-6 leading-relaxed">
          Join Our Community
        </h1>
        <p className="font-body text-[#ECE6F5]/65 leading-relaxed mb-10">
          Stay connected with players, get updates, participate in events, and become part of
          the Fortune SMP family.
        </p>
        <GlowButton
          variant="discord"
          icon={MessageCircle}
          onClick={() => window.open(DISCORD_URL, "_blank")}
          className="mx-auto w-full sm:w-auto text-base px-10 py-4"
        >
          JOIN DISCORD
        </GlowButton>
      </div>
    </section>
  );
}

/* ---------- SERVER IP ---------- */

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard may be unavailable in this environment */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="flex items-center justify-between gap-3 bg-[#0B0A14] border border-[#F2B33D]/30 rounded-lg px-4 py-3">
      <div>
        <p className="font-mono text-[10px] text-[#ECE6F5]/40 tracking-wide mb-1">{label}</p>
        <p className="font-mono text-sm sm:text-base text-[#FFD773]">{value}</p>
      </div>
      <button
        onClick={copy}
        className="shrink-0 flex items-center gap-1.5 font-mono text-xs px-3 py-2 rounded-md bg-[#F2B33D]/10 text-[#FFD773] hover:bg-[#F2B33D]/20 transition-colors"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function EnchantPanel({ title, children }) {
  return (
    <div className="relative rounded-2xl p-7 bg-white/[0.03] border border-[#F2B33D]/20 fsmp-enchant">
      <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#0B0A14] border border-[#F2B33D]/30">
        <span className="font-mono text-[10px] text-[#FFD773] tracking-[0.15em]">{title}</span>
      </div>
      <div className="mt-3 space-y-4">{children}</div>
    </div>
  );
}

function ServerIpPage() {
  return (
    <section className="relative min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14 fsmp-fadein">
          <p className="font-mono text-xs text-[#F2B33D] tracking-[0.2em] mb-3">STEP THROUGH</p>
          <h1 className="font-pixel text-2xl sm:text-3xl text-[#ECE6F5] leading-relaxed">
            Ready To Enter Fortune SMP?
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <EnchantPanel title="JAVA EDITION">
            <CopyField label="SERVER IP" value={JAVA_IP} />
            <div>
              <p className="font-mono text-[10px] text-[#ECE6F5]/40 tracking-wide mb-2">HOW TO CONNECT</p>
              <ol className="font-body text-sm text-[#ECE6F5]/70 space-y-1.5 list-decimal list-inside">
                <li>Open Minecraft Java Edition</li>
                <li>Go to Multiplayer</li>
                <li>Select Add Server</li>
                <li>Enter the IP above</li>
              </ol>
            </div>
          </EnchantPanel>

          <EnchantPanel title="BEDROCK EDITION">
            <CopyField label="SERVER IP" value={BEDROCK_IP} />
            <CopyField label="PORT" value={BEDROCK_PORT} />
            <div>
              <p className="font-mono text-[10px] text-[#ECE6F5]/40 tracking-wide mb-2">HOW TO CONNECT</p>
              <ol className="font-body text-sm text-[#ECE6F5]/70 space-y-1.5 list-decimal list-inside">
                <li>Open Minecraft Bedrock</li>
                <li>Go to Servers</li>
                <li>Select Add Server</li>
                <li>Enter the IP and Port above</li>
              </ol>
            </div>
          </EnchantPanel>
        </div>
      </div>
    </section>
  );
}

/* ---------- THANK YOU ---------- */

function ThanksPage({ setPage }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
      {/* sunset gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, #5b2f1a 0%, #2c1430 45%, #0B0A14 80%)",
        }}
      />
      {/* fireflies */}
      <div className="absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <Particle key={i} left={(i * 21) % 100} top={30 + ((i * 13) % 60)} delay={i * 0.35} color="#FFD773" size={3} />
        ))}
      </div>
      <Skyline />

      <div className="relative z-10 max-w-xl text-center fsmp-fadein">
        <Heart size={34} className="mx-auto mb-6 text-[#FFD773]" />
        <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-[#FFD773] leading-relaxed mb-6">
          Thank You For Joining Fortune SMP
        </h1>
        <p className="font-body text-[#ECE6F5]/70 leading-relaxed mb-10">
          Every great world starts with a single block.
          <br />
          Thank you for becoming part of our adventure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GlowButton icon={HomeIcon} onClick={() => setPage("home")}>
            RETURN HOME
          </GlowButton>
          <GlowButton variant="discord" icon={MessageCircle} onClick={() => window.open(DISCORD_URL, "_blank")}>
            JOIN DISCORD
          </GlowButton>
        </div>
      </div>
    </section>
  );
}

/* ---------- LOADER ---------- */

function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0A14]">
      <div className="flex gap-2 mb-6">
        {["#F2B33D", "#FFD773", "#5B7FE0"].map((c, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.15}s` }} className="fsmp-block">
            <PixelBlock size={22} color={c} glow />
          </div>
        ))}
      </div>
      <p className="font-pixel text-[10px] text-[#FFD773]/80 tracking-widest fsmp-flicker">
        LOADING WORLD...
      </p>
    </div>
  );
}

/* ---------- ROOT ---------- */

export default function FortuneSMP() {
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  return (
    <div className="fsmp-root font-body min-h-screen fsmp-scrollbar">
      {FONTS}
      {loading && <Loader />}
      <NavBar page={page} setPage={setPage} />
      <main className="pt-16">
        {page === "home" && <Home setPage={setPage} />}
        {page === "discord" && <DiscordPage />}
        {page === "ip" && <ServerIpPage />}
        {page === "thanks" && <ThanksPage setPage={setPage} />}
      </main>
      <Footer />
    </div>
  );
}
