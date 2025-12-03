import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { useGetBookDetailQuery } from "../redux2/Apis/Books";

const useBookDetailController = () => {

    const { id } = useLocalSearchParams();

    const { data, isLoading, isFetching, error, refetch } = useGetBookDetailQuery(id);

    const [modalVisible, setModalVisible] = useState(false);

    const book = data?.data?.book ?? null;
    const moreBooks = data?.data?.moreBooks ?? [];
    const reviews = data?.data?.reviews ?? null;

    const ratingStats = useMemo(() => {
        if (!reviews) return null;

        return {
            average: reviews.averageRating,
            total: reviews.totalRating,
            recommended: reviews.recommeded,
            breakdown: reviews.ratingsBreakdown,
            userReviews: reviews.userReviews,
        };
    }, [reviews]);

    const handleSubmit = (rating?: number, review?: string) => {
        console.log('Rating:', rating);
        console.log('Review:', review);
        // call your API here
    };

    return {
        states: {
            loading: isLoading || isFetching,
            error,
            book,
            moreBooks,
            ratingStats,
            modalVisible,
        },
        functions: { 
            refetch, 
            setModalVisible , 
            handleSubmit},
    };

};

export default useBookDetailController;
