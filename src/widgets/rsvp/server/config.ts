import "server-only";

const DEFAULT_FROM_EMAIL = "Big Day RSVP <onboarding@resend.dev>";
const DEFAULT_SUBJECT_PREFIX = "Big Day RSVP";
const DEFAULT_DELIVERY_MODE = "resend";

export type RsvpDeliveryMode = "resend" | "mock";

export interface RsvpEmailConfig {
  mode: RsvpDeliveryMode;
  apiKey: string | null;
  from: string;
  to: string[];
  subjectPrefix: string;
}

function parseRecipientList(value?: string) {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/[;,]/)
        .map((email) => email.trim())
        .filter(Boolean)
    )
  );
}

function parseDeliveryMode(value?: string): RsvpDeliveryMode {
  return value?.trim().toLowerCase() === "mock"
    ? "mock"
    : DEFAULT_DELIVERY_MODE;
}

export function getRsvpEmailConfig(): RsvpEmailConfig | null {
  const mode = parseDeliveryMode(process.env.RSVP_DELIVERY_MODE);
  const apiKey = process.env.RESEND_API_KEY?.trim() || null;
  const to = parseRecipientList(process.env.RSVP_TO_EMAILS);
  const from = process.env.RSVP_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
  const subjectPrefix =
    process.env.RSVP_SUBJECT_PREFIX?.trim() || DEFAULT_SUBJECT_PREFIX;

  if (mode === "mock") {
    return {
      mode,
      apiKey,
      from,
      to,
      subjectPrefix,
    };
  }

  if (!apiKey || to.length === 0) {
    return null;
  }

  return {
    mode,
    apiKey,
    from,
    to,
    subjectPrefix,
  };
}
