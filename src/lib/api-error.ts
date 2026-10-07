import { ZodError, type ZodIssue } from "zod";

const fieldHints: Record<string, string> = {
  code: "Please enter a discount code.",
  email: "Please enter a valid email.",
  name: "Please enter your name.",
  phone: "Please enter a phone number.",
  message: "Please enter a message.",
  details: "Please add a few more details.",
  customerName: "Please enter your name.",
  customerEmail: "Please enter a valid email.",
  customerPhone: "Please enter your phone number.",
  shippingAddress: "Please enter your shipping address.",
  shippingCity: "Please enter your city.",
  password: "Password must be at least 8 characters.",
  subject: "Please enter an email subject.",
  headline: "Please enter a headline.",
  body: "Please enter the message body.",
  subtotal: "Cart total looks invalid. Refresh and try again.",
  orderNumber: "Please enter your order number.",
  pieceType: "Please choose a piece type.",
  colors: "Please describe your colors.",
  occasion: "Please choose an occasion.",
  budget: "Please choose a budget range.",
  title: "Please enter a title.",
  slug: "Please enter a URL slug.",
  sku: "Please enter a SKU.",
  price: "Please enter a valid price.",
  stock: "Please enter stock quantity.",
  categoryId: "Please choose a category.",
  token: "This link is invalid or expired.",
};

function humanizePath(key: string) {
  return key.replace(/([A-Z])/g, " $1").toLowerCase().trim();
}

function issueToMessage(issue: ZodIssue): string {
  const key = String(issue.path[0] ?? "");
  if (key && fieldHints[key]) return fieldHints[key];

  if (issue.code === "invalid_string" && issue.validation === "email") {
    return "Please enter a valid email.";
  }
  if (issue.code === "too_small" && issue.type === "string") {
    return key
      ? `Please complete the ${humanizePath(key)} field.`
      : "Please fill in all required fields.";
  }
  if (issue.code === "too_small" && issue.type === "number") {
    return key
      ? `Please enter a valid ${humanizePath(key)}.`
      : "Please check the numbers you entered.";
  }
  if (issue.code === "invalid_enum_value" || issue.code === "invalid_union") {
    return key
      ? `Please choose a valid option for ${humanizePath(key)}.`
      : "Please check your selections.";
  }
  if (issue.code === "invalid_type") {
    return key
      ? `Please complete the ${humanizePath(key)} field.`
      : "Please fill in all required fields.";
  }

  if (
    issue.message &&
    !looksLikeZodJson(issue.message) &&
    !issue.message.includes("Invalid")
  ) {
    // Prefer our field hints; only use plain custom messages
    if (!issue.message.startsWith("String must") && !issue.message.startsWith("Required")) {
      return issue.message;
    }
  }
  return "Please check your details and try again.";
}

function looksLikeZodJson(text: string) {
  const t = text.trim();
  if (t.startsWith("[") || t.startsWith("{")) return true;
  if (t.includes('"code":"too_small"') || t.includes('"code": "too_small"')) {
    return true;
  }
  if (t.includes('"code":"invalid_type"') || t.includes('"code": "invalid_type"')) {
    return true;
  }
  if (t.includes("String must contain at least")) return true;
  if (t.includes('"path":') && t.includes('"message":')) return true;
  return false;
}

/** Strip leaked Zod JSON / objects before showing in the UI. */
export function sanitizeErrorText(value: unknown, fallback: string): string {
  if (value == null) return fallback;

  if (Array.isArray(value)) {
    const first = value[0] as ZodIssue | undefined;
    if (first && typeof first === "object" && "code" in first && "path" in first) {
      return issueToMessage(first);
    }
    return fallback;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // { error: "..." } nested
    if (typeof obj.error === "string") {
      return sanitizeErrorText(obj.error, fallback);
    }
    if (Array.isArray(obj.issues) || Array.isArray(obj.errors)) {
      const issues = (obj.issues || obj.errors) as ZodIssue[];
      if (issues[0]) return issueToMessage(issues[0]);
    }
    return fallback;
  }

  const text = String(value).trim();
  if (!text) return fallback;
  if (looksLikeZodJson(text)) {
    // Try to parse and map the first issue
    try {
      const parsed = JSON.parse(text) as unknown;
      return sanitizeErrorText(parsed, fallback);
    } catch {
      return fallback;
    }
  }
  return text;
}

/** Turn any thrown value into a short, user-safe string for API responses. */
export function friendlyError(error: unknown, fallback: string): string {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    return first ? issueToMessage(first) : fallback;
  }
  // Zod sometimes surfaces as plain Error with JSON message
  if (error instanceof Error) {
    if (looksLikeZodJson(error.message)) {
      return sanitizeErrorText(error.message, fallback);
    }
    return sanitizeErrorText(error.message, fallback);
  }
  if (typeof error === "string") {
    return sanitizeErrorText(error, fallback);
  }
  return fallback;
}

/**
 * Read `error` from an API JSON body safely for UI display.
 * Never returns Zod JSON blobs.
 */
export function readApiError(
  data: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (data == null || typeof data !== "object") return fallback;
  const err = (data as { error?: unknown }).error;
  return sanitizeErrorText(err, fallback);
}
