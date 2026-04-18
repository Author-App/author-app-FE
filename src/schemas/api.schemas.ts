import { z } from 'zod';

// Wraps data in standard API response format { success, message?, data }
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
  });

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  isEnabled: z.boolean(),
  isEmailVerified: z.boolean(),
  emailVerifiedAt: z.string().nullable(),
  profileImage: z.string().optional(),
  profileImageUrl: z.string().optional(),
  isNotificationEnabled: z.boolean().optional(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const sessionSchema = z.object({
  access: z.string().min(1),
  refresh: z.string().min(1),
});

export const loginResponseSchema = apiResponseSchema(
  z.object({
    user: userSchema,
    session: sessionSchema.optional(),
    isEmailVerified: z.boolean(),
    verificationLink: z.string().optional(),
  })
);

export const signupResponseSchema = apiResponseSchema(
  z.object({
    user: userSchema,
    isEmailVerified: z.boolean(),
    verificationLink: z.string().optional(),
  })
);

export const forgotPasswordResponseSchema = apiResponseSchema(
  z.object({
    message: z.string(),
    token: z.string().optional(),
  })
);

export const verifyCodeResponseSchema = apiResponseSchema(
  z.object({
    message: z.string(),
    token: z.string().optional(),
  })
);

export const resetPasswordResponseSchema = apiResponseSchema(
  z.object({
    message: z.string(),
  })
);

// Types inferred from schemas
export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
