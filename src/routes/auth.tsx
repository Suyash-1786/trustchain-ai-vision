import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Fingerprint, MapPin, Monitor, Wifi, KeyRound, ArrowRight, Activity,
  CheckCircle2, AlertTriangle, ShieldOff,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { evaluateTrustFn } from "@/lib/trust.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authentication Simulation — TrustChain AI" },
      { name: "description", content: "Simulate a banking login. Capture behavior, typing rhythm, device fingerprint and evaluate trust live." },
    ],
  }),
  component: AuthPage,
});

function randomFingerprint() {
  return Math.random().toString(36).slice(2, 10) + "-webgl-" + Math.random().toString(36).slice(2, 6);
}

function AuthPage() {
  const nav = useNavigate();
  const evaluate = useServerFn(evaluateTrustFn);
  const [form, setForm] = useState({
    username: "j.doe@bank.com",
    password: "",
    device: "fp_macbook_chrome_142",
    location: "Frankfurt, DE",
    ip: "82.115.44.198",
  });
  const [typing, setTyping] = useState({ speed: 0, samples: 0 });
  const lastKey = useRef<number>(0);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPasswordKey(e: React.KeyboardEvent<HTMLInputElement>) {
    const now = performance.now();
    if (lastKey.current) {
      const delta = now - lastKey.current;
      setTyping((p) => ({
        samples: p.samples + 1,
        speed: Math.round(((p.speed * p.samples) + Math.max(40, Math.min(400, delta))) / (p.samples + 1)),
      }));
    }
    lastKey.current = now;
  }

  function presetFor(kind: "safe" | "stepup" | "block") {
    if (kind === "safe") setForm({
      username: "j.doe@bank.com", password: "••••••••",
      device: "fp_macbook_chrome_142", location: "Frankfurt, DE", ip: "82.115.44.198",
    });
    if (kind === "stepup") setForm({
      username: "j.doe@bank.com", password: "••••••••",
      device: randomFingerprint(), location: "Lagos, NG", ip: "82.115.44.198",
    });
    if (kind === "block") setForm({
      username: "j.doe@bank.com", password: "••••••••",
      device: "tor-browser-abc123", location: "Unknown", ip: "185.220.101.45",
    });
  }

  async function submit() {
    setError(null); setEvaluating(true);
    try {
      const result = await evaluate({
        data: {
          username: form.username.trim(),
          ip: form.ip.trim(),
          device_fingerprint: form.device.trim(),
          location: form.location.trim(),
          typing_speed: typing.speed || 120,
        },
      });
      sessionStorage.setItem("trustchain:lastEval", JSON.stringify(result));
      setTimeout(() => nav({ to: "/dashboard" }), 500);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Evaluation failed");
      setEvaluating(false);
    }
  }

  const signals = [
    { icon: Activity, label: "Typing speed", value: typing.samples ? `${typing.speed}ms / key · ${typing.samples} samples` : "awaiting input" },
    { icon: Fingerprint, label: "Device fingerprint", value: form.device },
    { icon: MapPin, label: "Geo-IP", value: form.location },
    { icon: Wifi, label: "Network", value: form.ip },
    { icon: Monitor, label: "Browser entropy", value: "0.992 bits · webgl-canvas" },
  ];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="chip mb-6">AUTHENTICATION SIMULATOR · LIVE ENGINE</div>
            <h1 className="display text-6xl">Prove you are <span className="text-neon">you.</span></h1>
            <p className="text-muted-foreground mt-5 max-w-lg">
              Type as you normally would. The trust engine runs on the server — rhythm, device,
              IP and graph signals are scored and chained on-blockchain in under 100&nbsp;ms.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => presetFor("safe")} className="chip chip-neon hover:bg-neon/10">
                <CheckCircle2 className="size-3" /> Preset · Safe
              </button>
              <button onClick={() => presetFor("stepup")} className="chip hover:bg-warn/10" style={{ color: "var(--warn)", borderColor: "color-mix(in oklab, var(--warn) 40%, transparent)" }}>
                <AlertTriangle className="size-3" /> Preset · Step-up
              </button>
              <button onClick={() => presetFor("block")} className="chip hover:bg-danger/10" style={{ color: "var(--danger)", borderColor: "color-mix(in oklab, var(--danger) 40%, transparent)" }}>
                <ShieldOff className="size-3" /> Preset · High Risk
              </button>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="surface mt-6 p-7 grid md:grid-cols-2 gap-5">
              <Field label="Username" icon={KeyRound} value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
              <Field label="Password" icon={KeyRound} type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} onKeyDown={onPasswordKey} />
              <Field label="Device type" icon={Monitor} value={form.device} onChange={(v) => setForm({ ...form, device: v })} />
              <Field label="Location" icon={MapPin} value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
              <Field label="IP address" icon={Wifi} value={form.ip} onChange={(v) => setForm({ ...form, ip: v })} className="md:col-span-2" />

              <div className="md:col-span-2 mt-2 flex items-center justify-between flex-wrap gap-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Behavioral capture · {typing.samples} samples · {typing.speed}ms avg
                </div>
                <button
                  onClick={submit}
                  disabled={evaluating}
                  className="inline-flex items-center gap-2 rounded-full bg-cream text-background px-6 py-3.5 text-sm font-medium hover:bg-neon transition-colors disabled:opacity-60"
                >
                  {evaluating ? "Evaluating…" : "Evaluate Trust"} <ArrowRight className="size-4" />
                </button>
              </div>
              {error && <div className="md:col-span-2 text-sm text-danger font-mono">{error}</div>}
            </motion.div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="chip">LIVE SIGNALS</div>
            {signals.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}
                className="surface p-5 flex items-center gap-4">
                <div className="size-10 rounded-xl bg-secondary grid place-items-center text-neon">
                  <s.icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className="text-sm font-medium truncate font-mono">{s.value}</div>
                </div>
                <span className="size-2 rounded-full bg-neon animate-pulse-soft" />
              </motion.div>
            ))}
            {evaluating && (
              <div className="surface p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  Pipeline · capture → chain → AI → explain
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2 }} className="h-full bg-neon" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label, icon: Icon, value, onChange, type = "text", onKeyDown, className = "",
}: {
  label: string; icon: React.ComponentType<{ className?: string }>;
  value: string; onChange: (v: string) => void;
  type?: string; onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; className?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className={`block ${className}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className={`flex items-center gap-2 rounded-xl border bg-background/60 px-4 py-3 transition-colors ${focused ? "border-neon" : "border-border"}`}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="bg-transparent w-full outline-none text-sm font-mono"
        />
      </div>
    </label>
  );
}
