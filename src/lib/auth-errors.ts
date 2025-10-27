type ErrorKey =
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "weakPassword"
  | "emailInUse"
  | "userExists"
  | "invalidEmail"
  | "userNotFound"
  | "sessionExpired"
  | "rateLimited"
  | "unknown";

function getErrorMessageLower(err: unknown): string {
  if (typeof err === "string") return err.toLowerCase();
  if (typeof err === "object" && err !== null && "message" in err) {
    const maybeMsg = (err as { message?: unknown }).message;
    return typeof maybeMsg === "string" ? maybeMsg.toLowerCase() : "";
  }
  return "";
}

export function mapSupabaseErrorToKey(err: unknown): ErrorKey {
  const msg = getErrorMessageLower(err);

  if (msg.includes("invalid login credentials")) return "invalidCredentials";
  if (msg.includes("email not confirmed")) return "emailNotConfirmed";
  if (msg.includes("user already registered")) return "userExists";

  if (msg.includes("email")) {
    if (msg.includes("already") || msg.includes("in use")) return "emailInUse";
    if (msg.includes("invalid")) return "invalidEmail";
  }

  if (msg.includes("password") && msg.includes("weak")) return "weakPassword";
  if (msg.includes("user not found")) return "userNotFound";
  if (msg.includes("session") && msg.includes("expired"))
    return "sessionExpired";
  if (msg.includes("rate") || msg.includes("too many")) return "rateLimited";

  return "unknown";
}
