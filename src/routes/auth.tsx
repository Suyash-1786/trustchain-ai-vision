import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Fingerprint, MapPin, Monitor, Wifi, KeyRound, ArrowRight, Activity } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authentication Simulation — TrustChain AI" },
      { name: "description", content: "Simulate a banking login. Capture behavior, typing rhythm, device fingerprint and evaluate trust." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "j.doe@bank.com",
    password: "",
    device: "MacBook Pro · Chrome",
    location: "Frankfurt, DE",
    ip: "82.115.44.198",
  });
  const [typing, setTyping] = useState({ speed: 0, samples: 0 });
  const lastKey = useRef<number>(0);
  const [evaluating, setEvaluating] = useState(false);

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

  function evaluate() {
    setEvaluating(true);
    setTimeout(() => nav({ to: "/dashboard" }), 1600);
  }

  const signals = [
    { icon: Activity, label: "Typing speed", value: typing.samples ? `${typing.speed}ms / key` : "awaiting input" },
    { icon: Fingerprint, label: "Device fingerprint", value: "f3a91c · macOS · webgl" },
    { icon: MapPin, label: "Geo-IP", value: form.location },
    { icon: Wifi, label: "Network", value: "ASN 12389 · residential" },
    { icon: Monitor, label: "Browser entropy", value: "0.992 bits" },
  ];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="chip mb-6">AUTHENTICATION SIMULATOR</div>
            <h1 className="display text-6xl">Prove you are <span className="text-neon">you.</span></h1>
            <p className="text-muted-foreground mt-5 max-w-lg">
              Type as you normally would. We capture rhythm, device entropy and network posture in real time — without storing your password.
            </p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="surface mt-10 p-7 grid md:grid-cols-2 gap-5">
              <Field label="Username" icon={KeyRound} value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
              <Field label="Password" icon={KeyRound} type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} onKeyDown={onPasswordKey} />
              <Field label="Device type" icon={Monitor} value={form.device} onChange={(v) => setForm({ ...form, device: v })} />
              <Field label="Location" icon={MapPin} value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
              <Field label="IP address" icon={Wifi} value={form.ip} onChange={(v) => setForm({ ...form, ip: v })} className="md:col-span-2" />

              <div className="md:col-span-2 mt-2 flex items-center justify-between flex-wrap gap-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Behavioral capture · {typing.samples} samples
                </div>
                <button
                  onClick={evaluate}
                  disabled={evaluating}
                  className="inline-flex items-center gap-2 rounded-full bg-cream text-background px-6 py-3.5 text-sm font-medium hover:bg-neon transition-colors disabled:opacity-60"
                >
                  {evaluating ? "Evaluating…" : "Evaluate Trust"} <ArrowRight className="size-4" />
                </button>
              </div>
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
                  <div className="text-sm font-medium truncate">{s.value}</div>
                </div>
                <PulseDot />
              </motion.div>
            ))}
            {evaluating && <EvaluatingBar />}
          </div>
        </div>
      </section>
    </main>
  );
}

function PulseDot() {
  return <span className="size-2 rounded-full bg-neon animate-pulse-soft" />;
}

function EvaluatingBar() {
  return (
    <div className="surface p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
        Pipeline · capture → chain → AI → explain
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-neon" />
      </div>
    </div>
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
  useEffect(() => { /* noop */ }, []);
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
