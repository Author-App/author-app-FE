import { useToastController } from '@tamagui/toast';

export function useAppToast() {
  const toast = useToastController();

  const showSuccessToast = (title: string, description?: string) => {
    toast.show(title, {
      description,
      preset: 'success',
      duration: 3000,
    });
  };

  const showErrorToast = (title: string, description?: string) => {
    toast.show(title, {
      description,
      preset: 'error',
      duration: 3000,
    });
  };

  const showWarningToast = (title: string, description?: string) => {
    toast.show(title, {
      description,
      preset: 'warning',
      duration: 3000,
    });
  };

  return { showSuccessToast, showErrorToast, showWarningToast };
}
