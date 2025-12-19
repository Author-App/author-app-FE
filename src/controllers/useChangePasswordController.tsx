import { useRouter } from "expo-router";
import { useState } from "react";
import { changePasswordFormValidator } from "../utils/validator";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { useChangePasswordMutation } from "../redux2/Apis/User";


const initialValues = {
    currentPassword: '',
    newPassword: '',
};

const useChangePasswordController = () => {

    const [submitted, setSubmitted] = useState<boolean>(false);

    const [changePassword, { isLoading }] =
        useChangePasswordMutation();


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            await changePassword({
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            }).unwrap();

            showSuccessToast("Password changed successfully");

            router.back();
        } catch (error) {
            console.log("THIS IS ERROR", error);
            showErrorToast(error?.data?.message)
        } finally {
            setSubmitting(false);
        }
    }


    return {
        validator: changePasswordFormValidator,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setSubmitted,
        },
        states: {
            loading:isLoading,
            submitted,
        },
        router,
    }

}

export default useChangePasswordController