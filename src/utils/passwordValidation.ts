// Matches backend validator: 8-100 chars, upper & lower case, 2+ digits, special char
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,100}$/;

export const PASSWORD_REQUIREMENTS = [
  '8-100 characters',
  'Uppercase & lowercase letters',
  'At least 2 digits',
  'A special character (!@#$%^&*)',
];

/**
 * Validates password against backend requirements
 * @returns Error message or undefined if valid
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 100) return 'Password must be less than 100 characters';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
  if (!/\d.*\d/.test(password)) return 'Password must include at least 2 digits';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include a special character';
  return undefined;
};

/**
 * Yup-compatible password validation for forms using Yup
 */
export const passwordYupValidation = {
  min: 8,
  minMessage: 'Password must be at least 8 characters',
  max: 100,
  maxMessage: 'Password must be less than 100 characters',
  test: {
    name: 'password-strength',
    message: 'Password must include uppercase, lowercase, 2 digits, and a special character',
    test: (value: string | undefined) => !value || PASSWORD_REGEX.test(value),
  },
};
