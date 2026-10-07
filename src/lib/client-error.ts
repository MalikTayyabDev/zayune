import { sanitizeErrorText } from "@/lib/api-error";

/** Read `error` from an API JSON body safely for UI display. */
export function readApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const err = (data as { error?: unknown }).error;
  return sanitizeErrorText(err, fallback);
}
