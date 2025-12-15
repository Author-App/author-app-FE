import { useRouter } from "expo-router";
import { useState } from "react";
import { loginValidationSchema } from "../utils/validator";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux2/Apis/Auth";
// import { useLoginMutation } from "../redux/Apis/Auth";


const initialValues = {
    email: '',
    password: '',
};

const useLoginController = () => {

    const [submitted, setSubmitted] = useState<boolean>(false);

    const [login, { data, isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {

        try {
            const payload = {
                email: values.email,
                password: values.password,
                deviceId: "abcd1234-ab",
                timeZone: "GMT",
            }

            // const res = await login(payload).unwrap();

            const res = await login(payload);   // REMOVE unwrap()

            console.log("THIS IS RES", res);


            if (res?.data) {
                showSuccessToast("You’ve logged in successfully");
                router.replace("/(app)/(tabs)/(home)");
                resetForm();
            }
            if (res?.error) {
                const errorData = res?.error as { data?: { message?: string } };
                const message = errorData?.data?.message || "Something went wrong";
                showErrorToast(message);
                return;
            }

        } catch (err: any) {
            showErrorToast(err?.data?.message)
            console.log("ERROR", error);

        }
    }

    return {
        validator: loginValidationSchema,
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

export default useLoginController