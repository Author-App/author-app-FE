import { View, useWindowDimensions } from "react-native";
import Pdf from "react-native-pdf";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getPdfProgress, savePdfProgress } from "@/src/storage/bookProgress";


const EbookReader = () => {
  const { bookId, bookUrl } = useLocalSearchParams<{
    bookId: string;
    bookUrl: string;
  }>();

  console.log("THIS IS BOOK ID AND BOOKURL", bookId , bookUrl);
  

  const { width, height } = useWindowDimensions();
  const lastSavedPage = useRef(0);
  const [initialPage, setInitialPage] = useState<number>(1);

  // 🔹 Load saved page
  useEffect(() => {
    (async () => {
      const progress = await getPdfProgress(bookId);
      if (progress?.page) {
        setInitialPage(progress.page);
        lastSavedPage.current = progress.page;
      }
    })();
  }, [bookId]);

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: bookUrl, cache: true }}
        page={initialPage}
        onPageChanged={(page, totalPages) => {
          // 🔹 throttle saves
          if (Math.abs(page - lastSavedPage.current) < 1) return;

          lastSavedPage.current = page;

          savePdfProgress(bookId, page, totalPages);
        }}
        style={{ width, height }}
      />
    </View>
  );
};

export default EbookReader;


// import { useWindowDimensions } from "react-native";
// import { Reader, ReaderProvider } from "@epubjs-react-native/core";
// import { useLocalSearchParams } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import { useFileSystem } from "@epubjs-react-native/expo-file-system";
// // import {
// //   getBookProgress,
// //   saveBookProgress,
// // } from "@/src/storage/bookProgress";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// const PREFIX = "BOOK_PROGRESS_";

// export const getBookProgress = async (bookId: string) => {
//     const data = await AsyncStorage.getItem(`${PREFIX}${bookId}`);
//     return data ? JSON.parse(data) : null;
// };

// export const saveBookProgress = async (
//     bookId: string,
//     location: string,
//     percentage: number
// ) => {
//     await AsyncStorage.setItem(
//         `${PREFIX}${bookId}`,
//         JSON.stringify({
//             location,
//             percentage,
//             updatedAt: Date.now(),
//         })
//     );
// };


// const EbookReader = () => {
//     const { bookId, bookUrl } = useLocalSearchParams<{
//         bookId: string;
//         bookUrl: string;
//     }>();

//     const { width, height } = useWindowDimensions();

//     const [initialLocation, setInitialLocation] = useState<string | undefined>();
//     const lastSavedPercentage = useRef(0);

//     // 🔹 Load saved progress (LOCAL ONLY)
//     useEffect(() => {
//         (async () => {
//             const progress = await getBookProgress(bookId);
//             if (progress?.location) {
//                 setInitialLocation(progress.location);
//                 lastSavedPercentage.current = progress.percentage ?? 0;
//             }
//         })();
//     }, [bookId]);

//     return (
//         <ReaderProvider>
//             <Reader
//                 src={bookUrl}               // ✅ real book file
//                 width={width}
//                 height={height}
//                 fileSystem={useFileSystem}
//                 initialLocation={initialLocation}
//                 onLocationChange={(location) => {
//                     if (!location?.percentage) return;

//                     const percentage = Math.round(location.percentage * 100);

//                     // 🔹 avoid saving too frequently
//                     if (Math.abs(percentage - lastSavedPercentage.current) < 2) return;

//                     lastSavedPercentage.current = percentage;

//                     saveBookProgress(
//                         bookId,
//                         location.start.cfi,
//                         percentage
//                     );
//                 }}
//             />
//         </ReaderProvider>
//     );
// };

// export default EbookReader;


// import { useWindowDimensions } from 'react-native';
// import { Reader, ReaderProvider } from '@epubjs-react-native/core';
// import { useLocalSearchParams } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { useFileSystem } from '@epubjs-react-native/expo-file-system';

// const EbookReader = () => {
//   const { bookId } = useLocalSearchParams();
//   const { width, height } = useWindowDimensions();

//   const [lastLocation, setLastLocation] = useState<string | null>(null);

//   // 🔹 Fetch last read location from backend
//   useEffect(() => {
//     fetchLastProgress();
//   }, []);

//   const fetchLastProgress = async () => {
//     const res = await api.get(`/books/${bookId}/progress`);
//     setLastLocation(res.data?.location || null);
//   };

//   const saveProgress = async (location: string, percentage: number) => {
//     await api.post(`/books/${bookId}/progress`, {
//       location,
//       percentage,
//     });
//   };

//   return (
//     <ReaderProvider>
//       <Reader
//         src={`https://your-cdn.com/books/${bookId}.epub`}
//         width={width}
//         height={height}
//         initialLocation={lastLocation || undefined}
//         onLocationChange={(location) => {
//           // EPUB CFI (exact location)
//           const percentage = Math.round(location.percentage * 100);
//           saveProgress(location.start.cfi, percentage);
//         }}
//         fileSystem={useFileSystem}
//       />
//     </ReaderProvider>
//   );
// };

// export default EbookReader;
