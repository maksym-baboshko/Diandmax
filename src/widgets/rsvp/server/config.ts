import "server-only";

const DEFAULT_FROM_EMAIL = "Big Day RSVP <onboarding@resend.dev>";
const DEFAULT_SUBJECT_PREFIX = "Big Day RSVP";

export interface RsvpEmailConfig {
  apiKey: string;
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

export function getRsvpEmailConfig(): RsvpEmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = parseRecipientList(process.env.RSVP_TO_EMAILS);

  if (!apiKey || to.length === 0) {
    return null;
  }

  return {
    apiKey,
    from: process.env.RSVP_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL,
    to,
    subjectPrefix: process.env.RSVP_SUBJECT_PREFIX?.trim() || DEFAULT_SUBJECT_PREFIX,
  };
}
