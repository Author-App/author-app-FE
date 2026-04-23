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