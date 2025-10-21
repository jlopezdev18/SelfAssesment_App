/**
 * Centralized Zod validation schemas
 */
import { z } from "zod";

// Company validation schemas
export const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "Owner first name is required"),
  lastName: z.string().min(1, "Owner last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

// Type exports for convenience
export type CompanyFormData = z.infer<typeof companySchema>;
export type UserFormData = z.infer<typeof userSchema>;
