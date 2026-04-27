import { z } from "zod";

/* =========================
   SUB-SCHEMAS
========================= */

const phoneSchema = z.object({
  number: z.string().min(1, "Phone number is required").max(20),
  countryCode: z.string().min(1, "Country code is required").max(5),
  isPrimary: z.boolean(),
});

const emailSchema = z.object({
  address: z.string().email("Invalid email"),
  isPrimary: z.boolean(),
});

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  county: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  country: z.string().min(1, "Country is required"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  googlePlaceId: z.string().nullable().optional(),
  isPrimary: z.boolean(),
});

// googlePlaceAddress mirrors Address but keeps googlePlaceId nullable to match
// the server DTO. When present and non-empty it must be >= 1 char.
const googlePlaceAddressSchema = addressSchema.extend({
  googlePlaceId: z
    .string()
    .min(1, "GooglePlaceId is mandatory")
    .nullable()
    .optional(),
});

const urlLike = z
  .union([z.string().url("Must be a valid URL"), z.literal(""), z.null()])
  .optional();

/* =========================
   MAIN SCHEMA
========================= */
export const companyProfileSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(150),
    logoUrl: urlLike,
    chatLink: urlLike,

    phones: z
      .array(phoneSchema)
      .max(2, "Maximum 2 phones allowed")
      .optional()
      .default([]),

    emails: z
      .array(emailSchema)
      .max(2, "Maximum 2 emails allowed")
      .optional()
      .default([]),

    addresses: z.array(addressSchema).optional().default([]),

    googlePlaceAddress: googlePlaceAddressSchema.nullable().optional(),
  })
  .superRefine((val, ctx) => {
    const primaryPhones = (val.phones ?? []).filter((p) => p.isPrimary).length;
    if (primaryPhones > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phones"],
        message: "Only one phone can be primary",
      });
    }

    const primaryEmails = (val.emails ?? []).filter((e) => e.isPrimary).length;
    if (primaryEmails > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emails"],
        message: "Only one email can be primary",
      });
    }

    const primaryAddresses = (val.addresses ?? []).filter((a) => a.isPrimary)
      .length;
    if (primaryAddresses > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["addresses"],
        message: "Only one address can be primary",
      });
    }
  });

/* =========================
   TYPES
========================= */
export type CompanyProfileFormValues = z.input<typeof companyProfileSchema>;
export type CompanyProfileValidated = z.output<typeof companyProfileSchema>;