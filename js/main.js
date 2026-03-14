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
    initMobileMenu(); // Mobile Nav
    handleSearch();
    loadSampleData();
    applySiteSettings();
    updateCartBadge();
    initScrollReveal();
}

function initMobileMenu() {
    // Create drawer and overlay if they don't exist
    if (!document.querySelector('.mobile-drawer')) {
        const drawer = document.createElement('div');
        drawer.className = 'mobile-drawer';
        const loc = getLocalizationSettings();
        const curOptions = Object.keys(loc.rates).map(c => `<option value="${c}" ${loc.currency === c ? 'selected' : ''}>${c}</option>`).join('');
        const langOptions = `<option value="en" ${loc.language === 'en' ? 'selected' : ''}>EN</option>
                             <option value="ur" ${loc.language === 'ur' ? 'selected' : ''}>UR</option>`;

        drawer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div class="logo"><span class="logo-accent">Affiliate</span>Hub</div>
                <button id="close-drawer" style="font-size: 1.5rem;">&times;</button>
            </div>
            <div class="drawer-links">
                <a href="index.html"><i data-lucide="home"></i> Home</a>
                <a href="amazon.html"><i data-lucide="shopping-cart"></i> Amazon</a>
                <a href="aliexpress.html"><i data-lucide="globe"></i> AliExpress</a>
                <a href="fiverr.html"><i data-lucide="briefcase"></i> Fiverr</a>
                <a href="dropshipping.html" style="color: var(--primary-color)"><i data-lucide="store"></i> My Store</a>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 1rem 0;">
                <a href="login.html"><i data-lucide="user"></i> Login / My Account</a>
            </div>
            <div class="drawer-loc-section">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">Settings</p>
                <div style="display: flex; gap: 1rem;">
                    <div style="flex: 1;">
                        <span style="font-size: 0.7rem; display: block; margin-bottom: 0.25rem;">Currency</span>
                        <select onchange="setCurrency(this.value)" style="width: 100%; padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); background: #f8fafc;">
                            ${curOptions}
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <span style="font-size: 0.7rem; display: block; margin-bottom: 0.25rem;">Language</span>
                        <select onchange="setLanguage(this.value)" style="width: 100%; padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); background: #f8fafc;">
                            ${langOptions}
                        </select>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(drawer);

        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        document.body.appendChild(overlay);

        // Toggle Logic
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu-toggle')) {
                drawer.classList.add('active');
                overlay.classList.add('active');
            }
            if (e.target.id === 'close-drawer' || e.target.classList.contains('drawer-overlay')) {
                drawer.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        if (window.lucide) lucide.createIcons();
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
        symbols: { USD: '$', AED: 'د.إ', SAR: 'ر.س', PKR: 'Rs', INR: '₹' }
    };
    const settings = JSON.parse(localStorage.getItem('loc_settings') || 'null');
    if (!settings) {
        localStorage.setItem('loc_settings', JSON.stringify(defaults));
        return defaults;
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
        <div class="user-profile-nav" style="display: flex; align-items: center; gap: 1rem;">
            <div class="user-info-mini" style="text-align: right; line-height: 1;">
                <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">Welcome,</span>
                <span style="font-weight: 700; font-size: 0.85rem;">${user.name}</span>
            </div>
            <button onclick="logoutUser()" class="btn-logout" title="Logout">
                <i data-lucide="log-out"></i>
            </button>
        </div>
    ` : `
        <a href="login.html" class="btn-login">
            <i data-lucide="user"></i> Login
        </a>
    `;

    const categories = JSON.parse(localStorage.getItem('categories') || '["Electronics", "Smart Home", "Digital Marketing", "Logo Design", "Gadgets", "Video Editing"]');
    if (!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify(categories));

    const categoryOptions = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    const loc = getLocalizationSettings();
    const curOptions = Object.keys(loc.rates).map(c => `<option value="${c}" ${loc.currency === c ? 'selected' : ''}>${c}</option>`).join('');
    const langOptions = `<option value="en" ${loc.language === 'en' ? 'selected' : ''}>EN</option>
                         <option value="ur" ${loc.language === 'ur' ? 'selected' : ''}>UR</option>`;

    nav.className = 'glass sticky-nav';
    nav.innerHTML = `
        <div class="container nav-content">
            <div class="nav-left">
                <a href="index.html" class="logo">
                    <span class="logo-accent">Affiliate</span>Hub
                </a>
                
                <ul class="nav-main-links">
                    <li><a href="amazon.html" id="nav-amazon">Amazon</a></li>
                    <li><a href="aliexpress.html" id="nav-aliexpress">AliExpress</a></li>
                    <li><a href="fiverr.html" id="nav-fiverr">Fiverr</a></li>
                    <li><a href="dropshipping.html" id="nav-store" style="color: var(--primary-color)">Store</a></li>
                    <li><a href="#blog-section" id="nav-blog">Blog</a></li>
                </ul>
            </div>
            
            <div class="nav-right">
                <div class="loc-selectors" style="display: flex; gap: 0.5rem; margin-right: 1rem;">
                    <select onchange="setCurrency(this.value)" style="background: rgba(0,0,0,0.05); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 5px; font-size: 0.7rem; cursor: pointer;">
                        ${curOptions}
                    </select>
                    <select onchange="setLanguage(this.value)" style="background: rgba(0,0,0,0.05); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 5px; font-size: 0.7rem; cursor: pointer;">
                        ${langOptions}
                    </select>
                </div>

                <div class="search-container">
                    <select id="search-category" style="background: transparent; border: none; border-right: 1px solid var(--border-color); padding-right: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); outline: none; cursor: pointer; max-width: 100px;">
                        <option value="all">All</option>
                        ${categoryOptions}
                    </select>
                    <input type="text" id="global-search" placeholder="Search..." id="search-placeholder">
                    <button id="search-trigger" style="color: var(--primary-color)">
                        <i data-lucide="search" style="width: 18px;"></i>
                    </button>
                </div>

                <div class="cart-nav-trigger" onclick="location.href='checkout.html'">
                    <i data-lucide="shopping-bag"></i>
                    <span class="cart-count">0</span>
                </div>

                ${authBtn}

                <button class="mobile-menu-toggle" style="display: none;">
                    <i data-lucide="menu"></i>
                </button>
            </div>
        </div>
    `;
    
    // Refresh icons
    if (window.lucide) {
        lucide.createIcons();
    }
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

    // Discount Calculation & Badge Logic
    let discountHtml = '';
    let discountPct = 0;
    if (product.oldPrice) {
        const current = parseFloat(product.price.replace(/[^\d.]/g, ''));
        const old = parseFloat(product.oldPrice.replace(/[^\d.]/g, ''));
        if (!isNaN(current) && !isNaN(old) && old > current) {
            discountPct = Math.round(((old - current) / old) * 100);
            discountHtml = `<span class="discount-badge-standalone">-${discountPct}%</span>`;
        }
    }

    const showBadge = (product.featured || Math.random() > 0.8 || discountPct > 0);
    const badgeType = discountPct > 0 ? 'DEAL' : (product.featured ? 'Featured' : (Math.random() > 0.5 ? 'Hot' : 'New'));
    const isDeal = discountPct > 0;
    const badgeHtml = showBadge ? `<span class="badge-hot blinking ${isDeal ? 'badge-deal' : ''}">${badgeType}</span>` : '';
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

function renderPlatformProducts(platform, gridId, limit = null) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const stats = JSON.parse(localStorage.getItem('click_stats') || '{}');
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    let filtered = products.filter(p => {
        if (platform === 'featured') return p.featured;
        if (platform === 'trending') return true; // Will sort by clicks later
        return p.platform === platform;
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
    if (localStorage.getItem('products')) return;
    
    const sampleProducts = [
        {
            id: 'amz-1',
            platform: 'amazon',
            title: 'Wireless Noise Cancelling Earbuds',
            price: '$89.00',
            oldPrice: '$129.00',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
            featured: true,
            deal: true,
            link: 'https://amazon.com',
            category: 'Electronics'
        },
        {
            id: 'amz-2',
            platform: 'amazon',
            title: 'Smart Watch with Heart-Rate Monitor',
            price: '$45.00',
            oldPrice: '$59.99',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
            featured: false,
            deal: false,
            link: 'https://amazon.com',
            category: 'Gadgets'
        },
        {
            id: 'ali-1',
            platform: 'aliexpress',
            title: 'Mechanical RGB Gaming Keyboard',
            price: '$34.50',
            oldPrice: '$49.99',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=400&q=80',
            featured: true,
            deal: true,
            link: 'https://aliexpress.com',
            category: 'PC Gaming'
        }
    ];
    
    localStorage.setItem('products', JSON.stringify(sampleProducts));
}

// --- Sharing Logic ---

function shareProduct(id, title) {
    const url = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/product-detail.html?id=${id}`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Check out this amazing deal: ${title}`,
            url: url
        }).catch(err => console.log('Error sharing', err));
    } else {
        // Fallback: Copy to clipboard
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        // Show a temporary toast/alert
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.innerText = 'Link copied to clipboard!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
}
