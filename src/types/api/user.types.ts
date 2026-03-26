/**
 * Settings/User API Types
 *
 * Request and response types for user profile and account endpoints.
 */

import type { ApiResponse } from './common.types';

// ============================================================================
// USER DATA
// ============================================================================

/**
 * User profile data from /auth/me endpoint
 */
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEnabled: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  profileImage?: string;
  profileImageUrl?: string;
  isNotificationEnabled?: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// ============================================================================
// API RESPONSES
// ============================================================================

/**
 * GET /auth/me response
 */
export interface GetMeResponse {
  user: UserData;
}

/**
 * DELETE /account response
 */
export interface DeleteAccountResponse {
  message: string;
}

/**
 * PATCH /profile request body
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

/**
 * POST /password/change request body
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export type GetMeApiResponse = ApiResponse<GetMeResponse>;
export type DeleteAccountApiResponse = ApiResponse<DeleteAccountResponse>;
