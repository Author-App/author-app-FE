import { View, ActivityIndicator } from "react-native";
import Pdf from "react-native-pdf";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import { getPdfProgress, savePdfProgress } from "@/src/storage/bookProgress";
import { useGetBookDetailQuery } from "@/src/redux2/Apis/Books";

const EbookReader = () => {
  const { bookId } = useLocalSearchParams<{
    bookId: string;
  }>();

  const { data, isLoading } = useGetBookDetailQuery(bookId!, {
    skip: !bookId,
  });


  const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
  const [initialPage, setInitialPage] = useState(1);
  const lastSavedPage = useRef(1);

  useEffect(() => {
    if (!bookId) return;

    (async () => {
      try {
        const progress = await getPdfProgress(bookId);
        if (progress?.page) {
          setInitialPage(progress.page);
          lastSavedPage.current = progress.page;
        }
      } catch (error) {
        console.log("PDF PROGRESS LOAD ERROR:", error);
      }
    })();
  }, [bookId]);

  useEffect(() => {
    if (!bookId) return;

    const masterUrl = data?.data?.book?.master;
    if (!masterUrl) return;

    (async () => {
      try {
        const dir = `${FileSystem.documentDirectory}books/`;
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

        const fileUri = `${dir}${bookId}.pdf`;

        const info = await FileSystem.getInfoAsync(fileUri);

        if (!info.exists || (info.size ?? 0) < 1000) {
          await FileSystem.downloadAsync(masterUrl, fileUri);
        }

        setLocalPdfUri(fileUri);
      } catch (err) {
        console.log("PDF DOWNLOAD ERROR:", err);
      }
    })();
  }, [bookId, data?.data?.book?.master]);


  if (isLoading || !bookId || !localPdfUri) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }



  console.log("LOCAL PDF URI SET:", localPdfUri);

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: localPdfUri }}
        page={initialPage}
        onLoadComplete={(pages) => console.log("PDF loaded, pages:", pages)}
        onError={(error) => console.log("PDF RENDER ERROR:", error)}
        onPageChanged={(page, totalPages) => {
          if (page !== lastSavedPage.current) {
            lastSavedPage.current = page;
            savePdfProgress(bookId, page, totalPages);
          }
        }}
        style={{ flex: 1 }}
        androidHardwareAccelerationDisabled
        trustAllCerts={false}
      />
    </View>
  );
};

export default EbookReader;