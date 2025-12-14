import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { forgotPasswordFormValidator } from "@/src/utils/validator";
import { audiobooksData, booksData } from "../data/libraryData";
import { Dimensions } from "react-native";
import { useGetAllBooksQuery } from "../redux2/Apis/Books";


const useLibraryController = () => {
    const [activeTab, setActiveTab] = useState<'ebook' | 'audiobook' | ''>('');
    const [search, setSearch] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedSortValue, setSelectedSortValue] = useState<string | null>(null);

    // const currentData = activeTab === 'Books' ? booksData : audiobooksData;

    // Convert tab to param
    // const type = activeTab;

    // Call API
    const { data, isLoading, isError } = useGetAllBooksQuery({ type: activeTab });

    const currentData = data?.data?.books ?? [];
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
        isLoading,
        isError
        // router,
        // currentData,
        // categoryOptions,
        // sortOptions,
        // activeTab,
        // setActiveTab,
        // selectedValue,
        // setSelectedValue,
        // selectedSortValue,
        // setSelectedSortValue,
        // numColumns,
    };

}

export default useLibraryController