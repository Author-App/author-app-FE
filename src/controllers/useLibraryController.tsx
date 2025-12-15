import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Dimensions } from "react-native";
import { useGetAllBooksQuery } from "../redux2/Apis/Books";
import type { LibraryBook } from "../types/library/libraryTypes";

type ActiveTabType = 'ebook' | 'audiobook' | '';

const useLibraryController = () => {
    const [activeTab, setActiveTab] = useState<ActiveTabType>('');
    const [search, setSearch] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedSortValue, setSelectedSortValue] = useState<string | null>(null);

    // Call API
    const { data, isLoading, isError } = useGetAllBooksQuery({ type: activeTab });

    const currentData: LibraryBook[] = data?.data?.books ?? [];
    const categoryOptions = [
        { label: 'All', value: '' },
        { label: 'Books', value: 'ebook' },
        { label: 'Audio Books', value: 'audiobook' },
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

    // Type-safe setter for activeTab from dropdown string value
    const handleSetActiveTab = useCallback((value: string) => {
        if (value === 'ebook' || value === 'audiobook' || value === '') {
            setActiveTab(value);
        }
    }, []);

    return {

        router,
        currentData,
        categoryOptions,
        sortOptions,
        activeTab,
        setActiveTab: handleSetActiveTab,
        selectedValue,
        setSelectedValue,
        selectedSortValue,
        setSelectedSortValue,
        numColumns,
        isLoading,
        isError,
    };

}

export default useLibraryController