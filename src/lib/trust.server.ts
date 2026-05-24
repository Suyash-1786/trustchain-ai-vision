import { createHash, randomUUID } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type EvaluateInput = {
  username: string;
  ip: string;
  device_fingerprint: string;
  location: string;
  typing_speed: number; // average ms/key
};

export type Factor = { label: string; weight: number; kind: string };

const VPN_PREFIXES = ["185.220.", "198.144.", "104.244.", "45.83.", "91.219."];
const TYPING_MIN = 70;
const TYPING_MAX = 220;

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function newSessionId(): string {
  return randomUUID();
}

async function ensureNode(sessionId: string, type: string, value: string, flagged = false) {
  const { data: existing } = await supabaseAdmin
    .from("nodes").select("*")
    .eq("session_id", sessionId).eq("type", type).eq("value", value).maybeSingle();
  if (existing) return existing;
  const { data: created, error } = await supabaseAdmin
    .from("nodes").insert({ session_id: sessionId, type, value, flagged }).select("*").single();
  if (error) throw error;
  return created;
}

async function ensureEdge(sessionId: string, sourceId: string, targetId: string, kind: string) {
  await supabaseAdmin
    .from("edges")
    .upsert(
      { session_id: sessionId, source_id: sourceId, target_id: targetId, kind },
      { onConflict: "session_id,source_id,target_id,kind" },
    );
}

export async function evaluateTrust(sessionId: string, input: EvaluateInput) {
  const factors: Factor[] = [];
  let risk = 0;

  const userNode = await ensureNode(sessionId, "user", input.username);
  const ipNode = await ensureNode(sessionId, "ip", input.ip);
  const deviceNode = await ensureNode(sessionId, "device", input.device_fingerprint);
  const locNode = await ensureNode(sessionId, "location", input.location);

  // New device check (no prior user→device edge in this session)
  const { data: priorDeviceEdge } = await supabaseAdmin
    .from("edges").select("id")
    .eq("session_id", sessionId)
    .eq("source_id", userNode.id).eq("target_id", deviceNode.id).eq("kind", "uses_device")
    .maybeSingle();
  if (!priorDeviceEdge) {
    risk += 25;
    factors.push({ label: "New device detected", weight: 25, kind: "device" });
  }

  const isVpn = VPN_PREFIXES.some((p) => input.ip.startsWith(p));
  if (isVpn) {
    risk += 20;
    factors.push({ label: "VPN / proxy detected", weight: 20, kind: "network" });
  }

  if (ipNode.flagged) {
    risk += 40;
    factors.push({ label: "Fraud-linked IP", weight: 40, kind: "ip" });
  } else {
    const { count } = await supabaseAdmin
      .from("edges").select("*", { count: "exact", head: true })
      .eq("session_id", sessionId).eq("target_id", ipNode.id).eq("kind", "uses_ip");
    if ((count ?? 0) >= 2) {
      risk += 15;
      factors.push({ label: `Shared IP across ${count} accounts`, weight: 15, kind: "ip" });
    }
  }

  if (deviceNode.flagged) {
    risk += 30;
    factors.push({ label: "Flagged device fingerprint", weight: 30, kind: "device" });
  } else {
    const { count } = await supabaseAdmin
      .from("edges").select("*", { count: "exact", head: true })
      .eq("session_id", sessionId).eq("target_id", deviceNode.id).eq("kind", "uses_device");
    if ((count ?? 0) >= 2) {
      risk += 15;
      factors.push({ label: `Shared device across ${count} accounts`, weight: 15, kind: "device" });
    }
  }

  const { data: history } = await supabaseAdmin
    .from("evaluations").select("typing_speed")
    .eq("session_id", sessionId).eq("username", input.username)
    .order("created_at", { ascending: false }).limit(10);
  if (history && history.length > 0) {
    const avg = history.reduce((a, b) => a + b.typing_speed, 0) / history.length;
    const drift = Math.abs(avg - input.typing_speed);
    if (drift > 50 || input.typing_speed < TYPING_MIN || input.typing_speed > TYPING_MAX) {
      risk += 15;
      factors.push({ label: "Typing rhythm mismatch", weight: 15, kind: "biometric" });
    }
  } else if (input.typing_speed < TYPING_MIN || input.typing_speed > TYPING_MAX) {
    risk += 15;
    factors.push({ label: "Typing rhythm out of band", weight: 15, kind: "biometric" });
  }

  risk = Math.min(100, risk);
  const score = 100 - risk;
  const recommendation: "granted" | "step_up" | "blocked" =
    score >= 80 ? "granted" : score >= 50 ? "step_up" : "blocked";

  await Promise.all([
    ensureEdge(sessionId, userNode.id, ipNode.id, "uses_ip"),
    ensureEdge(sessionId, userNode.id, deviceNode.id, "uses_device"),
    ensureEdge(sessionId, userNode.id, locNode.id, "uses_location"),
  ]);

  const { data: last } = await supabaseAdmin
    .from("evaluations").select("hash")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  const prev_hash = last?.hash ?? "0".repeat(64);
  const payload = JSON.stringify({
    username: input.username, ip: input.ip,
    device: input.device_fingerprint, location: input.location,
    typing_speed: input.typing_speed, score, risk, factors,
    prev_hash, ts: new Date().toISOString(),
  });
  const hash = sha256(payload);

  const { data: row, error } = await supabaseAdmin
    .from("evaluations").insert({
      session_id: sessionId,
      username: input.username,
      ip: input.ip,
      device_fingerprint: input.device_fingerprint,
      location: input.location,
      typing_speed: input.typing_speed,
      score, risk, factors, recommendation, prev_hash, hash,
    }).select("*").single();
  if (error) throw error;

  return { evaluation: row, factors, score, risk, recommendation, hash, prev_hash };
}

export async function fetchRecentEvaluations(sessionId: string, limit = 20) {
  const { data, error } = await supabaseAdmin
    .from("evaluations").select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchGraph(sessionId: string) {
  const [{ data: nodes }, { data: edges }] = await Promise.all([
    supabaseAdmin.from("nodes").select("*").eq("session_id", sessionId),
    supabaseAdmin.from("edges").select("*").eq("session_id", sessionId),
  ]);
  return { nodes: nodes ?? [], edges: edges ?? [] };
}
