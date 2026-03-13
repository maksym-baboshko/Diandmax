import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().min(2),
  attending: z.enum(["yes", "no"]),
  guests: z.coerce.number().min(1).max(10).optional(),
  dietary: z.string().optional(),
  message: z.string().optional(),
});

export type RSVPFormData = z.infer<typeof rsvpSchema>;
