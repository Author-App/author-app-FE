import { useRouter } from "expo-router";
import { useState } from "react";
import { signupValidationSchema } from "@/src/utils/validator";
import { showErrorToast, showSuccessToast } from "@/src/utils/toast";
import { useSignupMutation } from "../redux2/Apis/Auth";


const initialValues = {
    fullName: '',
    email: '',
    password: '',
};

const useSignupController = () => {

    const [submitted, setSubmitted] = useState<boolean>(false);

    const [signup, { data, isLoading, error }] = useSignupMutation();


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {

            const parts = values.fullName.trim().split(" ");
            const firstName = parts[0];
            const lastName = parts.slice(1).join(" ");

            const payload = {
                firstName: firstName,
                lastName: lastName || "",
                email: values.email,
                password: values.password,
                deviceId: "abcd1234-ab",
                timeZone: "GMT",
            };

            const res = await signup(payload).unwrap();
            if (res) {
                console.log("THIS IS RES", res);

                router.replace('/(public)/login');
                showSuccessToast('You’ve signed up successfully')
                resetForm();

            }
        } catch (err: any) {
            showErrorToast(err?.data?.message)
        }
    }

    return {
        validator: signupValidationSchema,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
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

export default useSignupController