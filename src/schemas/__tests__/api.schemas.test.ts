import { 
  userSchema, 
  sessionSchema, 
  loginResponseSchema,
  apiResponseSchema 
} from '../api.schemas';

describe('API Schemas', () => {
  describe('userSchema', () => {
    const validUser = {
      id: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      isEnabled: true,
      isEmailVerified: true,
      emailVerifiedAt: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should validate a correct user object', () => {
      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should fail if email is invalid', () => {
      const invalidUser = { ...validUser, email: 'not-an-email' };
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should fail if required field is missing', () => {
      const { id, ...userWithoutId } = validUser;
      const result = userSchema.safeParse(userWithoutId);
      expect(result.success).toBe(false);
    });

    it('should allow optional fields to be missing', () => {
      const userWithoutOptionals = { ...validUser };
      delete (userWithoutOptionals as any).profileImage;
      const result = userSchema.safeParse(userWithoutOptionals);
      expect(result.success).toBe(true);
    });

    it('should allow null for nullable fields', () => {
      const userWithNulls = {
        ...validUser,
        emailVerifiedAt: null,
        createdAt: null,
        updatedAt: null,
      };
      const result = userSchema.safeParse(userWithNulls);
      expect(result.success).toBe(true);
    });
  });

  describe('sessionSchema', () => {
    it('should validate valid session tokens', () => {
      const session = { access: 'abc123', refresh: 'xyz789' };
      const result = sessionSchema.safeParse(session);
      expect(result.success).toBe(true);
    });

    it('should fail if access token is empty', () => {
      const session = { access: '', refresh: 'xyz789' };
      const result = sessionSchema.safeParse(session);
      expect(result.success).toBe(false);
    });

    it('should fail if refresh token is missing', () => {
      const session = { access: 'abc123' };
      const result = sessionSchema.safeParse(session);
      expect(result.success).toBe(false);
    });
  });

  describe('loginResponseSchema', () => {
    const validLoginResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          isEnabled: true,
          isEmailVerified: true,
          emailVerifiedAt: null,
          createdAt: null,
          updatedAt: null,
        },
        session: { access: 'token123', refresh: 'refresh456' },
        isEmailVerified: true,
      },
    };

    it('should validate a complete login response', () => {
      const result = loginResponseSchema.safeParse(validLoginResponse);
      expect(result.success).toBe(true);
    });

    it('should allow login response without session (unverified user)', () => {
      const responseWithoutSession = {
        ...validLoginResponse,
        data: {
          ...validLoginResponse.data,
          session: undefined,
          isEmailVerified: false,
        },
      };
      const result = loginResponseSchema.safeParse(responseWithoutSession);
      expect(result.success).toBe(true);
    });

    it('should fail if success field is missing', () => {
      const { success, ...responseWithoutSuccess } = validLoginResponse;
      const result = loginResponseSchema.safeParse(responseWithoutSuccess);
      expect(result.success).toBe(false);
    });

    it('should fail if user data is invalid', () => {
      const responseWithInvalidUser = {
        ...validLoginResponse,
        data: {
          ...validLoginResponse.data,
          user: { id: '123' }, // Missing required fields
        },
      };
      const result = loginResponseSchema.safeParse(responseWithInvalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('apiResponseSchema', () => {
    it('should wrap any data type correctly', () => {
      const stringSchema = apiResponseSchema(userSchema);
      const response = {
        success: true,
        data: {
          id: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          isEnabled: true,
          isEmailVerified: true,
          emailVerifiedAt: null,
          createdAt: null,
          updatedAt: null,
        },
      };
      const result = stringSchema.safeParse(response);
      expect(result.success).toBe(true);
    });
  });
});
