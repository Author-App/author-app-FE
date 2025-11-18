import { useRouter } from "expo-router";
import { useState } from "react";
import { changePasswordFormValidator, editProfileValidationSchema, loginValidationSchema } from "../utils/validator";
import { showSuccessToast } from "../utils/toast";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/Apis/Auth";


const initialValues = {
    currentPassword: '',
    newPassword: '',
};

const useChangePasswordController = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'General' | 'Account'>('General');
    const [isPremium, setIsPremium] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const [isEditingName, setIsEditingName] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("THIS IS VALUESS", values);

            router.replace('/(app)/(tabs)/profile');

            // resetForm();
        } catch (error) {
            console.log("THIS IS ERROR", error);
        } finally {
            setLoading(false);
        }
    }


    return {
        validator: changePasswordFormValidator,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setLoading,
            setSubmitted,
            setActiveTab,
            setIsEditingName,
            setIsPremium,
            setNotificationsEnabled,
        },
        states: {
            loading,
            submitted,
            activeTab,
            isEditingName,
            isPremium,
            notificationsEnabled,
        },
        router,
    }

}

export default useChangePasswordController