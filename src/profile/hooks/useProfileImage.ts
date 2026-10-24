import { useState, useCallback, useEffect } from 'react';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { useUploadProfileImageMutation } from '@/src/store/api/userApi';
import { haptics } from '@/src/utils/haptics';
import { showErrorToast } from '@/src/utils/toast';

interface UseProfileImageConfig {
  initialImageUrl: string | null;
}

interface UseProfileImageReturn {
  imageUri: string | null;
  isUploading: boolean;
  pickAndUploadImage: () => Promise<void>;
}

export function useProfileImage({ initialImageUrl }: UseProfileImageConfig): UseProfileImageReturn {
  const [imageUri, setImageUri] = useState<string | null>(initialImageUrl);
  const [uploadProfileImage, { isLoading: isUploading }] = useUploadProfileImageMutation();

  useEffect(() => {
    if (initialImageUrl) {
      setImageUri(initialImageUrl);
    }
  }, [initialImageUrl]);

  const pickAndUploadImage = useCallback(async () => {
    haptics.light();
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets?.length) {
      return;
    }

    const asset: Asset = result.assets[0];
    if (!asset.uri) return;

    const formData = new FormData();
    formData.append('image', {
      uri: asset.uri,
      name: asset.fileName ?? 'profile.jpg',
      type: asset.type ?? 'image/jpeg',
    } as any);

    try {
      await uploadProfileImage(formData).unwrap();
      haptics.success();
      setImageUri(asset.uri);
    } catch (error: any) {
      haptics.error();
      showErrorToast(error?.data?.message || 'Could not upload your photo. Please try again.');
    }
  }, [uploadProfileImage]);

  return {
    imageUri,
    isUploading,
    pickAndUploadImage,
  };
}
