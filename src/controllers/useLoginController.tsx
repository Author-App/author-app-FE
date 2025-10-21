import { useRouter } from "expo-router";
import { useState } from "react";
import { loginValidationSchema } from "../utils/validator";
import { useAppToast } from "../utils/toast";


const initialValues = {
    email: '',
    password: '',
};

const useLoginController = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);


    const router = useRouter();

    const { showSuccessToast, showErrorToast } = useAppToast();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("THIS IS VALUESS", values);

            router.replace('/(tabs)');

            showSuccessToast('Success', 'You’ve logged in successfully')

            resetForm();
        } catch (error) {
            console.log("THIS IS ERROR", error);
        } finally {
            setLoading(false);
        }
    }

    return {
        validator: loginValidationSchema,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setLoading,
            setSubmitted
        },
        states: {
            loading,
            submitted,
        },
        router,
    }

}

export default useLoginController