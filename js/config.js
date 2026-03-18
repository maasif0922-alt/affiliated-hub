/**
 * AffiliateHub - Configuration File (v1.2.0-firebase)
 * CLEAN VERSION: Static data has been moved to Firebase Realtime Database.
 */

const CONFIG = {
    VERSION: "1.2.0-firebase-sync",
    products: [],
    categories: [],
    blogs: [],
    site_settings: {
        logoText: "Affiliate",
        logoAccent: "Hub",
        heroTitle: "Loading Live Deals...",
        heroDesc: "Connecting to real-time database...",
        primaryColor: "#6366f1"
    },
    loc_settings: {
        currency: "USD",
        language: "en",
        rates: { USD: 1, AED: 3.67, SAR: 3.75, PKR: 280, INR: 83 },
        symbols: { USD: "$", AED: "AED", SAR: "SAR", PKR: "Rs", INR: "₹" }
    },
    platform_filters: {
        amazon: { categories: [], countries: {} },
        aliexpress: { categories: [], countries: {} },
        fiverr: { categories: [], countries: {} },
        direct: { categories: [], countries: {} }
    }
};
