import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { trustTrend, fraudAttempts, riskDistribution, heatmap } from "@/lib/mock";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — TrustChain AI" },
      { name: "description", content: "Trust trends, fraud attempts, anomaly heatmaps and risk distribution." },
    ],
  }),
  component: Analytics,
});

function Heatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div>
      <div className="grid" style={{ gridTemplateColumns: "auto repeat(24, minmax(0,1fr))", gap: 3 }}>
        <div />
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="font-mono text-[9px] text-muted-foreground text-center">{h % 4 === 0 ? h : ""}</div>
        ))}
        {days.map((dname, d) => (
          <>
            <div key={`l${d}`} className="font-mono text-[10px] text-muted-foreground pr-2 self-center">{dname}</div>
            {heatmap.filter((c) => c.d === d).map((c) => (
              <div key={`${d}-${c.h}`} className="aspect-square rounded-sm"
                style={{ background: `color-mix(in oklab, var(--neon) ${Math.min(100, c.v)}%, oklch(0.22 0.006 240))` }}
                title={`${dname} ${c.h}:00 · ${c.v}`}
              />
            ))}
          </>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs font-mono text-muted-foreground">
        Low <div className="h-2 w-32 rounded-full" style={{ background: "linear-gradient(to right, oklch(0.22 0.006 240), var(--neon))" }} /> High
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <div className="chip mb-4">ANALYTICS</div>
            <h1 className="display text-5xl">Fraud telemetry, decoded.</h1>
          </div>
          <div className="grid lg:grid-cols-12 gap-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface p-6 lg:col-span-8">
              <div className="chip mb-4">TRUST SCORE TREND · 24H</div>
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={trustTrend}>
                    <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
                    <XAxis dataKey="t" stroke="oklch(0.65 0.01 240)" fontSize={11} />
                    <YAxis stroke="oklch(0.65 0.01 240)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.006 240)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                    <Line type="monotone" dataKey="trust" stroke="var(--neon)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface p-6 lg:col-span-4">
              <div className="chip mb-4">RISK DISTRIBUTION</div>
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={riskDistribution} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={3} stroke="none">
                      {riskDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.006 240)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface p-6 lg:col-span-7">
              <div className="chip mb-4">FRAUD ATTEMPTS · 14D</div>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={fraudAttempts}>
                    <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
                    <XAxis dataKey="day" stroke="oklch(0.65 0.01 240)" fontSize={11} />
                    <YAxis stroke="oklch(0.65 0.01 240)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.006 240)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="attempts" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="blocked" fill="var(--neon)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="surface p-6 lg:col-span-5">
              <div className="chip mb-4">LOGIN ANOMALY HEATMAP</div>
              <Heatmap />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
