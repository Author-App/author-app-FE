/**
 * Auth API Types
 * 
 * Request and response types for authentication endpoints.
 * Based on backend DTOs from auth.dto.ts and auth.validator.ts
 */

// ============================================================================
// SHARED TYPES
// ============================================================================

/**
 * User object returned from auth endpoints
 */
export interface User {
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

/**
 * Session tokens returned on successful login
 */
export interface Session {
  access: string;
  refresh: string;
}

/**
 * Response from token refresh endpoint
 */
export type RefreshResponse = Session;

/**
 * Device information sent with auth requests
 */
export interface DeviceInfo {
  deviceId?: string;
  deviceToken?: string;
  timeZone?: string;
}

// ============================================================================
// LOGIN
// ============================================================================

/**
 * POST /auth/login - Request
 */
export interface LoginRequest extends DeviceInfo {
  email: string;
  password: string;
  platform?: 'admin' | 'mobile';
}

/**
 * POST /auth/login - Response
 */
export interface LoginResponse {
  user: User;
  session?: Session;
  isEmailVerified: boolean;
  verificationLink?: string;
}

// ============================================================================
// SIGNUP
// ============================================================================

/**
 * POST /auth/signup - Request
 */
export interface SignupRequest extends DeviceInfo {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * POST /auth/signup - Response
 */
export interface SignupResponse {
  user: User;
  isEmailVerified: boolean;
  verificationLink?: string;
}

// ============================================================================
// FORGOT PASSWORD
// ============================================================================

/**
 * POST /password/forgot - Request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * POST /password/forgot - Response
 * Note: Backend returns token in response for mobile flow
 */
export interface ForgotPasswordResponse {
  message: string;
  token?: string;
}

// ============================================================================
// VERIFY CODE
// ============================================================================

/**
 * POST /password/verify - Request
 * Token is sent via x-forgot-password header
 */
export interface VerifyCodeRequest {
  token: string;
  code: string;
}

/**
 * POST /password/verify - Response
 * Returns reset token for the next step
 */
export interface VerifyCodeResponse {
  message: string;
  token?: string;
}

// ============================================================================
// RESET PASSWORD
// ============================================================================

/**
 * POST /password/reset - Request
 * Token is sent via x-reset-password header
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

/**
 * POST /password/reset - Response
 */
export interface ResetPasswordResponse {
  message: string;
}

// ============================================================================
// FORM VALUES (for Formik)
// ============================================================================

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface VerifyCodeFormValues {
  code: string;
}

export interface ResetPasswordFormValues {
  password: string;
}
