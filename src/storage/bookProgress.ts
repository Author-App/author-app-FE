import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "BOOK_PDF_PROGRESS_";

export const getPdfProgress = async (bookId: string) => {
  const data = await AsyncStorage.getItem(`${PREFIX}${bookId}`);
  return data ? JSON.parse(data) : null;
};

export const savePdfProgress = async (
  bookId: string,
  page: number,
  totalPages: number
) => {
  const percentage = Math.round((page / totalPages) * 100);

  await AsyncStorage.setItem(
    `${PREFIX}${bookId}`,
    JSON.stringify({
      page,
      totalPages,
      percentage,
      updatedAt: Date.now(),
    })
  );
};
