import { z } from "zod";

/* =========================
   VALIDATION SCHEMA
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
  county: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().min(1, "Country is required"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  googlePlaceId: z.string().optional().nullable(),
  isPrimary: z.boolean(),
});

const googlePlaceAddressSchema = addressSchema.extend({
  googlePlaceId: z.string().min(1, "GooglePlaceId is mandatory"),
});

export const companyProfileSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(150),
    logoUrl: z.string().url().optional().nullable().or(z.literal("")),
    chatLink: z.string().url().optional().nullable().or(z.literal("")),

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
    // Phones: if provided, at least one must be present (array not empty)
    if (val.phones && val.phones.length === 0) {
      // allowed — optional
    }

    // At most one primary phone
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

export type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;