/**
 * Main Application Logic
 * Handles common UI components, data management, and tracking
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log('Affiliate Website Initialized');
    trackPageView(); // Analytics
    renderNavbar();
    renderFooter();
    handleSearch();
    loadSampleData();
    initFirebase();
    applySiteSettings();
    updateCartBadge();
    initScrollReveal();
}

// --- Firebase Cloud Sync ---
let db;
// Firebase Configuration Utility
function getFirebaseConfig() {
    const defaults = {
        apiKey: "user-to-provide",
        authDomain: "user-to-provide",
        databaseURL: "https://affiliated-hub-default-rtdb.firebaseio.com",
        projectId: "affiliated-hub",
        storageBucket: "affiliated-hub.appspot.com",
        messagingSenderId: "user-to-provide",
        appId: "user-to-provide"
    };
    return JSON.parse(localStorage.getItem('cloud_config') || JSON.stringify(defaults));
}

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn("Firebase SDK not loaded");
        return;
    }
    const config = getFirebaseConfig();
    try {
        // Only initialize if config is valid (not placeholder)
        if (config.apiKey === 'user-to-provide') {
             console.log("Cloud sync is ready but requires Firebase configuration in Admin Dashboard.");
             return;
        }
        firebase.initializeApp(config);
        db = firebase.database();
        console.log("Firebase initialized successfully");
        syncWithCloud();
    } catch (e) {
        console.warn("Firebase initialization error:", e);
    }
}


function syncWithCloud() {
    if (!db) return;
    console.log("Real-time cloud sync active...");
    
    // Sync Products
    db.ref('products').on('value', (snapshot) => {
        const cloudProducts = snapshot.val();
        if (cloudProducts) {
            const productsArray = Array.isArray(cloudProducts) ? cloudProducts : Object.values(cloudProducts);
            localStorage.setItem('products', JSON.stringify(productsArray));
            console.log("Synced " + productsArray.length + " products from cloud");
            
            // Re-render relevant UI components if they exist on the page
            updatePageUI();
        }
    });

    // Sync Site Settings
    db.ref('site_settings').on('value', (snapshot) => {
        const cloudSettings = snapshot.val();
        if (cloudSettings) {
             const localSettings = JSON.parse(localStorage.getItem('site_settings') || '{}');
             if (JSON.stringify(cloudSettings) !== JSON.stringify(localSettings)) {
                 localStorage.setItem('site_settings', JSON.stringify(cloudSettings));
                 console.log("Site settings updated from cloud");
                 applySiteSettings();
             }
        }
    });

    // Sync Blogs
    db.ref('blogs').on('value', (snapshot) => {
        const cloudBlogs = snapshot.val();
        if (cloudBlogs) {
             const localBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
             if (JSON.stringify(cloudBlogs) !== JSON.stringify(localBlogs)) {
                 localStorage.setItem('blogs', JSON.stringify(cloudBlogs));
                 console.log("Blogs updated from cloud");
                 if (typeof renderBlogs === 'function') renderBlogs();
                 if (typeof renderAdminBlogList === 'function') renderAdminBlogList();
             }
        }
    });

    // Sync Categories
    db.ref('categories').on('value', (snapshot) => {
        const cloudCats = snapshot.val();
        if (cloudCats) {
            localStorage.setItem('categories', JSON.stringify(cloudCats));
            console.log("Categories updated from cloud");
            renderNavbar(); // Navbar often contains category links
        }
    });
}

function updatePageUI() {
    // Check for common grid IDs and re-render them
    const sectionRenders = {
        'store-products': () => renderPlatformProducts('direct', 'store-products', 4),
        'trending-products': () => renderPlatformProducts('trending', 'trending-products', 4),
        'amazon-products': () => renderPlatformProducts('amazon', 'amazon-products', 4),
        'aliexpress-products': () => renderPlatformProducts('aliexpress', 'aliexpress-products', 4),
        'fiverr-products': () => renderPlatformProducts('fiverr', 'fiverr-products', 4),
        'flash-products': () => {
            // Re-render flash sale products
            const allProds = JSON.parse(localStorage.getItem('products') || '[]');
            const flashProds = allProds.filter(p => p.deal || p.oldPrice).slice(0, 10);
            const flashContainer = document.getElementById('flash-products');
            if (flashContainer) {
                if (flashProds.length === 0) {
                    flashContainer.innerHTML = '<p style="color:#94a3b8;padding:1rem;">No flash deals right now — check back soon!</p>';
                } else {
                    const loc = getLocalizationSettings();
                    const rate = loc.rates[loc.currency] || 1;
                    const sym  = loc.symbols[loc.currency] || '$';
                    flashContainer.innerHTML = '';
                    flashProds.forEach(p => {
                        const cleanNum = str => parseFloat((str || '').replace(/[^0-9.]/g,'')) || 0;
                        const cur = cleanNum(p.price);
                        const old = cleanNum(p.oldPrice);
                        const disc = old > cur ? Math.round((old - cur) / old * 100) : 0;
                        const card = document.createElement('div');
                        card.className = 'flash-card';
                        card.innerHTML = `
                            <div class="flash-img">
                                <img src="${p.image}" alt="${p.title}">
                                ${disc > 0 ? `<span class="flash-disc">-${disc}%</span>` : ''}
                                <button class="share-btn-mini" onclick="shareProduct('${p.id}', '${p.title.replace(/'/g, "\\'")}')" title="Share Product" style="position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;">
                                    <i data-lucide="share-2" style="width: 14px;"></i>
                                </button>
                            </div>
                            <a href="product-detail.html?id=${p.id}" style="text-decoration: none; color: inherit;">
                                <div class="flash-info">
                                    <div class="ftitle">${p.title}</div>
                                    <div class="fprice">${sym} ${(cur * rate).toFixed(2)}</div>
                                    ${old > 0 ? `<div class="foldprice">${sym} ${(old * rate).toFixed(2)}</div>` : ''}
                                </div>
                            </a>`;
                        flashContainer.appendChild(card);
                    });
                }
            }
        },
        'dropshipping-grid': () => {
             const country = document.getElementById('country-filter')?.value || 'all';
             const category = document.getElementById('category-filter')?.value || 'all';
             renderPlatformProducts('direct', 'dropshipping-grid', null, { country, category });
        },
        'store-all-products': () => renderPlatformProducts('direct', 'store-all-products'),
        'amazon-all-products': () => renderPlatformProducts('amazon', 'amazon-all-products'),
        'aliexpress-all-products': () => renderPlatformProducts('aliexpress', 'aliexpress-all-products'),
        'fiverr-all-products': () => renderPlatformProducts('fiverr', 'fiverr-all-products')
    };

    for (const [id, renderFunc] of Object.entries(sectionRenders)) {
        if (document.getElementById(id)) {
            renderFunc();
        }
    }

    // Refresh Lucide icons if applicable
    if (window.lucide) lucide.createIcons();
    
    // Update counter if on index
    if (document.getElementById('counter-p')) {
        const prods = JSON.parse(localStorage.getItem('products') || '[]');
        document.getElementById('counter-p').innerHTML = prods.length + '<s2>+</s2>';
    }
}


function pushToCloud(path, data) {
    if (db) {
        db.ref(path).set(data)
          .then(() => console.log("Cloud sync successful: " + path))
          .catch((err) => console.error("Cloud sync failed: ", err));
    }
}



// --- Analytics & Tracking ---

function trackPageView() {
    const today = new Date().toISOString().split('T')[0];
    let dailyStats = JSON.parse(localStorage.getItem('daily_visitors') || '{}');
    dailyStats[today] = (dailyStats[today] || 0) + 1;
    localStorage.setItem('daily_visitors', JSON.stringify(dailyStats));
    
    // Total visitors
    let total = parseInt(localStorage.getItem('total_visitors') || '0');
    localStorage.setItem('total_visitors', (total + 1).toString());
}

function getAnalyticsData() {
    return {
        totalVisitors: localStorage.getItem('total_visitors') || 0,
        dailyVisitors: JSON.parse(localStorage.getItem('daily_visitors') || '{}'),
        clickStats: JSON.parse(localStorage.getItem('click_stats') || '{}'),
        orderStats: JSON.parse(localStorage.getItem('orders') || '[]').length,
        userStats: JSON.parse(localStorage.getItem('users') || '[]').length
    };
}

// --- Site Settings Logic ---

function applySiteSettings() {
    const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
    if (!settings.logoText) {
        // Default settings
        const defaults = {
            logoText: 'Affiliate',
            logoAccent: 'Hub',
            heroTitle: 'Elevate Your Shopping with Expert Picks',
            heroDesc: "We source the best deals from Amazon, trendy products from AliExpress, and premium services from Fiverr. All in one beautifully curated hub.",
            primaryColor: '#6366f1'
        };
        localStorage.setItem('site_settings', JSON.stringify(defaults));
        return applySiteSettings();
    }

    // Apply Logo
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.innerHTML = `<span class="logo-accent">${settings.logoText}</span>${settings.logoAccent}`;
    });

    // Apply Hero (if on index page)
    const h1 = document.querySelector('.hero h1');
    const p = document.querySelector('.hero p');
    if (h1) h1.innerText = settings.heroTitle;
    if (p) p.innerText = settings.heroDesc;

    // Apply Primary Color
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    // Apply Language (Translations)
    applyTranslations();
}

// --- Localization (Currency & Language) ---

const TRANSLATIONS = {
    en: {
        home: "Home",
        amazon: "Amazon",
        aliexpress: "AliExpress",
        fiverr: "Fiverr",
        store: "Store",
        search: "Search...",
        login: "Login",
        welcome: "Welcome",
        buy_now: "Buy Now",
        add_to_cart: "Add to Store Cart"
    },
    ur: {
        home: "ہوم",
        amazon: "ایمیزون",
        aliexpress: "علی ایکسپریس",
        fiverr: "فائور",
        store: "اسٹور",
        search: "تلاش کریں...",
        login: "لاگ ان",
        welcome: "خوش آمدید",
        buy_now: "ابھی خریدیں",
        add_to_cart: "کارٹ میں شامل کریں"
    }
};

function getLocalizationSettings() {
    const defaults = {
        currency: 'USD',
        language: 'en',
        rates: { USD: 1, AED: 3.67, SAR: 3.75, PKR: 280, INR: 83 },
        symbols: { USD: '$', AED: 'AED', SAR: 'SAR', PKR: 'Rs', INR: '₹' }
    };
    const settings = JSON.parse(localStorage.getItem('loc_settings') || 'null');
    if (!settings) {
        localStorage.setItem('loc_settings', JSON.stringify(defaults));
        return defaults;
    }
    
    // Migration: Update old script symbols to English if found
    let needsUpdate = false;
    if (settings.symbols.AED === 'د.إ') { settings.symbols.AED = 'AED'; needsUpdate = true; }
    if (settings.symbols.SAR === 'ر.س') { settings.symbols.SAR = 'SAR'; needsUpdate = true; }
    
    if (needsUpdate) {
        localStorage.setItem('loc_settings', JSON.stringify(settings));
    }

    return settings;
}

function setCurrency(cur) {
    const settings = getLocalizationSettings();
    settings.currency = cur;
    localStorage.setItem('loc_settings', JSON.stringify(settings));
    window.location.reload(); // Refresh to apply to all prices
}

function setLanguage(lang) {
    const settings = getLocalizationSettings();
    settings.language = lang;
    localStorage.setItem('loc_settings', JSON.stringify(settings));
    window.location.reload();
}

function formatPrice(priceString) {
    const numericValue = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
    return formatPriceRaw(numericValue);
}

function formatPriceRaw(numericValue) {
    const settings = getLocalizationSettings();
    const rate = settings.rates[settings.currency] || 1;
    const symbol = settings.symbols[settings.currency] || '$';
    const converted = numericValue * rate;
    return `${symbol} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function applyTranslations() {
    const settings = getLocalizationSettings();
    const lang = settings.language;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    
    // Apply basic UI translations if they exist
    const elements = {
        'nav-amazon': t.amazon,
        'nav-aliexpress': t.aliexpress,
        'nav-fiverr': t.fiverr,
        'nav-store': t.store,
        'btn-login-text': t.login,
        'search-placeholder': t.search
    };

    for (const [id, text] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'INPUT') el.placeholder = text;
            else el.innerText = text;
        }
    }
}

// --- Component Rendering ---

function renderNavbar() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const user = getCurrentUser();
    const authBtn = user ? `
        <div class="user-profile-nav" style="display: flex; align-items: center; gap: 0.5rem;">
            <button onclick="logoutUser()" class="btn-logout" title="Logout" style="width: 32px; height: 32px;">
                <i data-lucide="log-out" style="width: 14px;"></i>
            </button>
        </div>
    ` : `
        <a href="login.html" class="btn-login" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
            <i data-lucide="user" style="width: 14px;"></i> Login
        </a>
    `;

    const categories = JSON.parse(localStorage.getItem('categories') || '["Electronics", "Smart Home", "Digital Marketing", "Logo Design", "Gadgets", "Video Editing"]');
    const categoryOptions = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    const loc = getLocalizationSettings();
    const curOptions = Object.keys(loc.rates).map(c => `<option value="${c}" ${loc.currency === c ? 'selected' : ''}>${c}</option>`).join('');
    const langOptions = `<option value="en" ${loc.language === 'en' ? 'selected' : ''}>EN</option>
                         <option value="ur" ${loc.language === 'ur' ? 'selected' : ''}>UR</option>`;

    nav.className = 'glass sticky-nav';
    nav.innerHTML = `
        <div class="container nav-content">
            <div class="nav-row-top" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <a href="index.html" class="logo">
                    <span class="logo-accent">Affiliate</span>Hub
                </a>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="cart-nav-trigger" onclick="location.href='checkout.html'" style="width: 32px; height: 32px;">
                        <i data-lucide="shopping-bag" style="width: 18px;"></i>
                        <span class="cart-count">0</span>
                    </div>
                    ${authBtn}
                </div>
            </div>
            
            <div class="search-container" style="width: 100%;">
                <select id="search-category" style="background: transparent; border: none; border-right: 1px solid var(--border-color); padding-right: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); outline: none; cursor: pointer; max-width: 80px;">
                    <option value="all">All</option>
                    ${categoryOptions}
                </select>
                <input type="text" id="global-search" placeholder="Search..." id="search-placeholder">
                <button id="search-trigger" style="color: var(--primary-color)">
                    <i data-lucide="search" style="width: 18px;"></i>
                </button>
            </div>

            <div class="nav-bottom-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 1rem;">
                <!-- Desktop Links (auto-hidden on mobile by CSS) -->
                <ul class="nav-main-links" style="margin: 0;">
                    <li><a href="amazon.html" id="nav-amazon">Amazon</a></li>
                    <li><a href="aliexpress.html" id="nav-aliexpress">AliExpress</a></li>
                    <li><a href="fiverr.html" id="nav-fiverr">Fiverr</a></li>
                    <li><a href="dropshipping.html" id="nav-store" style="color: var(--primary-color)">Store</a></li>
                    <li><a href="#blog-section" id="nav-blog">Blog</a></li>
                </ul>

                <!-- Mobile Platform Dropdown -->
                <div class="mobile-nav-wrapper" style="position: relative;">
                    <button class="mobile-dropdown-trigger pulse-blue" onclick="togglePlatformMenu(event)">
                        <i data-lucide="layers"></i>
                        <span>Platforms</span>
                        <i data-lucide="chevron-down" style="width: 10px; margin-left: auto;"></i>
                    </button>
                    <div id="mobile-platform-menu" class="mobile-dropdown-menu">
                        <a href="amazon.html"><i data-lucide="shopping-cart"></i> Amazon</a>
                        <a href="aliexpress.html"><i data-lucide="globe"></i> AliExpress</a>
                        <a href="fiverr.html"><i data-lucide="briefcase"></i> Fiverr</a>
                        <a href="dropshipping.html" style="color: var(--primary-color)"><i data-lucide="store"></i> My Store</a>
                        <a href="#blog-section"><i data-lucide="book-open"></i> Blog</a>
                    </div>
                </div>
                
                <div class="loc-selectors" style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                    <select onchange="setCurrency(this.value)" style="background: rgba(0,0,0,0.05); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 5px; font-size: 0.7rem; cursor: pointer;">
                        ${curOptions}
                    </select>
                    <select onchange="setLanguage(this.value)" style="background: rgba(0,0,0,0.05); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 5px; font-size: 0.7rem; cursor: pointer;">
                        ${langOptions}
                    </select>
                </div>
            </div>
        </div>
    `;
    
    if (window.lucide) lucide.createIcons();
    updateCartBadge();
}

function renderFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-info">
                    <h3 class="logo"><span class="logo-accent">Affiliate</span>Hub</h3>
                    <p>Providing the best deals and top-rated services from Amazon, AliExpress, and Fiverr in one place. Your trusted partner for affiliate recommendations.</p>
                </div>
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="amazon.html">Amazon Deals</a></li>
                        <li><a href="aliexpress.html">AliExpress Finds</a></li>
                        <li><a href="fiverr.html">Fiverr Services</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="footer-categories">
                    <h4>Top Categories</h4>
                    <ul>
                        <li><a href="#">Electronics</a></li>
                        <li><a href="#">Fashion</a></li>
                        <li><a href="#">Digital Services</a></li>
                        <li><a href="#">SEO & Marketing</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 AffiliateHub. All Rights Reserved.</p>
            </div>
        </div>
    `;
}

// --- Functional Features ---

function handleSearch() {
    const input = document.getElementById('global-search');
    const categorySelect = document.getElementById('search-category');
    const trigger = document.getElementById('search-trigger');
    
    if (!input || !categorySelect) return;

    const performSearch = () => {
        const query = input.value.toLowerCase().trim();
        const category = categorySelect.value;
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Instant filtering for the main grids if they exist
        const gridIds = ['store-products', 'trending-products', 'amazon-products', 'aliexpress-products', 'fiverr-products'];
        gridIds.forEach(id => {
            const grid = document.getElementById(id);
            if (!grid) return;
            
            const platformSuffix = id.replace('-products', '');
            const filtered = products.filter(p => {
                const matchesQuery = p.title.toLowerCase().includes(query) || p.platform.includes(query);
                const matchesCategory = category === 'all' || 
                                       (p.category && p.category.toLowerCase() === category.toLowerCase()) || 
                                       p.title.toLowerCase().includes(category.toLowerCase());
                
                let matchesPlatform = true;
                if (platformSuffix === 'store') matchesPlatform = (p.platform === 'direct');
                else if (platformSuffix === 'trending') matchesPlatform = true; // Trending shows all
                else matchesPlatform = (p.platform === platformSuffix);

                return matchesPlatform && matchesQuery && matchesCategory;
            });

            // Re-render
            grid.innerHTML = '';
            if (filtered.length === 0) {
                grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No matches found.</p>`;
            } else {
                filtered.forEach(p => grid.appendChild(createProductCard(p)));
            }
        });
        
        if (window.lucide) lucide.createIcons();
    };

    input.addEventListener('input', performSearch);
    categorySelect.addEventListener('change', performSearch);
    if (trigger) trigger.addEventListener('click', performSearch);
}

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}
function trackClick(productId, url) {
    let stats = JSON.parse(localStorage.getItem('click_stats') || '{}');
    stats[productId] = (stats[productId] || 0) + 1;
    localStorage.setItem('click_stats', JSON.stringify(stats));
    
    // Log for admin dashboard
    let history = JSON.parse(localStorage.getItem('click_history') || '[]');
    history.push({
        id: productId,
        timestamp: new Date().toISOString(),
        url: url
    });
    localStorage.setItem('click_history', JSON.stringify(history));
}

// --- User Authentication & Session Management ---

function registerUser(userData) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered.' };
    }
    const newUser = {
        id: 'USR-' + Date.now(),
        ...userData,
        registeredAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true };
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    location.href = 'index.html';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function requireAuth() {
    if (!getCurrentUser()) {
        const toast = document.createElement('div');
        toast.className = 'glass';
        toast.style.cssText = `
            position: fixed; top: 2rem; left: 50%; transform: translateX(-50%);
            padding: 1rem 2rem; border-radius: var(--radius-lg); z-index: 10000;
            background: #1e293b; color: white; box-shadow: var(--shadow-xl);
            display: flex; gap: 1rem; align-items: center; border: 1px solid #ef4444;
        `;
        toast.innerHTML = `<i data-lucide="alert-circle" style="color: #ef4444"></i> Please login to continue. <a href="login.html" style="color: var(--primary-color); font-weight: 800;">Login Now</a>`;
        document.body.appendChild(toast);
        if (window.lucide) lucide.createIcons();
        setTimeout(() => toast.remove(), 4000);
        return false;
    }
    return true;
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function addToCart(productId) {
    if (!requireAuth()) return;
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Smooth Feedback Toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem; 
        background: #1e293b; color: white; padding: 1rem 2rem; 
        border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);
        z-index: 9999; animation: slideIn 0.3s ease; font-weight: 600;
        display: flex; align-items: center; gap: 1rem;
    `;
    toast.innerHTML = `<i data-lucide="check-circle" style="color: #4ade80"></i> Item added to your store cart!`;
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function submitOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
        id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toISOString(),
        status: 'Pending',
        ...orderData
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart after successful order
    localStorage.removeItem('cart');
    updateCartBadge();
    return newOrder.id;
}

// --- Blog System Logic ---

function renderBlogs(limit = null) {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    if (blogs.length === 0) {
        // Sample Blog Post
        const sample = [{
            id: 'blog-1',
            title: 'How to Choose the Best Tech Deals',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
            excerpt: 'Finding the right balance between price and quality is an art. Here is how we do it...',
            link: '#',
            date: new Date().toISOString()
        }];
        localStorage.setItem('blogs', JSON.stringify(sample));
        return renderBlogs(limit);
    }

    const displayBlogs = limit ? blogs.slice(0, limit) : blogs;
    grid.innerHTML = '';
    displayBlogs.forEach(blog => {
        grid.appendChild(createBlogCard(blog));
    });
    if (window.lucide) lucide.createIcons();
}

function createBlogCard(blog) {
    const div = document.createElement('div');
    div.className = 'blog-card animate-fade-in';
    div.innerHTML = `
        <div class="blog-card-image">
            <img src="${blog.image}" alt="${blog.title}">
        </div>
        <div class="blog-card-content">
            <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
            <h3 class="blog-title">${blog.title}</h3>
            <p class="blog-excerpt">${blog.excerpt}</p>
            <a href="${blog.link}" class="btn-text">Read More <i data-lucide="arrow-right" style="width: 14px;"></i></a>
        </div>
    `;
    return div;
}

// --- Universal Rendering Engine ---

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'card animate-fade-in';
    
    const platformBadgeClass = `badge-${product.platform}`;
    const ctaText = product.platform === 'fiverr' ? 'Hire on Fiverr' : `Buy on ${product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}`;
    const platformUrl = product.platform === 'fiverr' ? product.link : (product.platform === 'direct' ? 'javascript:void(0)' : product.link);
    const onclickAction = product.platform === 'direct' ? `addToCart('${product.id}')` : `trackClick('${product.id}', '${product.link}')`;
    
    const isDirect = product.platform === 'direct';
    const finalCtaText = isDirect ? 'Add to Store Cart' : ctaText;

    // Simplified & Deterministic Badge Logic
    let discountHtml = '';
    let discountPct = 0;
    if (product.oldPrice && product.price) {
        // More robust price parsing handles commas and currency symbols
        const cleanPrice = (str) => parseFloat(str.replace(/,/g, '').match(/[\d.]+/));
        const current = cleanPrice(product.price);
        const old = cleanPrice(product.oldPrice);
        
        if (!isNaN(current) && !isNaN(old) && old > current) {
            discountPct = Math.round(((old - current) / old) * 100);
            discountHtml = `<span class="discount-badge-standalone">-${discountPct}%</span>`;
        }
    }

    // Determine badge type and style
    let badgeHtml = '';
    const isDeal = discountPct > 0 || product.deal;
    
    if (discountPct > 0) {
        badgeHtml = `<span class="badge-hot blinking badge-deal">DEAL</span>`;
    } else if (product.deal) {
        badgeHtml = `<span class="badge-hot blinking badge-deal">HOT DEAL</span>`;
    } else if (product.featured) {
        badgeHtml = `<span class="badge-hot">FEATURED</span>`;
    }
    const oldPriceHtml = discountPct > 0 ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : '';

    div.innerHTML = `
        <div class="card-badges">
            ${discountHtml}
            ${badgeHtml}
        </div>
        <button class="share-btn-mini" onclick="shareProduct('${product.id}', '${product.title.replace(/'/g, "\\'")}')" title="Share Product">
            <i data-lucide="share-2" style="width: 16px;"></i>
        </button>
        <a href="product-detail.html?id=${product.id}" class="card-image">
            <img src="${product.image}" alt="${product.title}">
        </a>
        <div class="card-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                 <span class="platform-badge ${platformBadgeClass}">${product.platform}</span>
                 ${product.deal ? '<span class="live-indicator"><div class="live-dot"></div> Live</span>' : ''}
            </div>
            <a href="product-detail.html?id=${product.id}"><h3 class="card-title">${product.title}</h3></a>
            <div class="rating">
                ${renderStars(product.rating)}
                <span style="font-size: 0.8rem; color: #64748b; margin-left: 0.5rem">(${product.rating})</span>
            </div>
            <div class="card-footer" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span class="price" style="font-size: 1.25rem;">${formatPrice(product.price)}</span>
                    ${oldPriceHtml}
                </div>
                <a href="${platformUrl}" class="btn btn-primary btn-sm" style="width: 100%;" onclick="${onclickAction}" ${isDirect ? '' : 'target="_blank"'}>
                    ${finalCtaText}
                </a>
            </div>
        </div>
    `;
    return div;
}

function renderStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            stars += '<i data-lucide="star" style="width: 14px; fill: #f59e0b; color: #f59e0b"></i>';
        } else {
            stars += '<i data-lucide="star" style="width: 14px; color: #cbd5e1"></i>';
        }
    }
    return stars;
}

function renderPlatformProducts(platform, gridId, limit = null, filters = {}) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const stats = JSON.parse(localStorage.getItem('click_stats') || '{}');
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    let filtered = products.filter(p => {
        // Platform Filter
        let matchesPlatform = false;
        if (platform === 'featured') matchesPlatform = p.featured;
        else if (platform === 'trending') matchesPlatform = true; // Will sort by clicks later
        else matchesPlatform = p.platform === platform;

        if (!matchesPlatform) return false;

        // Dynamic Filters (Country, Category)
        if (filters.country && filters.country !== 'all') {
            if (p.country && p.country !== 'all' && p.country !== filters.country) return false;
        }
        
        if (filters.category && filters.category !== 'all') {
            if (p.category && p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
        }

        return true;
    });

    // Apply sorting: Newest products first
    filtered.sort((a, b) => {
        const idA = parseInt(a.id.split('-')[1]) || 0;
        const idB = parseInt(b.id.split('-')[1]) || 0;
        return idB - idA;
    });

    // Special logic for Trending: Sort by click count
    if (platform === 'trending') {
        filtered.sort((a, b) => (stats[b.id] || 0) - (stats[a.id] || 0));
        // Only show items with at least 1 click for trending, or just the top sellers
        filtered = filtered.filter(p => (stats[p.id] || 0) > 0 || p.deal);
    }

    // Apply limit if specified (useful for homepage previews)
    if (limit) {
        filtered = filtered.slice(0, limit);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No products found in this section yet.</p>`;
    } else {
        filtered.forEach((p, index) => {
            const card = createProductCard(p);
            // Add ranking badge for trending items
            grid.appendChild(card);
        });
    }
    
    if (window.lucide) lucide.createIcons();
}

// --- Data Management ---

function loadSampleData() {
    const isInitialized = localStorage.getItem('app_initialized');
    
    // If already initialized once, don't re-inject hardcoded samples
    if (isInitialized) return;

    const sampleProducts = [
        {
            id: 'p-1710634285812',
            platform: 'aliexpress',
            title: 'Portable Electric Coffee Grinder, USB Rechargeable',
            price: 'AED 278.99',
            oldPrice: 'AED 786.92',
            rating: 5.0,
            image: 'https://ae01.alicdn.com/kf/H0009587440054d5b91b98f24a6828987V/Portable-Electric-Coffee-Grinder-USB-Rechargeable-Ceramic-Grinding-Core-Coffee-Beans-Grinder-Coffee-Machine-Home-Travel.jpg',
            featured: true,
            deal: true,
            link: 'https://s.click.aliexpress.com/e/_DkXW8bZ',
            category: 'Coffee Gear',
            country: 'all'
        },
        {
            id: 'p-1710634285813',
            platform: 'aliexpress',
            title: 'MHW-3BOMBER Disposable Coffee Filter Paper',
            price: 'AED 33.95',
            oldPrice: 'AED 124.01',
            rating: 5.0,
            image: 'https://ae01.alicdn.com/kf/H76878b2089b048869c8e88698c88698cC.jpg',
            featured: true,
            deal: true,
            link: 'https://s.click.aliexpress.com/e/_DkXW8bZ',
            category: 'Coffee Gear',
            country: 'all'
        },
        {
            id: 'p-1710634285814',
            platform: 'aliexpress',
            title: 'IKAPE Wireless Bluetooth Portable Coffee',
            price: 'AED 656.34',
            oldPrice: 'AED 1,562.25',
            rating: 5.0,
            image: 'https://ae01.alicdn.com/kf/Sa8868c8868c8868c8868c8868c8868C.jpg',
            featured: true,
            deal: true,
            link: 'https://s.click.aliexpress.com/e/_DkXW8bZ',
            category: 'Coffee Gear',
            country: 'all'
        },
        {
            id: 'fvr-2',
            platform: 'fiverr',
            title: 'Complete SEO Optimization for WordPress',
            price: '$120.00',
            rating: 4.9,
            image: 'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/140239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg',
            featured: true,
            category: 'SEO',
            link: 'https://go.fiverr.com/visit/?bta=your-id&ncp=2'
        },
        {
            id: 'p-1773520452512',
            platform: 'aliexpress',
            title: 'Wireless Earbuds, Bluetooth 5.4 Headphones Bass Stereo, Ear Buds with Noise Cancelling Mic, LED Display in Ear Earphones Clear Calls, IP7 Waterproof Bluetooth Earbuds for Phones/Sports/Laptop, Black',
            price: 'AED 89.00',
            oldPrice: 'AED 199.00',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
            featured: false,
            deal: true,
            link: '#',
            category: 'Electronics',
            country: 'all'
        }
    ];

    // Only load these if products are empty or it's the very first run
    const existing = localStorage.getItem('products');
    if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        // Push initial products to cloud if configured
        pushToCloud('products', sampleProducts);
    }
    
    // Mark as initialized so we don't interfere again
    localStorage.setItem('app_initialized', 'true');
}


// --- Platform Menu Dropdown Logic ---

function togglePlatformMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('mobile-platform-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobile-platform-menu');
    const trigger = document.querySelector('.mobile-dropdown-trigger');
    if (menu && menu.classList.contains('active')) {
        if (!menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.remove('active');
        }
    }
});

// --- Platform-Specific Filter Management ---

function getPlatformFilters() {
    const defaults = {
        fiverr: {
            categories: ["SEO", "Logo Design", "Digital Marketing", "Video Editing", "Writing"],
            countries: { US: "United States", GB: "United Kingdom", PK: "Pakistan", IN: "India", AE: "United Arab Emirates" }
        },
        amazon: {
            categories: ["Electronics", "Home", "Kitchen", "Beauty", "Sports"],
            countries: { US: "Amazon US", GB: "Amazon UK", AE: "Amazon UAE", SA: "Amazon Saudi" }
        },
        aliexpress: {
            categories: ["Electronics", "Gadgets", "Tools", "Coffee Gear", "Fashion"],
            countries: { all: "Global Delivery" }
        }
    };
    const filters = JSON.parse(localStorage.getItem('platform_filters') || 'null');
    if (!filters) {
        localStorage.setItem('platform_filters', JSON.stringify(defaults));
        return defaults;
    }
    return filters;
}


function savePlatformFilters(filters) {
    localStorage.setItem('platform_filters', JSON.stringify(filters));
}

function refreshPlatformFiltersUI() {
    const platformSelect = document.getElementById('manage-platform-select');
    if (!platformSelect) return;
    
    const platform = platformSelect.value;
    const filters = getPlatformFilters();
    const platformData = filters[platform] || { categories: [], countries: {} };


    // Update Categories Table
    const catList = document.getElementById('platform-category-list');
    if (catList) {
        catList.innerHTML = '';
        (platformData.categories || []).forEach(cat => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cat}</td>
                <td>
                    <button class="btn-icon btn-icon-danger" onclick="deletePlatformCategory('${platform}', '${cat}')">
                        <i data-lucide="trash-2" style="width: 16px;"></i>
                    </button>
                </td>
            `;
            catList.appendChild(tr);
        });
    }

    // Update Countries Table
    const countryList = document.getElementById('platform-country-list');
    if (countryList) {
        countryList.innerHTML = '';
        Object.entries(platformData.countries || {}).forEach(([code, name]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 700">${code}</td>
                <td>${name}</td>
                <td>
                    <button class="btn-icon btn-icon-danger" onclick="deletePlatformCountry('${platform}', '${code}')">
                        <i data-lucide="trash-2" style="width: 16px;"></i>
                    </button>
                </td>
            `;
            countryList.appendChild(tr);
        });
    }

    if (window.lucide) lucide.createIcons();
}

function addPlatformCategory(platform, name) {
    const filters = getPlatformFilters();
    if (!filters[platform]) filters[platform] = { categories: [], countries: {} };
    if (!filters[platform].categories.includes(name)) {
        filters[platform].categories.push(name);
        savePlatformFilters(filters);
    }
    refreshPlatformFiltersUI();
}

function deletePlatformCategory(platform, name) {
    const filters = getPlatformFilters();
    if (filters[platform]) {
        filters[platform].categories = filters[platform].categories.filter(c => c !== name);
        savePlatformFilters(filters);
    }
    refreshPlatformFiltersUI();
}

function addPlatformCountry(platform, code, name) {
    const filters = getPlatformFilters();
    if (!filters[platform]) filters[platform] = { categories: [], countries: {} };
    filters[platform].countries[code.toUpperCase()] = name;
    savePlatformFilters(filters);
    refreshPlatformFiltersUI();
}

function deletePlatformCountry(platform, code) {
    const filters = getPlatformFilters();
    if (filters[platform] && filters[platform].countries[code]) {
        delete filters[platform].countries[code];
        savePlatformFilters(filters);
    }
    refreshPlatformFiltersUI();
}

/**
 * Shared Product Logic
 * @param {string} id - Product ID
 * @param {string} title - Product Title
 */
function shareProduct(id, title) {
    const shareUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '/')}product-detail.html?id=${id}`;
    const shareData = {
        title: title || 'Check out this deal on AffiliateHub!',
        text: `I found this amazing deal on AffiliateHub: ${title}`,
        url: shareUrl
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Product shared successfully'))
            .catch((error) => console.log('Error sharing product:', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('Link copied to clipboard!', 'check-circle', '#4ade80');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            showToast('Failed to copy link.', 'alert-circle', '#ef4444');
        });
    }
}

/**
 * Universal Toast Notification
 */
function showToast(message, icon, iconColor) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
        background: #1e293b; color: white; padding: 1rem 2rem; 
        border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);
        z-index: 9999; animation: slideIn 0.3s ease; font-weight: 600;
        display: flex; align-items: center; gap: 1rem; border: 1px solid ${iconColor || 'transparent'};
    `;
    toast.innerHTML = `<i data-lucide="${icon || 'info'}" style="color: ${iconColor || 'white'}"></i> ${message}`;
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

