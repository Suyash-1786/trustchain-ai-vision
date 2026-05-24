import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { evaluateTrust, fetchRecentEvaluations, fetchGraph } from "./trust.server";

const evalSchema = z.object({
  username: z.string().trim().min(1).max(120),
  ip: z.string().trim().min(3).max(64),
  device_fingerprint: z.string().trim().min(3).max(128),
  location: z.string().trim().min(1).max(120),
  typing_speed: z.number().int().min(0).max(2000),
});

export const evaluateTrustFn = createServerFn({ method: "POST" })
  .inputValidator((input) => evalSchema.parse(input))
  .handler(async ({ data }) => {
    return evaluateTrust(data);
  });

export const getRecentEvaluationsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return fetchRecentEvaluations(20);
  });

export const getGraphFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return fetchGraph();
  });
