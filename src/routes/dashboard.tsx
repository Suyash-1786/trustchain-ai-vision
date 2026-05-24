import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/SiteHeader";
import { getRecentEvaluationsFn, getGraphFn } from "@/lib/trust.functions";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  CheckCircle2, AlertTriangle, ShieldAlert, Network, Lock, Cpu, ShieldOff,
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

type LastEval = {
  evaluation: {
    id: string; username: string; ip: string; device_fingerprint: string;
    location: string; typing_speed: number; score: number; risk: number;
    factors: { label: string; weight: number; kind: string }[];
    recommendation: "granted" | "step_up" | "blocked";
    hash: string; prev_hash: string; block_index: number; created_at: string;
  };
  factors: { label: string; weight: number; kind: string }[];
  score: number; risk: number;
  recommendation: "granted" | "step_up" | "blocked";
  hash: string; prev_hash: string;
};

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
  const getEvals = useServerFn(getRecentEvaluationsFn);
  const getGraph = useServerFn(getGraphFn);

  const evals = useQuery({ queryKey: ["evals"], queryFn: () => getEvals(), refetchInterval: 4000 });
  const graph = useQuery({ queryKey: ["graph"], queryFn: () => getGraph(), refetchInterval: 6000 });

  const [last, setLast] = useState<LastEval | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("trustchain:lastEval");
    if (raw) try { setLast(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);

  // Fall back to most recent stored evaluation if no fresh session result
  const current = last ?? (evals.data && evals.data[0] ? {
    evaluation: evals.data[0] as unknown as LastEval["evaluation"],
    factors: (evals.data[0].factors as unknown as LastEval["factors"]) ?? [],
    score: evals.data[0].score, risk: evals.data[0].risk,
    recommendation: evals.data[0].recommendation as LastEval["recommendation"],
    hash: evals.data[0].hash, prev_hash: evals.data[0].prev_hash,
  } : null);

  const trend = useMemo(() => {
    const rows = (evals.data ?? []).slice().reverse();
    return rows.map((r) => ({
      t: new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      trust: r.score, fraud: r.risk,
    }));
  }, [evals.data]);

  // Build a small graph centered on current user
  const { nodes, edges } = useMemo(() => {
    if (!graph.data) return { nodes: [] as Node[], edges: [] as Edge[] };
    const username = current?.evaluation.username;
    const userNodes = graph.data.nodes.filter((n) => n.type === "user");
    const ipNodes = graph.data.nodes.filter((n) => n.type === "ip");
    const deviceNodes = graph.data.nodes.filter((n) => n.type === "device");

    const focus = username ? userNodes.find((u) => u.value === username) : userNodes[0];
    if (!focus) return { nodes: [], edges: [] };

    // Connected ip/device ids
    const focusEdges = graph.data.edges.filter((e) => e.source_id === focus.id);
    const connectedIpIds = new Set(focusEdges.filter((e) => e.kind === "uses_ip").map((e) => e.target_id));
    const connectedDeviceIds = new Set(focusEdges.filter((e) => e.kind === "uses_device").map((e) => e.target_id));

    const sharedIps = ipNodes.filter((n) => connectedIpIds.has(n.id));
    const sharedDevices = deviceNodes.filter((n) => connectedDeviceIds.has(n.id));

    // Other users sharing one of those ips/devices
    const linkedUserIds = new Set<string>();
    for (const e of graph.data.edges) {
      if (e.source_id === focus.id) continue;
      if ((e.kind === "uses_ip" && connectedIpIds.has(e.target_id)) ||
          (e.kind === "uses_device" && connectedDeviceIds.has(e.target_id))) {
        linkedUserIds.add(e.source_id);
      }
    }
    const others = userNodes.filter((u) => linkedUserIds.has(u.id)).slice(0, 4);

    const rfNodes: Node[] = [];
    const rfEdges: Edge[] = [];

    rfNodes.push({
      id: focus.id, position: { x: 0, y: 140 },
      data: { label: focus.value.length > 18 ? focus.value.slice(0, 16) + "…" : focus.value },
      sourcePosition: Position.Right,
      style: nodeStyle("var(--neon)"),
    });

    const middleNodes = [...sharedDevices, ...sharedIps];
    middleNodes.forEach((m, i) => {
      const flagged = m.flagged;
      rfNodes.push({
        id: m.id, position: { x: 240, y: i * 70 },
        data: { label: `${m.type === "ip" ? "IP" : "DEVICE"} · ${m.value.slice(0, 14)}…` },
        sourcePosition: Position.Right, targetPosition: Position.Left,
        style: nodeStyle(flagged ? "var(--danger)" : "var(--neon-dim)", flagged),
      });
      rfEdges.push({
        id: `e-f-${m.id}`, source: focus.id, target: m.id, animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: flagged ? "var(--danger)" : "var(--neon-dim)" },
        style: { stroke: flagged ? "var(--danger)" : "var(--neon-dim)" },
      });
    });

    others.forEach((u, i) => {
      rfNodes.push({
        id: u.id, position: { x: 520, y: i * 70 + 40 },
        data: { label: u.value.length > 18 ? u.value.slice(0, 16) + "…" : u.value },
        targetPosition: Position.Left,
        style: nodeStyle("var(--cream)"),
      });
      // Link them via the first shared middle node we find
      const sharedMid = middleNodes.find((m) =>
        graph.data!.edges.some((e) => e.source_id === u.id && e.target_id === m.id)
      );
      if (sharedMid) {
        rfEdges.push({
          id: `e-${sharedMid.id}-${u.id}`, source: sharedMid.id, target: u.id, animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: "var(--neon-dim)" },
          style: { stroke: "var(--neon-dim)" },
        });
      }
    });

    return { nodes: rfNodes, edges: rfEdges };
  }, [graph.data, current?.evaluation.username]);

  const hasNetwork = nodes.length > 1 && nodes.some((n) =>
    edges.some((e) => e.target === n.id || e.source === n.id) && n.id !== nodes[0]?.id
  );

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="chip mb-4">AI RISK DASHBOARD</div>
              <h1 className="display text-5xl">
                {current ? `Session #${current.evaluation.id.slice(0, 8).toUpperCase()}` : "No sessions yet"}
              </h1>
              {current && (
                <div className="font-mono text-xs text-muted-foreground mt-2">
                  {current.evaluation.username} · {current.evaluation.location} · {new Date(current.evaluation.created_at).toLocaleString()}
                </div>
              )}
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-neon animate-pulse-soft" /> live · auto-refresh 4s
            </div>
          </div>

          {!current ? (
            <EmptyState />
          ) : (
            <div className="grid lg:grid-cols-12 gap-5">
              {/* Trust Score */}
              <ScoreCard score={current.score} recommendation={current.recommendation} />

              {/* Risk Factors */}
              <RiskFactorsCard factors={current.factors} />

              {/* Blockchain */}
              <BlockchainCard hash={current.hash} prev_hash={current.prev_hash} block={current.evaluation.block_index} />

              {/* Graph */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface p-6 lg:col-span-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="chip flex items-center gap-2"><Network className="size-3" /> GRAPH FRAUD INTELLIGENCE</div>
                  {hasNetwork && (
                    <div className="text-sm text-danger inline-flex items-center gap-2">
                      <ShieldAlert className="size-4" /> Hidden fraud network detected
                    </div>
                  )}
                </div>
                <div className="h-[340px] rounded-xl border border-border/60 bg-background/40 overflow-hidden">
                  {nodes.length > 0 ? (
                    <ReactFlow nodes={nodes} edges={edges} fitView panOnDrag zoomOnScroll={false} proOptions={{ hideAttribution: true }}>
                      <Background gap={24} size={1} color="oklch(1 0 0 / 0.06)" />
                      <Controls showInteractive={false} className="!bg-secondary !border-border" />
                    </ReactFlow>
                  ) : (
                    <div className="h-full grid place-items-center text-sm text-muted-foreground font-mono">No graph data yet</div>
                  )}
                </div>
              </motion.div>

              {/* Explainable AI */}
              <ExplainCard factors={current.factors} score={current.score} />

              {/* Trust trend */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface p-6 lg:col-span-8">
                <div className="chip mb-4">TRUST vs RISK · LAST {trend.length} SESSIONS</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend}>
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
                  {(evals.data ?? []).map((a) => (
                    <div key={a.id} className="flex items-center justify-between text-xs font-mono gap-3">
                      <div className="min-w-0">
                        <div className="text-cream truncate">#{a.block_index} · {a.hash.slice(0, 10)}…</div>
                        <div className="text-muted-foreground truncate">{new Date(a.created_at).toLocaleTimeString()} · {a.username}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full border shrink-0 ${
                        a.recommendation === "granted" ? "text-neon border-neon/40"
                        : a.recommendation === "blocked" ? "text-danger border-danger/40"
                        : "text-warn border-warn/40"
                      }`}>
                        {a.score}
                      </div>
                    </div>
                  ))}
                  {(evals.data ?? []).length === 0 && (
                    <div className="text-xs font-mono text-muted-foreground">No blocks yet</div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ScoreCard({ score, recommendation }: { score: number; recommendation: LastEval["recommendation"] }) {
  const color = recommendation === "granted" ? "text-neon" : recommendation === "blocked" ? "text-danger" : "text-warn";
  const Icon = recommendation === "granted" ? CheckCircle2 : recommendation === "blocked" ? ShieldOff : AlertTriangle;
  const label = recommendation === "granted" ? "Safe — access granted"
    : recommendation === "blocked" ? "High risk — blocked"
    : "Suspicious — step-up required";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="surface p-6 lg:col-span-4">
      <div className="chip chip-neon mb-4">TRUST SCORE</div>
      <div className={`text-7xl font-semibold text-glow ${color}`}>{score}<span className="text-2xl text-muted-foreground">/100</span></div>
      <div className="h-2 mt-4 rounded-full bg-secondary overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1 }}
          className="h-full" style={{ background: recommendation === "granted" ? "var(--neon)" : recommendation === "blocked" ? "var(--danger)" : "var(--warn)" }} />
      </div>
      <div className={`mt-4 inline-flex items-center gap-2 text-sm ${color}`}>
        <Icon className="size-4" /> {label}
      </div>
    </motion.div>
  );
}

function RiskFactorsCard({ factors }: { factors: { label: string; weight: number; kind: string }[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="surface p-6 lg:col-span-4">
      <div className="chip mb-4">RISK FACTORS · {factors.length}</div>
      {factors.length === 0 ? (
        <div className="text-sm text-muted-foreground">No risk factors triggered.</div>
      ) : (
        <ul className="space-y-3">
          {factors.map((r) => (
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
      )}
    </motion.div>
  );
}

function BlockchainCard({ hash, prev_hash, block }: { hash: string; prev_hash: string; block: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface p-6 lg:col-span-4">
      <div className="chip mb-4 flex items-center gap-2"><Lock className="size-3" /> BLOCKCHAIN VERIFICATION</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SHA-256 hash</div>
      <div className="font-mono text-xs mt-1 break-all text-cream">{hash}</div>
      <div className="mt-4 inline-flex items-center gap-2 text-sm text-neon">
        <CheckCircle2 className="size-4" /> IMMUTABLE · VERIFIED
      </div>
      <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-muted-foreground font-mono uppercase tracking-widest text-[10px]">Block</div>
          <div className="mt-1 font-mono">#{block}</div>
        </div>
        <div>
          <div className="text-muted-foreground font-mono uppercase tracking-widest text-[10px]">Prev</div>
          <div className="mt-1 font-mono truncate">{prev_hash.slice(0, 10)}…</div>
        </div>
      </div>
    </motion.div>
  );
}

function ExplainCard({ factors, score }: { factors: { label: string; weight: number }[]; score: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface p-6 lg:col-span-5">
      <div className="chip mb-4 flex items-center gap-2"><Cpu className="size-3" /> EXPLAINABLE AI</div>
      <div className="text-sm text-muted-foreground">Reasons behind this score:</div>
      <div className="mt-4 surface p-5">
        <div className="text-sm font-mono">
          Trust Score: <span className={`text-lg ${score >= 80 ? "text-neon" : score >= 50 ? "text-warn" : "text-danger"}`}>{score}</span>
        </div>
        {factors.length === 0 ? (
          <div className="mt-3 text-sm text-muted-foreground">Behavior matched the user's baseline. No anomalies detected.</div>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className={`size-1.5 rounded-full ${f.weight >= 25 ? "bg-danger" : "bg-warn"}`} />
                  {f.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">−{f.weight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="surface p-16 text-center">
      <div className="chip mx-auto mb-5">NO DATA</div>
      <h2 className="display text-3xl">Run a login simulation to populate the dashboard.</h2>
      <p className="text-muted-foreground mt-3">Head to the Authenticate page and click <span className="text-neon">Evaluate Trust</span>.</p>
      <a href="/auth" className="inline-flex items-center gap-2 rounded-full bg-cream text-background px-5 py-3 text-sm font-medium hover:bg-neon transition-colors mt-6">
        Simulate a login →
      </a>
    </div>
  );
}
