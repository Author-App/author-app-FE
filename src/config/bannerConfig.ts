import IconPlay from "@/assets/icons/iconPlay";
import assets from "@/assets/images";

export const bannerConfig = {
    book: {
        image: assets.images.bookbanner,
        eyebrow: "New Book Release",
        title: "Read the Best Stories",
        subtitle: "Top authors of the month",
        ctaLabel: "Read Now",
        badge: "New",
        progress: 0.3,
        tint: 'systemThinMaterialDark',
        icon: IconPlay,
        blurViewIntensity: 70,
    },
    audiobook: {
        image: assets.images.audiobookbanner,
        eyebrow: "New Audiobook",
        title: "The Great Story",
        subtitle: "By John Doe",
        ctaLabel: "Listen Now",
        badge: "Free",
        progress: 0.6,
        tint: 'systemUltraThinMaterial',
        icon: IconPlay,
        blurViewIntensity: 90,
    },
    promo: {
        image: assets.images.promo,
        eyebrow: "Special Offer",
        title: "50% off all subscriptions",
        subtitle: "Limited time offer",
        ctaLabel: "Get Offer",
        badge: "Limited",
        progress: undefined,
        tint: 'systemUltraThinMaterial',
        icon: IconPlay,
        blurViewIntensity: 50,
    },
    event: {
        image: assets.images.event,
        eyebrow: "Don’t Miss Out",
        title: "Upcoming Events",
        subtitle: "Mark your calendar",
        ctaLabel: "Register",
        badge: "Upcoming",
        progress: undefined,
        tint: 'systemUltraThinMaterial',
        icon: IconPlay,
        blurViewIntensity: 50,
    },
} as const;

export type BannerType = keyof typeof bannerConfig;


