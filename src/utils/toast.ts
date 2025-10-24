import Toast from "react-native-toast-message";


export const showErrorToast = (error: string) =>{
    Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: `${error}`,
      });
}

export const showSuccessToast = (message: string) =>{
    Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: `${message}`,
      });
}