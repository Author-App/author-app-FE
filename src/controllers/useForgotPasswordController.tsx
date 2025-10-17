import { useRouter } from "expo-router";
import { useState } from "react";
import { forgotPasswordFormValidator } from "@/src/utils/validator";


const initialValues = {
    email: '',
};

const useForgotPasswordController = () => {

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("THIS IS VALUESS", values);

            router.push('/(public)/verificationCode');

            resetForm();
        } catch (error) {
            console.log("THIS IS ERROR", error);
        } finally {
            setLoading(false);
        }
    }

    return {
        validator: forgotPasswordFormValidator,
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

export default useForgotPasswordController