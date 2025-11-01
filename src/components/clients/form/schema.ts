import { z } from "zod";

export const addressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
});

export const clientFormSchema = z
  .object({
    name: z.string().min(1, { message: "clients.form.errors.nameRequired" }),
    email: z.email({ message: "clients.form.errors.emailInvalid" }).optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(["prospect", "actif", "inactif"]),
    address: addressSchema.optional(),
  })
  .superRefine((val, ctx) => {
    const a = val.address;
    if (!a) return;
    const values = [
      a.line1?.trim(),
      a.line2?.trim(),
      a.postal_code?.trim(),
      a.city?.trim(),
      a.region?.trim(),
      a.country?.trim(),
    ];
    const hasAny = values.some((v) => !!v && v.length > 0);
    if (hasAny && !(a.line1 && a.line1.trim().length > 0)) {
      ctx.addIssue({
        code: "custom",
        message: "clients.form.errors.addressLine1Required",
        path: ["address", "line1"],
      });
    }
  });

export type ClientFormValues = z.infer<typeof clientFormSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
