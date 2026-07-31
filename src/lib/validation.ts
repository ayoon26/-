import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  displayName: z
    .string()
    .trim()
    .min(1, "Tell us what to call you.")
    .max(40, "Keep it under 40 characters.")
    .optional()
    .or(z.literal("")),
});
export type SignInFormValues = z.infer<typeof signInSchema>;

export const goalFormSchema = z.object({
  name: z.string().trim().min(1, "Give your goal a name.").max(60),
  type: z.enum(["emergency_fund", "travel", "debt_payoff", "moving", "education", "major_purchase", "general_cushion"]),
  targetAmount: z.coerce
    .number({ message: "Enter an amount." })
    .positive("Target amount must be greater than zero.")
    .max(10_000_000, "That's larger than we can track here."),
  targetDate: z
    .string()
    .optional()
    .refine((val) => !val || !Number.isNaN(Date.parse(val)), "Enter a valid date."),
});
export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const missionAmountSchema = z.object({
  amount: z.coerce.number({ message: "Enter an amount." }).nonnegative("Amount can't be negative.").max(1_000_000),
});
export type MissionAmountFormValues = z.infer<typeof missionAmountSchema>;

export const transactionNoteSchema = z.object({
  note: z.string().trim().max(280, "Keep notes under 280 characters."),
});
export type TransactionNoteFormValues = z.infer<typeof transactionNoteSchema>;
