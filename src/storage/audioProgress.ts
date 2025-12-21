import AsyncStorage from "@react-native-async-storage/async-storage";

interface AudioProgress {
  position: number; // position in milliseconds
}

/**
 * Get saved audio progress for a given bookId
 */
export const getAudioProgress = async (bookId: string): Promise<AudioProgress | null> => {
  try {
    const json = await AsyncStorage.getItem(`audioProgress_${bookId}`);
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.log("Error getting audio progress:", error);
    return null;
  }
};

/**
 * Save current audio position for a given bookId
 */
export const saveAudioProgress = async (bookId: string, position: number) => {
  try {
    const data: AudioProgress = { position };
    await AsyncStorage.setItem(`audioProgress_${bookId}`, JSON.stringify(data));
  } catch (error) {
    console.log("Error saving audio progress:", error);
  }
};
