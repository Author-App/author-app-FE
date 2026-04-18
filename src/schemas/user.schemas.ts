import { z } from 'zod';
import { apiResponseSchema } from './common.schemas';
import { userSchema } from './api.schemas';

// ============================================================================
// USER/PROFILE SCHEMAS
// ============================================================================

/**
 * GET /auth/me - User profile response
 */
export const getMeResponseSchema = apiResponseSchema(
  z.object({
    user: userSchema,
  })
);

/**
 * PATCH /profile - Update profile response (returns updated user)
 */
export const updateProfileResponseSchema = getMeResponseSchema;

/**
 * POST /profile/upload-image - Upload profile image response
 */
export const uploadProfileImageResponseSchema = getMeResponseSchema;

/**
 * GET /profile/image - Get profile image URL
 */
export const getProfileImageResponseSchema = apiResponseSchema(
  z.object({
    imageUrl: z.string(),
  })
);

/**
 * POST /password/change - Change password response
 */
export const changePasswordResponseSchema = apiResponseSchema(
  z.object({
    message: z.string(),
  })
);

/**
 * DELETE /account - Delete account response
 */
export const deleteAccountResponseSchema = apiResponseSchema(
  z.object({
    message: z.string(),
  })
);

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type GetMeResponse = z.infer<typeof getMeResponseSchema>;
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
export type UploadProfileImageResponse = z.infer<typeof uploadProfileImageResponseSchema>;
export type GetProfileImageResponse = z.infer<typeof getProfileImageResponseSchema>;
export type ChangePasswordResponse = z.infer<typeof changePasswordResponseSchema>;
export type DeleteAccountResponse = z.infer<typeof deleteAccountResponseSchema>;
