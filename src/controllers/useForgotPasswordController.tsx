import { useRouter } from "expo-router";
import { useState } from "react";
import { forgotPasswordFormValidator } from "@/src/utils/validator";
import { useForgotPasswordMutation } from "../redux2/Apis/Auth";
import { showErrorToast, showSuccessToast } from "../utils/toast";


const initialValues = {
    email: '',
};

const useForgotPasswordController = () => {

    // const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [forgotPassword, { data, isLoading, error }] = useForgotPasswordMutation();


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {

            const payload = {
                email: values.email,
            };

            const res = await forgotPassword(payload).unwrap();
            if (res) {
                console.log("THIS IS RES", res);
                router.push({
                    pathname: '/(public)/verificationcode',
                    params: {
                        token: res?.data?.token,  // or the correct token field
                    }
                });
                resetForm();

            }
        } catch (err: any) {
            showErrorToast(err?.data?.message)
        }
        // try {
        //     setLoading(true);

        //     await new Promise((resolve) => setTimeout(resolve, 2000));

        //     console.log("THIS IS VALUESS", values);

        //     router.push('/(public)/verificationCode');

        //     resetForm();
        // } catch (error) {
        //     console.log("THIS IS ERROR", error);
        // } finally {
        //     setLoading(false);
        // }
    }

    return {
        validator: forgotPasswordFormValidator,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            // setLoading,
            setSubmitted
        },
        states: {
            loading: isLoading,
            error: error,
            submitted,
        },
        router,
    }

}

export default useForgotPasswordController