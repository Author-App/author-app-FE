import Toast from "react-native-toast-message";

export const showErrorToast = (error: string, title?: string) => {
    Toast.show({
        type: 'error',
        text1: title ?? 'Oops!',
        text2: error,
        visibilityTime: 4000,
    });
};

export const showSuccessToast = (message: string, title?: string) => {
    Toast.show({
        type: 'success',
        text1: title ?? 'Well done!',
        text2: message,
        visibilityTime: 3000,
    });
};

export const showInfoToast = (message: string, title?: string) => {
    Toast.show({
        type: 'info',
        text1: title ?? 'Just so you know',
        text2: message,
        visibilityTime: 3000,
    });
};