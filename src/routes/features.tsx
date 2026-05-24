import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Fingerprint, Network, Lock, Cpu, Shield, Activity, ArrowUpRight,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — TrustChain AI" },
      { name: "description", content: "Behavioral biometrics, graph fraud intelligence, blockchain integrity, explainable AI, adaptive auth, risk modeling." },
    ],
  }),
  component: Features,
});

const items = [
  { icon: Fingerprint, t: "Behavioral Biometrics", d: "Continuous identity from typing rhythm, mouse dynamics, gait of taps and device posture.", k: "200+ signals" },
  { icon: Network, t: "Graph Fraud Intelligence", d: "Expose hidden mule and money-laundering rings across devices, IPs and accounts.", k: "Sub-graph mining" },
  { icon: Lock, t: "Blockchain Integrity Layer", d: "Every behavioral fingerprint hashed (SHA-256) and anchored to an immutable chain.", k: "Tamper-proof" },
  { icon: Cpu, t: "Explainable AI", d: "SHAP-driven reasons make every block defensible to compliance, customer, or court.", k: "GDPR Art. 22" },
  { icon: Shield, t: "Adaptive Authentication", d: "Friction only when risk demands it. Step-up channels orchestrated by score band.", k: "0/Step-up/Block" },
  { icon: Activity, t: "Risk Analysis Model", d: "Gradient-boosted ensemble fusing biometrics, graph, network and chain into one 0–100 score.", k: "80 ms p95" },
];

function Features() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <div className="chip mb-4">FEATURES</div>
            <h1 className="display text-5xl max-w-3xl">Six modules. One trust verdict.</h1>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it, i) => (
              <motion.div key={it.t}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="surface surface-hover p-7 group">
                <div className="flex items-start justify-between">
                  <div className="size-11 rounded-xl bg-secondary grid place-items-center text-neon group-hover:bg-neon group-hover:text-background transition-colors">
                    <it.icon className="size-5" />
                  </div>
                  <span className="chip">{it.k}</span>
                </div>
                <h2 className="mt-6 text-xl font-medium">{it.t}</h2>
                <p className="text-sm text-muted-foreground mt-2">{it.d}</p>
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  <span>Module · 0{i + 1}</span>
                  <ArrowUpRight className="size-4 group-hover:text-neon transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 surface p-10">
            <div className="chip mb-5">SCORING LOGIC</div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { band: "80 — 100", label: "Safe", action: "Access Granted", tone: "text-neon border-neon/40" },
                { band: "50 — 79", label: "Suspicious", action: "Extra Verification", tone: "text-warn border-warn/40" },
                { band: "0 — 49", label: "High Risk", action: "Alert + Block", tone: "text-danger border-danger/40" },
              ].map((s) => (
                <div key={s.band} className={`rounded-2xl border bg-background/40 p-6 ${s.tone}`}>
                  <div className="font-mono text-xs uppercase tracking-widest">{s.label}</div>
                  <div className="text-4xl font-semibold mt-2">{s.band}</div>
                  <div className="text-sm mt-2 opacity-80">{s.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
