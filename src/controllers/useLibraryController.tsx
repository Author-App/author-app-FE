import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { useGetAllBooksQuery } from "../redux2/Apis/Books";
import type { LibraryBook } from "../types/library/libraryTypes";
import { FlashList } from '@shopify/flash-list';

type ActiveTabType = 'ebook' | 'audiobook' | '';


const useLibraryController = () => {
    const [activeTab, setActiveTab] = useState<ActiveTabType>('');
    const [search, setSearch] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedSortValue, setSelectedSortValue] = useState<string | null>(null);

    const listRef = useRef<React.ElementRef<typeof FlashList<LibraryBook>> | null>(null);

    // Call API
    const { data, isLoading, isError } = useGetAllBooksQuery({ type: activeTab });

    // const currentData: LibraryBook[] = data?.data?.books ?? [];

    const currentData: LibraryBook[] = useMemo(() => {
        if (!data?.data?.books) return [];

        const books = [...data.data.books];

        if (!selectedSortValue) return books; // 👈 no sort initially

        if (selectedSortValue === 'newest') {
            return books.sort(
                (a, b) =>
                    new Date(b.publishedAt ?? b.createdAt).getTime() -
                    new Date(a.publishedAt ?? a.createdAt).getTime()
            );
        }

        if (selectedSortValue === 'oldest') {
            return books.sort(
                (a, b) =>
                    new Date(a.publishedAt ?? b.createdAt).getTime() -
                    new Date(b.publishedAt ?? a.createdAt).getTime()
            );
        }

        return books;
    }, [data, selectedSortValue]);


    const categoryOptions = [
        { label: 'All', value: '' },
        { label: 'Books', value: 'ebook' },
        { label: 'Audio Books', value: 'audiobook' },
    ];

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
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
        listRef,
    };

}

export default useLibraryController