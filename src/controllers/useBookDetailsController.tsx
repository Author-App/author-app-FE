import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useGetBookDetailQuery, useRateBookMutation } from "../redux2/Apis/Books";
import { useCreateOrderMutation, usePollPaymentStatusQuery } from "../redux2/Apis/Orders";
import { useStripe } from "@stripe/stripe-react-native";

const useBookDetailController = () => {

    const { id } = useLocalSearchParams();
    const { confirmPayment } = useStripe();

    const { data, isLoading, isFetching, error, refetch } = useGetBookDetailQuery(id);

    const [rateBook, { isLoading : rateLoading }] = useRateBookMutation();

    const [modalVisible, setModalVisible] = useState(false);   // review modal
    const [paymentModal, setPaymentModal] = useState(false);   // card modal

    const [orderId, setOrderId] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [startPolling, setStartPolling] = useState(false);

    const [createOrder] = useCreateOrderMutation();

    // Auto Polling
    const { data: paymentResult } = usePollPaymentStatusQuery(orderId, {
        skip: !startPolling || !orderId,
        pollingInterval: startPolling ? 3000 : 0,
    });

    // ---------------------------------------------------------
    // STEP 1: Create Order → Then show card modal
    // ---------------------------------------------------------
    const purchaseBook = async () => {
        try {
            const res = await createOrder({ bookId: id }).unwrap();
            console.log("ORDER CREATED:", res);

            const newOrderId = res?.data?.id;
            const secret = res?.data?.clientSecret;

            if (!newOrderId || !secret) {
                alert("Could not start payment.");
                return;
            }

            setOrderId(newOrderId);
            setClientSecret(secret);

            // 👉 Show card modal so user can enter payment info
            setPaymentModal(true);

        } catch (error) {
            console.log("ORDER ERROR:", error);
            // alert("Error creating order.");
            const errorData = error as { data?: { message?: string } };
            alert(errorData?.data?.message || "Error creating order")
        }
    };

    // ---------------------------------------------------------
    // STEP 2: Confirm payment after card input
    // ---------------------------------------------------------
    const confirmBookPayment = async () => {
        if (!clientSecret) {
            alert("No payment secret available");
            return;
        }
        try {
            const { paymentIntent, error } = await confirmPayment(clientSecret, {
                paymentMethodType: "Card",
            });

            if (error) {
                alert("Payment error: " + error.message);
                return;
            }

            console.log("STRIPE PAYMENT INTENT:", paymentIntent);

            // Close card modal
            setPaymentModal(false);

            // Start polling backend
            setStartPolling(true);

        } catch (e) {
            alert("Payment failed. Try again.");
        }
    };

    // ---------------------------------------------------------
    // STOP polling when backend updates status
    // ---------------------------------------------------------
    useEffect(() => {
        if (!paymentResult) return;

        console.log("📌 PAYMENT STATUS:", paymentResult?.data);

        const status = paymentResult?.data?.status;

        if (status === "succeeded" || status === "paid") {
            alert("Payment successful! Book unlocked.");
            setStartPolling(false);
            refetch();
        }

        if (status === "failed") {
            alert("Payment failed.");
            setStartPolling(false);
        }
    }, [paymentResult]);

    // ---------------------------------------------------------
    // Book data
    // ---------------------------------------------------------
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

    // const handleSubmit = (rating?: number, review?: string) => {
    //     console.log("Rating:", rating, "Review:", review);
    // };

    const handleSubmit = async (rating?: number, review?: string) => {
    try {
        const payload: any = {};

        if (rating !== undefined && rating > 0) {
            payload.rating = rating;
        }

        if (review && review.trim().length > 0) {
            payload.comment = review.trim();
        }

        await rateBook({
            id,
            body: payload,
        }).unwrap();

        alert("Review submitted successfully");
        setModalVisible(false);
        refetch();

    } catch (error: any) {
        console.log("RATE BOOK ERROR:", error);
        alert(error?.data?.message || "Failed to submit review");
    }
};


    return {
        states: {
            loading: isLoading || isFetching,
            book,
            moreBooks,
            ratingStats,
            modalVisible,
            paymentModal,
            rateLoading,
        },
        functions: {
            setModalVisible,
            setPaymentModal,
            purchaseBook,
            confirmBookPayment,
            handleSubmit,
        },
    };
};

