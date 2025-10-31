import { useRouter } from "expo-router";
import { useState } from "react";
import { loginValidationSchema, signupValidationSchema } from "@/src/utils/validator";
import { showSuccessToast } from "@/src/utils/toast";


const initialValues = {
    fullName: '',
    email: '',
    password: '',
};

const useSignupController = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("THIS IS VALUESS", values);

            router.replace('/(public)/login');
            showSuccessToast('You’ve signed up successfully')
            resetForm();
        } catch (error) {
            console.log("THIS IS ERROR", error);
        } finally {
            setLoading(false);
        }
    }

    return {
        validator: signupValidationSchema,
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

export default useSignupController