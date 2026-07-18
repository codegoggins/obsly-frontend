import { z } from "zod";

// strong password rules for signup / reset
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/\d/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a special character");

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company name is required"),
  country: z.string().min(1, "Please select your country"),
  email: z.email("Please enter a valid email"),
  password: passwordSchema,
  agree: z.boolean().refine((v) => v === true, { message: "You must accept the terms" }),
});

export type SignupValues = z.infer<typeof signupSchema>;