export default useBookDetailController;


// import { useLocalSearchParams } from "expo-router";
// import { useEffect, useMemo, useState } from "react";
// import { useGetBookDetailQuery } from "../redux2/Apis/Books";
// import { useCreateOrderMutation, usePollPaymentStatusQuery } from "../redux2/Apis/Orders";
// import { useStripe } from "@stripe/stripe-react-native";

// const useBookDetailController = () => {

//     const { id } = useLocalSearchParams();
//     const { confirmPayment } = useStripe();

//     const { data, isLoading, isFetching, error, refetch } = useGetBookDetailQuery(id);

//     const [modalVisible, setModalVisible] = useState(false);

//     const [paymentModal, setPaymentModal] = useState(false); 

//     const [orderId, setOrderId] = useState(null);
//     const [startPolling, setStartPolling] = useState(false);

//     const [createOrder] = useCreateOrderMutation();

//     // 🔁 Auto polling from RTK
//     const {
//         data: paymentResult,
//         isFetching: isPolling,
//     } = usePollPaymentStatusQuery(orderId, {
//         skip: !startPolling || !orderId,
//         pollingInterval: startPolling ? 3000 : 0,
//     });

//     // ------------------------------------------------------------------
//     // 🎯 Purchase Flow
//     // ------------------------------------------------------------------
//     const purchaseBook = async () => {
//         try {
//             const res = await createOrder({ bookId: id }).unwrap();

//             console.log("ORDER CREATED:", JSON.stringify(res, null, 2));

//             const newOrderId = res?.data?.id;
//             const clientSecret = res?.data?.clientSecret;

//             console.log("THIS IS CLINET SECRET", clientSecret);
            

//             if (!newOrderId || !clientSecret) {
//                 alert("Could not start payment.");
//                 return;
//             }

//             setOrderId(newOrderId);

//             // ⚡ Confirm payment with Stripe
//             const { paymentIntent, error } = await confirmPayment(clientSecret);

//             if (error) {
//                 console.log('THIS IS PAYMNET ERROR', error.message);
                
//                 alert("Payment error: " + error.message);
//                 return;
//             }

//             console.log("STRIPE PAYMENT INTENT:", paymentIntent);

//             // ⏳ Start polling after Stripe payment finishes
//             setStartPolling(true);

//         } catch (error) {
//             alert("Error creating order.");
//         }
//     };

//     // ------------------------------------------------------------------
//     // ⛔ STOP polling when payment updates
//     // ------------------------------------------------------------------
//     useEffect(() => {
//         if (!paymentResult) return;

//         console.log("📌 PAYMENT STATUS:", paymentResult?.data);

//         const status = paymentResult?.data?.status;

//         if (status === "succeeded" || status === "paid") {
//             alert("Payment successful! Book unlocked.");
//             setStartPolling(false);
//             refetch();
//         }

//         if (status === "failed") {
//             alert("Payment failed.");
//             setStartPolling(false);
//         }
//     }, [paymentResult]);

//     // ------------------------------------------------------------------
//     // 📚 Book-related formatting (same as before)
//     // ------------------------------------------------------------------
//     const book = data?.data?.book ?? null;
//     const moreBooks = data?.data?.moreBooks ?? [];
//     const reviews = data?.data?.reviews ?? null;

//     const ratingStats = useMemo(() => {
//         if (!reviews) return null;

//         return {
//             average: reviews.averageRating,
//             total: reviews.totalRating,
//             recommended: reviews.recommeded,
//             breakdown: reviews.ratingsBreakdown,
//             userReviews: reviews.userReviews,
//         };
//     }, [reviews]);

