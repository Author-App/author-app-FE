import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { codeValidationSchema } from "@/src/utils/validator";
import { showErrorToast } from "../utils/toast";
import { useVerifycodeMutation } from "../redux2/Apis/Auth";


const initialValues = {
    code: '',
};

const useVerificationCodeController = () => {

    const { token } = useLocalSearchParams();

    const [verifycode, { data, isLoading, error }] = useVerifycodeMutation();


    // const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);


    const router = useRouter();

    const handleOTPChange = (
        text: string,
        setFieldValue: (field: string, value: any) => void,
        handleSubmit: () => void
    ) => {
        setFieldValue("code", text);

        if (text.length === 6) {
            handleSubmit();
        }
    };


    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {

            const payload = {
                code: values.code,
            };

            // const res = await verifycode(payload).unwrap();
            const res = await verifycode({
                token,          // ← sent in header later
                code: values.code,
            }).unwrap();
            if (res) {
                console.log("THIS IS RES", res);
                router.push({
                    pathname: '/(public)/resetpassword',
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

        //     router.push('/(public)/resetPassword');

        //     resetForm();
        // } catch (error) {
        //     console.log("THIS IS ERROR", error);
        // } finally {
        //     setLoading(false);
        // }
    }

    return {
        validator: codeValidationSchema,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setSubmitted,
            handleOTPChange,
        },
        states: {
            loading: isLoading,
            error: error,
            submitted,
        },
        router,
    }

}

export default useVerificationCodeController