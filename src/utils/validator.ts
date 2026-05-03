import * as Yup from 'yup';
import { passwordYupValidation } from './passwordValidation';

export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});


export const signupValidationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(passwordYupValidation.min, passwordYupValidation.minMessage)
        .max(passwordYupValidation.max, passwordYupValidation.maxMessage)
        .test(passwordYupValidation.test)
        .required('Password is required'),
});

export const forgotPasswordFormValidator = Yup.object().shape({
    email: Yup
        .string()
        .email('Email is wrong !! TRY AGAIN')
        .required('Email is required'),
});

export const codeValidationSchema = Yup.object().shape({
    code: Yup
        .string()
        .length(6, 'Verification code must be 6 characters')
        .required('Verification code is required'),
});

export const resetPasswordFormValidator = Yup.object().shape({
    password: Yup.string()
        .min(passwordYupValidation.min, passwordYupValidation.minMessage)
        .max(passwordYupValidation.max, passwordYupValidation.maxMessage)
        .test(passwordYupValidation.test)
        .required('Password is required'),
});

export const editProfileValidationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string()
        .email('Invalid email format')
        // .required('Email is required'),
});

export const changePasswordFormValidator = Yup.object().shape({
    currentPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Current Password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
});

// Valid US state codes
const US_STATE_CODES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', 'PR', 'VI', 'GU', 'AS', 'MP', // Territories
];

// Valid Canadian province codes
const CA_PROVINCE_CODES = [
    'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

// Countries Lulu ships to (subset of most common)
const LULU_SUPPORTED_COUNTRIES = [
    'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 
    'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'NZ', 'JP', 'KR',
    'SG', 'HK', 'IN', 'BR', 'MX', 'PL', 'CZ', 'PT', 'GR', 'HU',
];

export const shippingAddressValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s\-'.]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
        .required('First name is required'),
    lastName: Yup.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s\-'.]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
        .required('Last name is required'),
    street1: Yup.string()
        .min(5, 'Street address must be at least 5 characters')
        .max(100, 'Street address cannot exceed 100 characters')
        .test('no-po-box', 'PO Box addresses may not be supported for all shipping methods', function(value) {
            if (!value) return true;
            // Warn but don't block - some shipping methods support PO Box
            const isPOBox = /\b(p\.?o\.?\s*box|post\s*office\s*box)\b/i.test(value);
            return !isPOBox; // Will show warning if PO Box detected
        })
        .required('Street address is required'),
    street2: Yup.string()
        .max(100, 'Apartment/Suite cannot exceed 100 characters'),
    city: Yup.string()
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s\-'.]+$/, 'City name can only contain letters, spaces, and hyphens')
        .required('City is required'),
    stateCode: Yup.string()
        .required('State/Province is required')
        .test('valid-state', 'Invalid state/province code', function(value) {
            if (!value) return false;
            const { countryCode } = this.parent;
            const upperValue = value.toUpperCase();
            
            if (countryCode === 'US') {
                if (!US_STATE_CODES.includes(upperValue)) {
                    return this.createError({ message: `Invalid US state code. Use 2-letter code (e.g., NY, CA)` });
                }
            } else if (countryCode === 'CA') {
                if (!CA_PROVINCE_CODES.includes(upperValue)) {
                    return this.createError({ message: `Invalid Canadian province code. Use 2-letter code (e.g., ON, BC)` });
                }
            } else {
                // For other countries, just ensure it's not empty and reasonable length
                if (value.length < 2 || value.length > 10) {
                    return this.createError({ message: 'State/Province must be 2-10 characters' });
                }
            }
            return true;
        }),
    postcode: Yup.string()
        .required('Postal code is required')
        .test('valid-postcode', 'Invalid postal code format', function(value) {
            if (!value) return false;
            const { countryCode } = this.parent;
            
            // US: 5 digits or 5+4 format (12345 or 12345-6789)
            if (countryCode === 'US') {
                if (!/^\d{5}(-\d{4})?$/.test(value)) {
                    return this.createError({ message: 'US ZIP code must be 5 digits (e.g., 10001) or 5+4 format (e.g., 10001-1234)' });
                }
            }
            // Canada: A1A 1A1 format
            else if (countryCode === 'CA') {
                if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value)) {
                    return this.createError({ message: 'Canadian postal code must be in format A1A 1A1' });
                }
            }
            // UK: Various formats
            else if (countryCode === 'GB') {
                if (!/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/.test(value)) {
                    return this.createError({ message: 'UK postcode format is invalid (e.g., SW1A 1AA)' });
                }
            }
            // Australia: 4 digits
            else if (countryCode === 'AU') {
                if (!/^\d{4}$/.test(value)) {
                    return this.createError({ message: 'Australian postcode must be 4 digits' });
                }
            }
            // Germany: 5 digits
            else if (countryCode === 'DE') {
                if (!/^\d{5}$/.test(value)) {
                    return this.createError({ message: 'German postcode must be 5 digits' });
                }
            }
            // Default: at least 3 characters, alphanumeric
            else if (value.length < 3 || value.length > 12) {
                return this.createError({ message: 'Postal code must be 3-12 characters' });
            }
            
            return true;
        }),
    countryCode: Yup.string()
        .length(2, 'Country code must be 2 characters (e.g., US, CA, GB)')
        .uppercase('Country code must be uppercase')
        .required('Country is required')
        .test('supported-country', 'This country may not be supported for shipping', function(value) {
            if (!value) return false;
            const upperValue = value.toUpperCase();
            if (!LULU_SUPPORTED_COUNTRIES.includes(upperValue)) {
                // Warning, not blocking - Lulu may support more countries
                return this.createError({ 
                    message: `Shipping to ${upperValue} may not be available. Common countries: US, CA, GB, AU, DE` 
                });
            }
            return true;
        }),
    phone: Yup.string()
        .required('Phone number is required')
        .test('valid-phone', 'Invalid phone number', function(value) {
            if (!value) return false;
            // Remove common formatting characters for validation
            const digitsOnly = value.replace(/[\s\-\(\)\+\.]/g, '');
            
            if (digitsOnly.length < 10) {
                return this.createError({ message: 'Phone number must be at least 10 digits' });
            }
            if (digitsOnly.length > 15) {
                return this.createError({ message: 'Phone number cannot exceed 15 digits' });
            }
            if (!/^\d+$/.test(digitsOnly)) {
                return this.createError({ message: 'Phone number can only contain digits and formatting characters' });
            }
            return true;
        }),
    email: Yup.string()
        .email('Invalid email format')
        .max(100, 'Email cannot exceed 100 characters')
        .required('Email is required'),
    companyName: Yup.string()
        .max(50, 'Company name cannot exceed 50 characters'),
});