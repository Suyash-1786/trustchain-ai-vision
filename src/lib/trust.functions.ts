import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  evaluateTrust,
  fetchRecentEvaluations,
  fetchGraph,
  newSessionId,
} from "./trust.server";

const SESSION_COOKIE = "tc_sid";

function getOrCreateSession(): string {
  const existing = getCookie(SESSION_COOKIE);
  if (existing && /^[0-9a-f-]{10,64}$/i.test(existing)) return existing;
  const sid = newSessionId();
  setCookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return sid;
}

// Restrict inputs to demo-shaped values; reject anything outside it.
const safeText = (max: number) =>
  z.string().trim().min(1).max(max).regex(/^[A-Za-z0-9 ._:@\-]+$/, "invalid characters");

const evalSchema = z.object({
  username: safeText(60),
  ip: z.string().trim().regex(/^[0-9]{1,3}(\.[0-9]{1,3}){3}$/, "invalid IP"),
  device_fingerprint: z.string().trim().regex(/^[A-Za-z0-9_\-]{6,64}$/, "invalid device"),
  location: safeText(60),
  typing_speed: z.number().int().min(0).max(2000),
});

export const evaluateTrustFn = createServerFn({ method: "POST" })
  .inputValidator((input) => evalSchema.parse(input))
  .handler(async ({ data }) => {
    const sid = getOrCreateSession();
    return evaluateTrust(sid, data);
  });

export const getRecentEvaluationsFn = createServerFn({ method: "POST" })
  .handler(async () => {
    const sid = getOrCreateSession();
    return fetchRecentEvaluations(sid, 20);
  });

export const getGraphFn = createServerFn({ method: "POST" })
  .handler(async () => {
    const sid = getOrCreateSession();
    return fetchGraph(sid);
  });
