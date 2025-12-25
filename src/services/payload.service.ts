/**
 * Payload Service (Factory Pattern)
 * 
 * Creates typed request payloads for API calls.
 * Encapsulates payload construction logic and device info fetching.
 */

import { getDeviceInfo } from '@/src/services/device.service';
import type { LoginRequest, SignupRequest } from '@/src/types';

/**
 * Creates a login request payload
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns LoginRequest with device info
 */
export const createLoginPayload = async (
  email: string,
  password: string
): Promise<LoginRequest> => {
  const deviceInfo = await getDeviceInfo();

  return {
    email,
    password,
    platform: 'mobile',
    ...deviceInfo,
  };
};

/**
 * Creates a signup request payload
 * 
 * @param fullName - User's full name (will be split into first/last)
 * @param email - User's email address
 * @param password - User's password
 * @returns SignupRequest with device info
 */
export const createSignupPayload = async (
  fullName: string,
  email: string,
  password: string
): Promise<SignupRequest> => {
  const deviceInfo = await getDeviceInfo();
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    firstName,
    lastName,
    email,
    password,
    ...deviceInfo,
  };
};
