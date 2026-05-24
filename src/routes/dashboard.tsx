import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { auditTrail, riskFactors, trustTrend } from "@/lib/mock";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  CheckCircle2, AlertTriangle, ShieldAlert, Network, Lock, Cpu,
} from "lucide-react";
import ReactFlow, { Background, Controls, Node, Edge, MarkerType } from "reactflow";
import "reactflow/dist/style.css";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "AI Risk Dashboard — TrustChain AI" },
      { name: "description", content: "Live trust score, graph fraud network, blockchain audit and explainable reasons." },
    ],
  }),
  component: Dashboard,
});

const nodes: Node[] = [
  { id: "uA", position: { x: 0, y: 30 }, data: { label: "User A" }, style: nodeStyle("var(--cream)") },
  { id: "dev", position: { x: 200, y: 0 }, data: { label: "Shared Device" }, style: nodeStyle("var(--neon-dim)") },
  { id: "ip", position: { x: 200, y: 60 }, data: { label: "IP 82.115.44.x" }, style: nodeStyle("var(--neon-dim)") },
  { id: "uB", position: { x: 400, y: 30 }, data: { label: "User B" }, style: nodeStyle("var(--cream)") },
  { id: "flag", position: { x: 600, y: 30 }, data: { label: "⚠ Fraud Flag" }, style: nodeStyle("var(--danger)") },
];
const edges: Edge[] = [
  { id: "1", source: "uA", target: "dev", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "2", source: "uA", target: "ip", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "3", source: "dev", target: "uB", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "4", source: "ip", target: "uB", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "5", source: "uB", target: "flag", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

function nodeStyle(color: string): React.CSSProperties {
  return {
    background: "oklch(0.18 0.006 240 / 0.9)",
    border: `1px solid ${color}`,
    color: "var(--cream)",
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
  };
}

function Dashboard() {
  const score = 82;
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="chip mb-4">AI RISK DASHBOARD</div>
              <h1 className="display text-5xl">Session #TX-A83F91BC</h1>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-neon animate-pulse-soft" /> live · stream open
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-5">
            {/* Trust Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="surface p-6 lg:col-span-4">
              <div className="chip chip-neon mb-4">TRUST SCORE</div>
              <div className="text-7xl font-semibold text-neon text-glow">{score}<span className="text-2xl text-muted-foreground">/100</span></div>
              <div className="h-2 mt-4 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1 }} className="h-full bg-neon" />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-neon">
                <CheckCircle2 className="size-4" /> Safe — access granted
              </div>
            </motion.div>

            {/* Risk Factors */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="surface p-6 lg:col-span-4">
              <div className="chip mb-4">RISK FACTORS</div>
              <ul className="space-y-3">
                {riskFactors.map((r) => (
                  <li key={r.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><AlertTriangle className="size-4 text-warn" />{r.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">−{r.weight}</span>
                    </div>
                    <div className="h-1 mt-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-warn" style={{ width: `${r.weight * 3}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Blockchain */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface p-6 lg:col-span-4">
              <div className="chip mb-4 flex items-center gap-2"><Lock className="size-3" /> BLOCKCHAIN VERIFICATION</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SHA-256 hash</div>
              <div className="font-mono text-sm mt-1 break-all text-cream">A83F91BC7D9E2A11FF03552BE7AA001D8E6F2C4B7891AC</div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-neon">
                <CheckCircle2 className="size-4" /> IMMUTABLE · VERIFIED
              </div>
              <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-muted-foreground font-mono uppercase tracking-widest text-[10px]">Block</div><div className="mt-1 font-mono">#8,294,021</div></div>
                <div><div className="text-muted-foreground font-mono uppercase tracking-widest text-[10px]">Latency</div><div className="mt-1 font-mono">78 ms</div></div>
              </div>
            </motion.div>

            {/* Graph */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface p-6 lg:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <div className="chip flex items-center gap-2"><Network className="size-3" /> GRAPH FRAUD INTELLIGENCE</div>
                <div className="text-sm text-danger inline-flex items-center gap-2"><ShieldAlert className="size-4" /> Hidden fraud network detected</div>
              </div>
              <div className="h-[320px] rounded-xl border border-border/60 bg-background/40 overflow-hidden">
                <ReactFlow nodes={nodes} edges={edges} fitView panOnDrag={false} zoomOnScroll={false} proOptions={{ hideAttribution: true }}>
                  <Background gap={24} size={1} color="oklch(1 0 0 / 0.06)" />
                  <Controls showInteractive={false} className="!bg-secondary !border-border" />
                </ReactFlow>
              </div>
            </motion.div>

            {/* Explainable AI */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface p-6 lg:col-span-5">
              <div className="chip mb-4 flex items-center gap-2"><Cpu className="size-3" /> EXPLAINABLE AI</div>
              <div className="text-sm text-muted-foreground">If this session scored low, here's why:</div>
              <div className="mt-4 surface p-5">
                <div className="text-sm font-mono">Trust Score: <span className="text-danger text-lg">34</span></div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-danger" /> Typing rhythm mismatch (cosine 0.41)</li>
                  <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-danger" /> Shared flagged IP cluster</li>
                  <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-warn" /> New browser fingerprint</li>
                  <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-warn" /> Device anomaly · WebGL hash drift</li>
                </ul>
              </div>
            </motion.div>

            {/* Trust trend */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface p-6 lg:col-span-8">
              <div className="chip mb-4">24H TRUST vs FRAUD</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trustTrend}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="var(--danger)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
                    <XAxis dataKey="t" stroke="oklch(0.65 0.01 240)" fontSize={11} />
                    <YAxis stroke="oklch(0.65 0.01 240)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.006 240)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="trust" stroke="var(--neon)" fill="url(#g1)" strokeWidth={2} />
                    <Area type="monotone" dataKey="fraud" stroke="var(--danger)" fill="url(#g2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Audit trail */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface p-6 lg:col-span-4">
              <div className="chip mb-4">AUDIT TRAIL</div>
              <div className="space-y-3">
                {auditTrail.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="text-cream">{a.id}</div>
                      <div className="text-muted-foreground">{a.time}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full border ${
                      a.status === "VERIFIED" ? "text-neon border-neon/40"
                      : a.status === "BLOCKED" ? "text-danger border-danger/40"
                      : "text-warn border-warn/40"
                    }`}>
                      {a.score} · {a.status}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
