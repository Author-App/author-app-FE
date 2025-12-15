import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { showSuccessToast } from "../utils/toast";


const initialValues = {
    fullName: 'Stanley Padden',
    email: 'stanley@gmail.com',
};

const useSettingsController = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'General' | 'Account'>('General');
    const [isPremium, setIsPremium] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const [isEditingName, setIsEditingName] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = useCallback(async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
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
    }, [router]);

    const handleLogout = useCallback(async () => {
        try {
            // clear storage / tokens
            showSuccessToast("Logged out successfully");
            router.replace("/login");
        } catch (error) {
            console.log("Logout error:", error);
        }
    }, [router]);

    // ✅ Handle delete account
    const handleDeleteAccount = useCallback(async () => {
        try {
            showSuccessToast("Account deleted successfully");
            router.replace("/login");
        } catch (error) {
            console.log("Delete account error:", error);
        }
    }, [router]);

    // ✅ Navigation for account options
    const navigateTo = useCallback((screen: string) => {
        switch (screen) {
            case "Notifications":
                router.push("/notifications");
                break;
            case "ChangePassword":
                // router.push("/change-password");
                console.log("/change-password");
                
                break;
            case "Upgrade":
                console.log("/subscription");
                break;
            case "BugReport":
                console.log("/report-bug");
                break;
            default:
                console.warn("Unknown route:", screen);
        }
    }, [router]);

    return {
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

export default useSettingsController