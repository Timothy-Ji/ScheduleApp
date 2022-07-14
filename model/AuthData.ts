import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInData = z.infer<typeof SignInFormSchema>;

export const SignUpFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type SignUpData = z.infer<typeof SignUpFormSchema>;
