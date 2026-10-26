import { Toast, type ToastAction } from "@/src/components/core/toast/toast";

/** Pass title '' for a one-line toast. action adds a button, such as Retry. */
export const showErrorToast = (error: string, title?: string, action?: ToastAction) => {
    Toast.show({
        type: 'error',
        text1: title ?? 'Oops!',
        text2: error,
        visibilityTime: 4000,
        props: { action },
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