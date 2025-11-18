import { useRouter } from "expo-router";
import { useState } from "react";
import { loginValidationSchema } from "../utils/validator";
import { showSuccessToast } from "../utils/toast";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux2/Apis/Auth";
// import { useLoginMutation } from "../redux/Apis/Auth";


const initialValues = {
    email: '',
    password: '',
};

const useLoginController = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const [login, { data, isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {

        try {
            setSubmitted(true);
            setLoading(true);

            console.log("Login form values:", values);

            const res = await login(values).unwrap();
            console.log("Login API Response:", res);

            showSuccessToast("You’ve logged in successfully");

            router.replace("/(app)/(tabs)/(home)");

            resetForm();
        } catch (error) {
            console.log("LOGIN ERROR", error);
        } finally {
            setLoading(false);
        }

        // try {
        //     setLoading(true);

        //     await new Promise((resolve) => setTimeout(resolve, 2000));

        //     console.log("THIS IS VALUESS", values);

        //     router.replace('/(app)/(tabs)/(home)');
        //     showSuccessToast('You’ve logged in successfully')

        //     resetForm();
        // } catch (error) {
        //     console.log("THIS IS ERROR", error);
        // } finally {
        //     setLoading(false);
        // }
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