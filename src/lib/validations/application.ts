import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z.string().min(1, "Full legal name is required"),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Mailing address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  reason: z
    .string()
    .min(
      10,
      "Please provide a statement of interest (at least 10 characters)"
    ),
  referredBy: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message:
      "You must acknowledge that PAAN is a Private Membership Association",
  }),
  agreedToBylaws: z.boolean().refine((val) => val === true, {
    message: "You must agree to the bylaws",
  }),
  agreedToMc1r: z.boolean().refine((val) => val === true, {
    message:
      "You must acknowledge that membership requires MC1R-functional biological verification",
  }),
  agreedToStatementOfFaith: z.boolean().refine((val) => val === true, {
    message: "You must confirm you have read the Statement of Faith",
  }),
  agreedToPrivateStatus: z.boolean().refine((val) => val === true, {
    message: "You must confirm you have read the Notice of Private Status",
  }),
  agreedToPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must confirm you have read the Privacy Policy",
  }),
  agreedVoluntary: z.boolean().refine((val) => val === true, {
    message:
      "You must confirm you are applying voluntarily",
  }),
  signature: z.string().min(1, "Digital signature is required"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
