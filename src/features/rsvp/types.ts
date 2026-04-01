import type { RsvpFormData } from "./schema/rsvp-schema";

export type RsvpSubmissionInput = RsvpFormData;

export interface RsvpSubmissionResult {
  success: boolean;
  requestId: string;
  mode: "mock";
  error?: "invalid_input" | "storage_error";
}

export interface RsvpSubmissionService {
  submit(input: RsvpSubmissionInput): Promise<RsvpSubmissionResult>;
}
