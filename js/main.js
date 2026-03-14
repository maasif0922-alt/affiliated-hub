/**
 * Main Application Logic
 * Handles common UI components, data management, and tracking
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log('Affiliate Website Initialized');
    renderNavbar();
    renderFooter();
    handleSearch();
    loadSampleData();
    applySiteSettings();
    updateCartBadge();
    initScrollReveal();
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
}

// --- Component Rendering ---

function renderNavbar() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    nav.className = 'glass sticky-nav';
    nav.innerHTML = `
        <div class="container nav-content">
            <div class="nav-left">
                <a href="index.html" class="logo">
                    <span class="logo-accent">Affiliate</span>Hub
                </a>
                
                <ul class="nav-main-links">
                    <li><a href="amazon.html">Amazon</a></li>
                    <li><a href="aliexpress.html">AliExpress</a></li>
                    <li><a href="fiverr.html">Fiverr</a></li>
                    <li><a href="dropshipping.html" style="color: var(--primary-color)">Store</a></li>
                </ul>
            </div>
            
            <div class="nav-right">
                <div class="search-container">
                    <i data-lucide="search"></i>
                    <input type="text" id="global-search" placeholder="Search deals...">
                </div>

                <div class="cart-nav-trigger" onclick="location.href='checkout.html'">
                    <i data-lucide="shopping-bag"></i>
                    <span class="cart-count">0</span>
                </div>

                <a href="admin.html" class="btn-login">
                    <i data-lucide="user"></i> Login
                </a>

                <button class="mobile-menu-toggle">
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
    const searchInput = document.getElementById('global-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    console.log('Searching for:', query);
    // Implementation for filtering products based on query
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

// --- Ecommerce & Dropshipping Cart Logic ---

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

// --- Data Management ---

function loadSampleData() {
    if (localStorage.getItem('products')) return;
    
    const sampleProducts = [
        {
            id: 'amz-1',
            platform: 'amazon',
            title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
            price: '$348.00',
            rating: 4.8,
            image: 'https://m.media-amazon.com/images/I/61SOnG9O4lL._AC_SL1500_.jpg',
            featured: true,
            deal: true,
            link: 'https://amazon.com/dp/B09XS7JWHH?tag=yourtag-20'
        },
        {
            id: 'amz-2',
            platform: 'amazon',
            title: 'Apple 2024 MacBook Air M3 Chip',
            price: '$1,099.00',
            rating: 4.9,
            image: 'https://m.media-amazon.com/images/I/71ItMhg1mAL._AC_SL1500_.jpg',
            featured: true,
            deal: false,
            link: 'https://amazon.com/dp/B0CX226X9N?tag=yourtag-20'
        },
        {
            id: 'ali-1',
            platform: 'aliexpress',
            title: 'Baseus 65W GaN Charger Fast Charging',
            price: '$28.99',
            rating: 4.7,
            image: 'https://ae01.alicdn.com/kf/S7e0f8c5c7e1c4c8b8c5c7e1c4c8b8c5c7.jpg',
            featured: true,
            deal: true,
            link: 'https://s.click.aliexpress.com/e/_your-link1'
        },
        {
            id: 'ali-2',
            platform: 'aliexpress',
            title: 'RGB Mechanical Keyboard Wireless Bluetooth',
            price: '$45.50',
            rating: 4.5,
            image: 'https://ae01.alicdn.com/kf/H7e0f8c5c7e1c4c8b8c5c7e1c4c8b8c5c7.jpg',
            featured: false,
            deal: true,
            link: 'https://s.click.aliexpress.com/e/_your-link2'
        },
        {
            id: 'fvr-1',
            platform: 'fiverr',
            title: 'Professional Logo Design & Brand Identity',
            price: 'From $50',
            rating: 5.0,
            image: 'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/116239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg',
            featured: false,
            category: 'Logo Design',
            link: 'https://go.fiverr.com/visit/?bta=your-id&ncp=1'
        },
        {
            id: 'fvr-2',
            platform: 'fiverr',
            title: 'Complete SEO Optimization for WordPress',
            price: 'From $120',
            rating: 4.9,
            image: 'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/140239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg',
            featured: true,
            category: 'SEO',
            link: 'https://go.fiverr.com/visit/?bta=your-id&ncp=2'
        },
        {
            id: 'fvr-3',
            platform: 'fiverr',
            title: 'Advanced Video Editing for YouTube',
            price: 'From $75',
            rating: 5.0,
            image: 'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/150239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg',
            featured: false,
            category: 'Video Editing',
            link: 'https://go.fiverr.com/visit/?bta=your-id&ncp=3'
        }
    ];
    
    localStorage.setItem('products', JSON.stringify(sampleProducts));
}