//     const handleSubmit = (rating?: number, review?: string) => {
//         console.log("Rating:", rating);
//         console.log("Review:", review);
//     };

//     return {
//         states: {
//             loading: isLoading || isFetching,
//             error,
//             book,
//             moreBooks,
//             ratingStats,
//             modalVisible,
//             isPolling,
//         },
//         functions: {
//             refetch,
//             setModalVisible,
//             handleSubmit,
//             purchaseBook,
//         },
//     };
// };

// export default useBookDetailController;


// import { useLocalSearchParams } from "expo-router";
// import { useEffect, useMemo, useState } from "react";
// import { useGetBookDetailQuery } from "../redux2/Apis/Books";
// import { useCreateOrderMutation, usePollPaymentStatusQuery } from "../redux2/Apis/Orders";

// const useBookDetailController = () => {

//     const { id } = useLocalSearchParams();

//     const { data, isLoading, isFetching, error, refetch } = useGetBookDetailQuery(id);

//     const [modalVisible, setModalVisible] = useState(false);

//     const [orderId, setOrderId] = useState(null);
//     const [isPolling, setIsPolling] = useState(false);

//     const [createOrder] = useCreateOrderMutation();

//     // 🔁 Polling payment status
//     const { data: paymentResult, refetch: checkPayment } =
//         usePollPaymentStatusQuery(orderId, {
//             skip: !isPolling || !orderId,
//         });


//     // console.log("⏳ POLLING RESPONSE:", paymentResult);

//     // 🔥 Trigger polling every 3 seconds
//     useEffect(() => {
//         if (!isPolling || !orderId) return;

//         const interval = setInterval(() => {
//             checkPayment();
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [isPolling, orderId]);

//     // ⛔ Stop polling when paymentResult updates
//     useEffect(() => {
//         if (!paymentResult) return;

//         if (paymentResult?.status === "success") {
//             setIsPolling(false);
//             alert("Payment successful! Book unlocked.");
//             refetch();
//         }

//         if (paymentResult?.status === "failed") {
//             setIsPolling(false);
//             alert("Payment failed! Try again.");
//         }
//     }, [paymentResult]);

//     const book = data?.data?.book ?? null;
//     const moreBooks = data?.data?.moreBooks ?? [];
//     const reviews = data?.data?.reviews ?? null;

//     const ratingStats = useMemo(() => {
//         if (!reviews) return null;

//         return {
//             average: reviews.averageRating,
//             total: reviews.totalRating,
//             recommended: reviews.recommeded,
//             breakdown: reviews.ratingsBreakdown,
//             userReviews: reviews.userReviews,
//         };
//     }, [reviews]);

//     const handleSubmit = (rating?: number, review?: string) => {
//         console.log('Rating:', rating);
//         console.log('Review:', review);
//         // call your API here
//     };

//     // ---------------------------------------
//     // 🚀 PURCHASE FLOW
//     // ---------------------------------------
//     const purchaseBook = async () => {
//         try {
//             const res = await createOrder({ bookId: id }).unwrap();

//             console.log("THIS IS RES", JSON.stringify(res, null, 2));


//             const newOrderId = res?.data?.id;

//             if (!newOrderId) {
//                 alert("Could not start payment.");
//                 return;
//             }

//             setOrderId(newOrderId);
//             setIsPolling(true);

//             alert("Order created! Waiting for payment confirmation...");
//         } catch (err) {
//             alert("Error creating order.");
//         }
//     };

//     return {
//         states: {
//             loading: isLoading || isFetching,
//             error,
//             book,
//             moreBooks,
//             ratingStats,
//             modalVisible,
//             isPolling,
//         },

//         functions: {
//             refetch,
//             setModalVisible,
//             handleSubmit,
//             purchaseBook, // <-- expose purchase function
//         },
//     };

// };

// export default useBookDetailController;
