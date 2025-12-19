import { useRouter } from "expo-router";
import { useState } from "react";
import { editProfileValidationSchema } from "../utils/validator";
import { showSuccessToast } from "../utils/toast";
import { useGetMeQuery, useUpdateProfileMutation, useUploadProfileImageMutation } from "../redux2/Apis/User";
import { RootState } from "../redux2/Store";
import { useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import { useEffect } from "react";



const useEditProfileController = () => {

    const token = useSelector((state: RootState) => state.auth.token);

    const { data, isLoading } = useGetMeQuery(undefined, {
        skip: !token,
    });
    const [updateProfile] = useUpdateProfileMutation();
    const [uploadProfileImage, { isLoading: uploading }] =
        useUploadProfileImageMutation();

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [isEditingName, setIsEditingName] = useState<boolean>(false);

    console.log("THIS IS ME", data);
    const user = data?.data?.user ?? {};

    const router = useRouter();

    const initialValues = {
        fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
        email: user?.email ?? "",
    };

    useEffect(() => {
        if (user?.profileImage) {
            setProfileImage(user.profileImageUrl);
        }
    }, [user?.profileImage]);

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setLoading(true);

            const [firstName, ...rest] = values.fullName.trim().split(" ");
            const lastName = rest.join(" ");

            await updateProfile({
                firstName,
                lastName,
            }).unwrap();

            // resetForm();

            showSuccessToast("Profile updated successfully");

            // Go back to Settings
            router.back();
        } catch (err) {
            console.log("Update profile error", err);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const pickImage = async () => {
        // const result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //     quality: 0.8,
        // });

        const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 0.8,
            selectionLimit: 1,
        });


        if (!result.canceled) {
            const asset = result.assets[0];

            const formData = new FormData();
            formData.append("image", {
                uri: asset.uri,
                name: "profile.jpg",
                type: "image/jpeg",
            } as any);

            await uploadProfileImage(formData).unwrap();
            setProfileImage(asset.uri);
        }
    };



    return {
        validator: editProfileValidationSchema,
        router,
        values: { initialValues },
        functions: {
            handleSubmit,
            pickImage,
            setSubmitted,
        },
        states: {
            submitted,
            loading: loading || uploading,
            profileImage,
        },
    }

}

export default useEditProfileController