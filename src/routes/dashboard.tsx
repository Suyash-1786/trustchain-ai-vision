import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { trustTrend, riskFactors, auditTrail } from "@/lib/mock";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  CheckCircle2, AlertTriangle, ShieldAlert, Network, Lock, Cpu,
} from "lucide-react";
import ReactFlow, { Background, Controls, Node, Edge, MarkerType, Position } from "reactflow";
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

const MOCK_SCORE = 82;
const MOCK_HASH = "a83f91bc7d9e2a11ff03552be7aa001d8e6f2b4c19873a55c2d1ee4b7f3a98c1";
const MOCK_PREV = "7d4e2a119c12ff03552be7aa001d8e6fa83f91bc2b4c19873a55c2d1ee4b7f3a";

function nodeStyle(color: string, flagged = false): React.CSSProperties {
  return {
    background: flagged ? "color-mix(in oklab, var(--danger) 18%, oklch(0.18 0.006 240))" : "oklch(0.18 0.006 240 / 0.9)",
    border: `1px solid ${color}`,
    color: "var(--cream)",
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
  };
}

function Dashboard() {
  const { nodes, edges } = useMemo(() => {
    const n: Node[] = [
      { id: "u1", position: { x: 0, y: 140 }, data: { label: "user · alex.morgan" }, sourcePosition: Position.Right, style: nodeStyle("var(--neon)") },
      { id: "d1", position: { x: 240, y: 40 }, data: { label: "DEVICE · MBP-9A21" }, sourcePosition: Position.Right, targetPosition: Position.Left, style: nodeStyle("var(--neon-dim)") },
      { id: "ip1", position: { x: 240, y: 140 }, data: { label: "IP · 185.220.101.4" }, sourcePosition: Position.Right, targetPosition: Position.Left, style: nodeStyle("var(--danger)", true) },
      { id: "ip2", position: { x: 240, y: 240 }, data: { label: "IP · 10.0.42.118" }, sourcePosition: Position.Right, targetPosition: Position.Left, style: nodeStyle("var(--neon-dim)") },
      { id: "u2", position: { x: 520, y: 0 }, data: { label: "user · j.kovacs" }, targetPosition: Position.Left, style: nodeStyle("var(--cream)") },
      { id: "u3", position: { x: 520, y: 90 }, data: { label: "user · mule-7821" }, targetPosition: Position.Left, style: nodeStyle("var(--danger)", true) },
      { id: "u4", position: { x: 520, y: 220 }, data: { label: "user · r.singh" }, targetPosition: Position.Left, style: nodeStyle("var(--cream)") },
    ];
    const mk = (id: string, source: string, target: string, danger = false): Edge => ({
      id, source, target, animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: danger ? "var(--danger)" : "var(--neon-dim)" },
      style: { stroke: danger ? "var(--danger)" : "var(--neon-dim)" },
    });
    const e: Edge[] = [
      mk("e1", "u1", "d1"), mk("e2", "u1", "ip1", true), mk("e3", "u1", "ip2"),
      mk("e4", "d1", "u2"), mk("e5", "ip1", "u3", true), mk("e6", "ip2", "u4"),
    ];
    return { nodes: n, edges: e };
  }, []);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="chip mb-4">AI RISK DASHBOARD</div>
              <h1 className="display text-5xl">Session #A83F91BC</h1>
              <div className="font-mono text-xs text-muted-foreground mt-2">
                alex.morgan · Mumbai, IN · {new Date().toLocaleString()}
              </div>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-neon animate-pulse-soft" /> mock telemetry · concept preview
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-5">
            {/* Trust Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="surface p-6 lg:col-span-4">
              <div className="chip chip-neon mb-4">TRUST SCORE</div>
              <div className="text-7xl font-semibold text-glow text-neon">{MOCK_SCORE}<span className="text-2xl text-muted-foreground">/100</span></div>
              <div className="h-2 mt-4 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${MOCK_SCORE}%` }} transition={{ duration: 1 }} className="h-full bg-neon" />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-neon">
                <CheckCircle2 className="size-4" /> Safe — access granted
              </div>
            </motion.div>

            {/* Risk Factors */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="surface p-6 lg:col-span-4">
              <div className="chip mb-4">RISK FACTORS · {riskFactors.length}</div>
              <ul className="space-y-3">
                {riskFactors.map((r) => (
                  <li key={r.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><AlertTriangle className="size-4 text-warn" />{r.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">−{r.weight}</span>
                    </div>
                    <div className="h-1 mt-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-warn" style={{ width: `${Math.min(100, r.weight * 3)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Blockchain */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface p-6 lg:col-span-4">
              <div className="chip mb-4 flex items-center gap-2"><Lock className="size-3" /> BLOCKCHAIN VERIFICATION</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SHA-256 hash</div>
              <div className="font-mono text-xs mt-1 break-all text-cream">{MOCK_HASH}</div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-neon">
                <CheckCircle2 className="size-4" /> IMMUTABLE · VERIFIED
              </div>
              <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground font-mono uppercase tracking-widest text-[10px]">Block</div>
                  <div className="mt-1 font-mono">#1842</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-mono uppercase tracking-widest text-[10px]">Prev</div>
                  <div className="mt-1 font-mono truncate">{MOCK_PREV.slice(0, 10)}…</div>
                </div>
              </div>
            </motion.div>

            {/* Graph */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface p-6 lg:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <div className="chip flex items-center gap-2"><Network className="size-3" /> GRAPH FRAUD INTELLIGENCE</div>
                <div className="text-sm text-danger inline-flex items-center gap-2">
                  <ShieldAlert className="size-4" /> Hidden fraud network detected
                </div>
              </div>
              <div className="h-[340px] rounded-xl border border-border/60 bg-background/40 overflow-hidden">
                <ReactFlow nodes={nodes} edges={edges} fitView panOnDrag zoomOnScroll={false} proOptions={{ hideAttribution: true }}>
                  <Background gap={24} size={1} color="oklch(1 0 0 / 0.06)" />
                  <Controls showInteractive={false} className="!bg-secondary !border-border" />
                </ReactFlow>
              </div>
            </motion.div>

            {/* Explainable AI */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface p-6 lg:col-span-5">
              <div className="chip mb-4 flex items-center gap-2"><Cpu className="size-3" /> EXPLAINABLE AI</div>
              <div className="text-sm text-muted-foreground">Reasons behind this score:</div>
              <div className="mt-4 surface p-5">
                <div className="text-sm font-mono">
                  Trust Score: <span className="text-lg text-neon">{MOCK_SCORE}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {riskFactors.map((f) => (
                    <li key={f.label} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className={`size-1.5 rounded-full ${f.weight >= 20 ? "bg-danger" : "bg-warn"}`} />
                        {f.label}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">−{f.weight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Trust trend */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface p-6 lg:col-span-8">
              <div className="chip mb-4">TRUST vs RISK · LAST 24H</div>
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
                    <YAxis stroke="oklch(0.65 0.01 240)" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.006 240)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="trust" stroke="var(--neon)" fill="url(#g1)" strokeWidth={2} />
                    <Area type="monotone" dataKey="fraud" stroke="var(--danger)" fill="url(#g2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Audit trail */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface p-6 lg:col-span-4">
              <div className="chip mb-4">IMMUTABLE AUDIT TRAIL</div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {auditTrail.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-xs font-mono gap-3">
                    <div className="min-w-0">
                      <div className="text-cream truncate">{a.id}</div>
                      <div className="text-muted-foreground truncate">{a.time}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full border shrink-0 ${
                      a.status === "VERIFIED" ? "text-neon border-neon/40"
                      : a.status === "BLOCKED" ? "text-danger border-danger/40"
                      : "text-warn border-warn/40"
                    }`}>
                      {a.score}
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
