import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { forgotPasswordFormValidator } from "@/src/utils/validator";
import { audiobooksData, booksData } from "../data/libraryData";
import { Dimensions } from "react-native";


const useLibraryController = () => {
    const [activeTab, setActiveTab] = useState<'Books' | 'Audiobooks'>('Books');
    const [search, setSearch] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedSortValue, setSelectedSortValue] = useState<string | null>(null);

    const currentData = activeTab === 'Books' ? booksData : audiobooksData;
    const categoryOptions = [
        { label: 'Books', value: 'books' },
        { label: 'Audio Books', value: 'audioBooks' },
    ];

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
        // { label: 'Ascending', value: 'ascending' },
        // { label: 'Descending', value: 'descending' },
    ];

    const router = useRouter();

    const screenWidth = Dimensions.get('window').width;

    const numColumns = useMemo(() => {
        if (screenWidth > 900) return 4; // tablets/large screens
        if (screenWidth > 600) return 3; // medium screens
        return 2; // small screens (phones)
    }, [screenWidth]);

    return {
        router,
        currentData,
        categoryOptions,
        sortOptions,
        activeTab,
        setActiveTab,
        selectedValue,
        setSelectedValue,
        selectedSortValue,
        setSelectedSortValue,
        numColumns,
    };

}

export default useLibraryController