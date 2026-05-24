export const trustTrend = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  trust: 60 + Math.round(Math.sin(i / 3) * 12 + Math.random() * 10),
  fraud: Math.max(0, Math.round(20 + Math.cos(i / 2) * 10 + Math.random() * 8)),
}));

export const riskDistribution = [
  { name: "Safe", value: 7421, color: "var(--neon)" },
  { name: "Extra Verify", value: 1284, color: "var(--warn)" },
  { name: "Blocked", value: 312, color: "var(--danger)" },
];

export const heatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => ({
    d, h, v: Math.round(Math.random() * 100 * (h > 22 || h < 5 ? 1 : 0.4)),
  }))
).flat();

export const fraudAttempts = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  attempts: Math.round(80 + Math.random() * 120),
  blocked: Math.round(60 + Math.random() * 100),
}));

export const riskFactors = [
  { label: "New device detected", weight: 18 },
  { label: "Typing speed anomaly", weight: 22 },
  { label: "VPN / proxy detected", weight: 14 },
  { label: "Fraud-linked IP cluster", weight: 12 },
];

export const auditTrail = [
  { id: "TX-A83F91BC", time: "2026-05-24 14:22:08", score: 82, status: "VERIFIED" },
  { id: "TX-7D4E2A11", time: "2026-05-24 14:18:51", score: 34, status: "BLOCKED" },
  { id: "TX-9C12FF03", time: "2026-05-24 14:14:02", score: 71, status: "STEP-UP" },
  { id: "TX-552BE7AA", time: "2026-05-24 14:10:33", score: 94, status: "VERIFIED" },
  { id: "TX-001D8E6F", time: "2026-05-24 14:07:11", score: 58, status: "STEP-UP" },
];
