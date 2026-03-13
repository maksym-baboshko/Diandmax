import "server-only";

import { Resend } from "resend";

import type { RSVPFormData } from "@/widgets/rsvp/model";

import type { RsvpEmailConfig } from "./config";
import {
  buildRsvpEmailSubject,
  buildRsvpEmailText,
  RsvpNotificationEmail,
} from "./email-template";

function normalizeOptionalText(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function normalizeSubmission(data: RSVPFormData) {
  return {
    guestNames: data.guestNames.map((name) => name.trim()),
    attending: data.attending,
    guests: data.attending === "yes" ? data.guests ?? 1 : 0,
    dietary: normalizeOptionalText(data.dietary),
    message: normalizeOptionalText(data.message),
    submittedAt: new Date(),
  } as const;
}

let resendClient: Resend | null = null;
let resendClientApiKey: string | null = null;

function getResendClient(apiKey: string) {
  if (!resendClient || resendClientApiKey !== apiKey) {
    resendClient = new Resend(apiKey);
    resendClientApiKey = apiKey;
  }

  return resendClient;
}

export async function sendRsvpNotification(
  submission: RSVPFormData,
  config: RsvpEmailConfig
) {
  const normalizedSubmission = normalizeSubmission(submission);
  const subject = buildRsvpEmailSubject(
    normalizedSubmission,
    config.subjectPrefix
  );
  const text = buildRsvpEmailText(normalizedSubmission);

  if (config.mode === "mock") {
    console.info("RSVP mock email preview:", {
      from: config.from,
      to: config.to,
      subject,
      text,
    });

    return "mock";
  }

  const resend = getResendClient(config.apiKey!);

  const sendResult = await resend.emails.send({
    from: config.from,
    to: config.to,
    subject,
    react: <RsvpNotificationEmail submission={normalizedSubmission} />,
    text,
    tags: [
      { name: "source", value: "wedding-rsvp" },
      { name: "attending", value: normalizedSubmission.attending },
    ],
  });

  if (sendResult.error) {
    throw new Error(
      `[${sendResult.error.name}] ${sendResult.error.message}`
    );
  }

  return sendResult.data?.id ?? null;
}
