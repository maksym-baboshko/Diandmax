import { render } from "@react-email/components";
import { Resend } from "resend";
import { RsvpNotificationEmail, subject } from "./templates/RsvpNotificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface RsvpNotificationPayload {
  guestNames: string[];
  attending: "yes" | "no";
  guests: number;
  dietary?: string;
  message?: string;
  slug?: string;
}

export async function sendRsvpNotification(payload: RsvpNotificationPayload): Promise<void> {
  const toEmail = process.env.RSVP_TO_EMAILS; // comma-separated in .env.local
  const fromEmail = process.env.RSVP_FROM_EMAIL ?? "noreply@mail.diandmax.com";

  if (!toEmail || !process.env.RESEND_API_KEY) {
    // Skip silently in dev if not configured
    return;
  }

  const html = await render(<RsvpNotificationEmail {...payload} />);
  const to = toEmail
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  await resend.emails.send({
    from: fromEmail,
    to,
    subject: subject(payload.guestNames, payload.attending),
    html,
  });
}
