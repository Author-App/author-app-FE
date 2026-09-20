import type { ApiResponse } from '@/src/types/api/common.types';

const user = {
  id: 'u1',
  email: 'reader@example.com',
  firstName: 'Shehzar',
  lastName: 'Abbasi',
  role: 'user',
  isEnabled: true,
  isEmailVerified: true,
  emailVerifiedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

/** A successful POST /auth/login body. Shape matches loginResponseSchema. */
export const buildLoginResponse = (): ApiResponse<unknown> => ({
  success: true,
  data: {
    user,
    session: { access: 'access-token', refresh: 'refresh-token' },
    isEmailVerified: true,
  },
});

/** A successful GET /auth/me body. useLogin calls this before navigating. */
export const buildMeResponse = (): ApiResponse<unknown> => ({
  success: true,
  data: { user },
});
