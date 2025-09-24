// TopSpinUSA E-commerce Website JavaScript
// Comprehensive functionality for tennis equipment store

class TopSpinUSA {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentFilters = {
            category: [],
            brand: [],
            priceRange: [0, 500]
        };
        this.searchQuery = '';
        this.sortBy = 'featured';
        this.viewMode = 'grid';
        
        this.init();
    }

    init() {
        this.generateProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.updateCartCount();
        this.updateFavoritesCount();
        this.updateUserInfo();
        this.setupGoogleAuth();
    }

    // Generate 200+ tennis products
    generateProducts() {
        const brands = ['Nike', 'Adidas', 'Wilson', 'Babolat', 'Head', 'Yonex', 'Lacoste', 'Fila', 'New Balance', 'Asics', 'On'];
        const categories = {
            rackets: ['Pro Staff', 'Pure Drive', 'Aero', 'Blade', 'Clash', 'Speed', 'Gravity', 'Radical', 'Prestige', 'Extreme'],
            shoes: ['Air Zoom', 'Court', 'Barricade', 'Defiant', 'Solution', 'Eclipsion', 'Gel Resolution', 'Court FF', 'Vapor', 'Zoom'],
            shirts: ['Dri-FIT', 'Aeroready', 'Court', 'Essential', 'Classic', 'Performance', 'Comfort', 'Active', 'Sport', 'Pro'],
            shorts: ['Court', 'Dri-FIT', 'Aeroready', 'Essential', 'Classic', 'Performance', 'Comfort', 'Active', 'Sport', 'Pro'],
            dresses: ['Court', 'Dri-FIT', 'Aeroready', 'Essential', 'Classic', 'Performance', 'Comfort', 'Active', 'Sport', 'Pro'],
            jackets: ['Windbreaker', 'Fleece', 'Puffer', 'Softshell', 'Rain', 'Thermal', 'Quilted', 'Bomber', 'Track', 'Hoodie'],
            accessories: ['Cap', 'Visor', 'Headband', 'Wristband', 'Socks', 'Bag', 'Grip', 'String', 'Overgrip', 'Dampener']
        };

        const colors = ['Black', 'White', 'Navy', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Gray', 'Brown'];
        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

        let productId = 1;
        
        Object.keys(categories).forEach(category => {
            categories[category].forEach(productName => {
                brands.forEach(brand => {
                    const basePrice = this.getBasePrice(category, brand);
                    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0;
                    const currentPrice = Math.floor(basePrice * (1 - discount / 100));
                    const originalPrice = discount > 0 ? basePrice : currentPrice;
                    
                    const product = {
                        id: productId++,
                        name: `${brand} ${productName}`,
                        brand: brand.toLowerCase().replace(' ', '-'),
                        category: category,
                        price: currentPrice,
                        originalPrice: originalPrice,
                        discount: discount,
                        image: `https://picsum.photos/400/400?random=${productId}`,
                        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
                        reviewCount: Math.floor(Math.random() * 500) + 10,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        sizes: this.getSizes(category),
                        description: `${brand} ${productName} - Premium tennis ${category} designed for performance and style.`,
                        features: this.getFeatures(category, brand),
                        inStock: Math.random() > 0.1,
                        isNew: Math.random() > 0.8,
                        isFeatured: Math.random() > 0.9
                    };
                    
                    this.products.push(product);
                });
            });
        });

        this.filteredProducts = [...this.products];
    }

    getBasePrice(category, brand) {
        const basePrices = {
            rackets: { 'Wilson': 200, 'Babolat': 180, 'Head': 190, 'Yonex': 170, 'default': 160 },
            shoes: { 'Nike': 120, 'Adidas': 110, 'Asics': 100, 'New Balance': 90, 'default': 80 },
            shirts: { 'Lacoste': 60, 'Nike': 50, 'Adidas': 45, 'Wilson': 40, 'default': 35 },
            shorts: { 'Lacoste': 50, 'Nike': 40, 'Adidas': 35, 'Wilson': 30, 'default': 25 },
            dresses: { 'Lacoste': 80, 'Nike': 70, 'Adidas': 65, 'Wilson': 60, 'default': 55 },
            jackets: { 'Nike': 100, 'Adidas': 90, 'Wilson': 80, 'Lacoste': 120, 'default': 70 },
            accessories: { 'Wilson': 25, 'Babolat': 20, 'Head': 18, 'Yonex': 15, 'default': 12 }
        };
        
        return basePrices[category][brand] || basePrices[category]['default'] || 50;
    }

    getSizes(category) {
        if (category === 'rackets') return ['4 1/4', '4 3/8', '4 1/2', '4 5/8'];
        if (category === 'shoes') return ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];
        return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    }

    getFeatures(category, brand) {
        const features = {
            rackets: ['Carbon fiber construction', 'Precision stringing', 'Comfort grip', 'Professional grade'],
            shoes: ['Breathable mesh', 'Cushioned sole', 'Non-marking outsole', 'Lightweight design'],
            shirts: ['Moisture-wicking', 'UV protection', 'Quick-dry fabric', 'Comfortable fit'],
            shorts: ['Elastic waistband', 'Moisture-wicking', 'Multiple pockets', 'Comfortable fit'],
            dresses: ['Moisture-wicking', 'UV protection', 'Quick-dry fabric', 'Elegant design'],
            jackets: ['Water-resistant', 'Breathable', 'Lightweight', 'Packable'],
            accessories: ['High-quality materials', 'Durable construction', 'Comfortable fit', 'Professional grade']
        };
        
        return features[category] || ['High-quality', 'Durable', 'Comfortable', 'Professional'];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchForm = document.querySelector('.search-form');
        
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.performSearch();
        });
        
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });

        // Category dropdown
        const categoryBtn = document.getElementById('allCategoriesBtn');
        const categoryMenu = document.getElementById('categoryMenu');
        
        categoryBtn.addEventListener('click', () => {
            categoryMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
                categoryMenu.classList.remove('show');
            }
        });

        // Category links
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                categoryMenu.classList.remove('show');
            });
        });

        // Brand filter
        const brandFilter = document.getElementById('brandFilter');
        brandFilter.addEventListener('change', (e) => {
            this.filterByBrand(e.target.value);
        });

        // Price range filter
        const priceRange = document.getElementById('priceRange');
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        
        priceRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            maxPrice.textContent = `$${value}`;
            this.currentFilters.priceRange[1] = value;
            this.applyFilters();
        });

        // Filter checkboxes
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        // Price inputs
        const minPriceInput = document.getElementById('minPriceInput');
        const maxPriceInput = document.getElementById('maxPriceInput');
        
        minPriceInput.addEventListener('change', (e) => {
            this.currentFilters.priceRange[0] = parseInt(e.target.value) || 0;
            this.applyFilters();
        });
        
        maxPriceInput.addEventListener('change', (e) => {
            this.currentFilters.priceRange[1] = parseInt(e.target.value) || 500;
            this.applyFilters();
        });

        // Clear filters
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        clearFiltersBtn.addEventListener('click', () => {
            this.clearFilters();
        });

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.sortProducts();
        });

        // View mode toggle
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        gridView.addEventListener('click', () => {
            this.setViewMode('grid');
        });
        
        listView.addEventListener('click', () => {
            this.setViewMode('list');
        });

        // User menu
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        userBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });

        // Close user dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        // Auth buttons
        const signinBtn = document.getElementById('signinBtn');
        const signupBtn = document.getElementById('signupBtn');
        const signoutBtn = document.getElementById('signoutBtn');
        
        signinBtn.addEventListener('click', () => {
            this.showAuthModal('signin');
        });
        
        signupBtn.addEventListener('click', () => {
            this.showAuthModal('signup');
        });
        
        signoutBtn.addEventListener('click', () => {
            this.signOut();
        });

        // Auth modal
        const authModal = document.getElementById('authModal');
        const authModalClose = document.getElementById('authModalClose');
        const signinTab = document.getElementById('signinTab');
        const signupTab = document.getElementById('signupTab');
        
        authModalClose.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        signinTab.addEventListener('click', () => {
            this.switchAuthTab('signin');
        });
        
        signupTab.addEventListener('click', () => {
            this.switchAuthTab('signup');
        });

        // Close modal when clicking outside
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                this.hideAuthModal();
            }
        });

        // Cart functionality
        const cartBtn = document.getElementById('cartBtn');
        const cartModal = document.getElementById('cartModal');
        const cartModalClose = document.getElementById('cartModalClose');
        
        cartBtn.addEventListener('click', () => {
            this.showCartModal();
        });
        
        cartModalClose.addEventListener('click', () => {
            this.hideCartModal();
        });

        // Favorites functionality
        const favoritesBtn = document.getElementById('favoritesBtn');
        favoritesBtn.addEventListener('click', () => {
            this.showFavorites();
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSignup();
        });

        // Hero buttons
        const shopNowBtn = document.getElementById('shopNowBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        
        shopNowBtn.addEventListener('click', () => {
            document.getElementById('products-heading').scrollIntoView({ behavior: 'smooth' });
        });
        
        learnMoreBtn.addEventListener('click', () => {
            this.showToast('Learn more about our premium tennis equipment!', 'info');
        });
    }

    performSearch() {
        if (this.searchQuery.length < 2) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
        
        this.applyFilters();
        this.renderProducts();
    }

    filterByCategory(category) {
        if (this.currentFilters.category.includes(category)) {
            this.currentFilters.category = this.currentFilters.category.filter(c => c !== category);
        } else {
            this.currentFilters.category.push(category);
        }
        this.applyFilters();
    }

    filterByBrand(brand) {
        if (brand) {
            this.currentFilters.brand = [brand];
        } else {
            this.currentFilters.brand = [];
        }
        this.applyFilters();
    }

    updateFilters() {
        const categoryCheckboxes = document.querySelectorAll('.filter-checkbox[value]');
        this.currentFilters.category = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.products];

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (this.currentFilters.category.length > 0) {
            filtered = filtered.filter(product => 
                this.currentFilters.category.includes(product.category)
            );
        }

        // Brand filter
        if (this.currentFilters.brand.length > 0) {
            filtered = filtered.filter(product => 
                this.currentFilters.brand.includes(product.brand)
            );
        }

        // Price filter
        filtered = filtered.filter(product => 
            product.price >= this.currentFilters.priceRange[0] && 
            product.price <= this.currentFilters.priceRange[1]
        );

        this.filteredProducts = filtered;
        this.sortProducts();
        this.renderProducts();
    }

    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                this.filteredProducts.sort((a, b) => {
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return b.rating - a.rating;
                });
        }
    }

    setViewMode(mode) {
        this.viewMode = mode;
        const productsGrid = document.getElementById('productsGrid');
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (mode === 'list') {
            productsGrid.classList.add('list-view');
            gridView.classList.remove('active');
            listView.classList.add('active');
        } else {
            productsGrid.classList.remove('list-view');
            gridView.classList.add('active');
            listView.classList.remove('active');
        }
    }

    clearFilters() {
        this.currentFilters = {
            category: [],
            brand: [],
            priceRange: [0, 500]
        };
        
        // Reset UI elements
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('brandFilter').value = '';
        document.getElementById('priceRange').value = 500;
        document.getElementById('minPriceInput').value = '';
        document.getElementById('maxPriceInput').value = '';
        document.getElementById('minPrice').textContent = '$0';
        document.getElementById('maxPrice').textContent = '$500';
        
        this.applyFilters();
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const featuredProducts = document.getElementById('featuredProducts');
        
        // Render featured products
        const featured = this.products.filter(p => p.isFeatured).slice(0, 8);
        featuredProducts.innerHTML = featured.map(product => this.createProductCard(product)).join('');
        
        // Render all products
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        
        this.renderPagination();
        this.setupProductEventListeners();
    }

    createProductCard(product) {
        const discountBadge = product.discount > 0 ? 
            `<div class="product-badge">${product.discount}% OFF</div>` : '';
        
        const newBadge = product.isNew ? 
            `<div class="product-badge" style="background: var(--success-color);">NEW</div>` : '';
        
        const stockStatus = !product.inStock ? 
            `<div class="product-badge" style="background: var(--error-color);">OUT OF STOCK</div>` : '';
        
        const isFavorited = this.favorites.includes(product.id);
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    ${discountBadge}
                    ${newBadge}
                    ${stockStatus}
                    <div class="product-actions">
                        <button class="action-btn" onclick="app.toggleFavorite(${product.id})" title="Add to favorites">
                            <i class="fas fa-heart ${isFavorited ? 'favorited' : ''}" aria-hidden="true"></i>
                        </button>
                        <button class="action-btn" onclick="app.showProductModal(${product.id})" title="Quick view">
                            <i class="fas fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand.toUpperCase()}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-text">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">$${product.originalPrice}</span>` : ''}
                        ${product.discount > 0 ? 
                            `<span class="discount-percent">-${product.discount}%</span>` : ''}
                    </div>
                    <div class="product-actions-bottom">
                        <button class="add-to-cart-btn" onclick="app.addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="add-to-favorites-btn ${isFavorited ? 'favorited' : ''}" onclick="app.toggleFavorite(${product.id})">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star"></i>';
        }
        return stars;
    }

    setupProductEventListeners() {
        // Product card click for quick view
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const productId = parseInt(card.dataset.productId);
                    this.showProductModal(productId);
                }
            });
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showToast(`${product.name} added to cart!`, 'success');
    }

    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.favorites.push(productId);
            this.showToast('Added to favorites', 'success');
        }

        this.saveFavorites();
        this.updateFavoritesCount();
        this.renderProducts(); // Re-render to update favorite buttons
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('productModalTitle');
        const productDetails = document.getElementById('productDetails');
        
        modalTitle.textContent = product.name;
        
        const isFavorited = this.favorites.includes(product.id);
        
        productDetails.innerHTML = `
            <div class="product-modal-content">
                <div class="product-modal-image">
                    <img src="${product.image}" alt="${product.name}" class="modal-product-image">
                </div>
                <div class="product-modal-info">
                    <div class="product-brand">${product.brand.toUpperCase()}</div>
                    <h2 class="product-name">${product.name}</h2>
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-text">${product.rating} (${product.reviewCount} reviews)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">$${product.originalPrice}</span>` : ''}
                        ${product.discount > 0 ? 
                            `<span class="discount-percent">-${product.discount}% OFF</span>` : ''}
                    </div>
                    <div class="product-description">
                        <p>${product.description}</p>
                    </div>
                    <div class="product-features">
                        <h4>Features:</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="product-options">
                        <div class="size-selection">
                            <label>Size:</label>
                            <select class="size-select">
                                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                        </div>
                        <div class="color-selection">
                            <label>Color:</label>
                            <span class="color-option">${product.color}</span>
                        </div>
                    </div>
                    <div class="product-actions-modal">
                        <button class="add-to-cart-btn" onclick="app.addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="add-to-favorites-btn ${isFavorited ? 'favorited' : ''}" onclick="app.toggleFavorite(${product.id})">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                            ${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }

    hideProductModal() {
        const modal = document.getElementById('productModal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    showCartModal() {
        const modal = document.getElementById('cartModal');
        const cartContent = document.getElementById('cartContent');
        
        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some tennis gear to get started!</p>
                    <button class="cta-btn primary" onclick="app.hideCartModal()">Continue Shopping</button>
                </div>
            `;
        } else {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartContent.innerHTML = `
                <div class="cart-items">
                    ${this.cart.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-info">
                                <h4 class="cart-item-name">${item.name}</h4>
                                <div class="cart-item-price">$${item.price}</div>
                                <div class="cart-item-quantity">
                                    <button onclick="app.updateQuantity(${item.id}, -1)">-</button>
                                    <span>${item.quantity}</span>
                                    <button onclick="app.updateQuantity(${item.id}, 1)">+</button>
                                </div>
                            </div>
                            <button class="remove-item-btn" onclick="app.removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <h3>Total: $${total.toFixed(2)}</h3>
                    </div>
                    <div class="cart-actions">
                        <button class="cta-btn secondary" onclick="app.hideCartModal()">Continue Shopping</button>
                        <button class="cta-btn primary" onclick="app.proceedToCheckout()">Checkout</button>
                    </div>
                </div>
            `;
        }
        
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }

    hideCartModal() {
        const modal = document.getElementById('cartModal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
                this.showCartModal(); // Refresh cart modal
            }
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.showCartModal(); // Refresh cart modal
        this.showToast('Item removed from cart', 'info');
    }

    proceedToCheckout() {
        if (this.cart.length === 0) return;
        
        this.showPaymentModal();
    }

    showPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const paymentContent = document.getElementById('paymentContent');
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        paymentContent.innerHTML = `
            <div class="payment-form">
                <div class="payment-summary">
                    <h3>Order Summary</h3>
                    <div class="order-items">
                        ${this.cart.map(item => `
                            <div class="order-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        <strong>Total: $${total.toFixed(2)}</strong>
                    </div>
                </div>
                
                <form class="checkout-form" id="checkoutForm">
                    <div class="form-section">
                        <h4>Shipping Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="address">Address</label>
                            <input type="text" id="address" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">City</label>
                                <input type="text" id="city" required>
                            </div>
                            <div class="form-group">
                                <label for="state">State</label>
                                <input type="text" id="state" required>
                            </div>
                            <div class="form-group">
                                <label for="zip">ZIP Code</label>
                                <input type="text" id="zip" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Payment Information</h4>
                        <div class="payment-methods">
                            <div class="payment-method">
                                <input type="radio" id="card" name="payment" value="card" checked>
                                <label for="card">Credit/Debit Card</label>
                            </div>
                            <div class="payment-method">
                                <input type="radio" id="paypal" name="payment" value="paypal">
                                <label for="paypal">PayPal</label>
                            </div>
                            <div class="payment-method">
                                <input type="radio" id="apple" name="payment" value="apple">
                                <label for="apple">Apple Pay</label>
                            </div>
                        </div>
                        
                        <div class="card-details" id="cardDetails">
                            <div class="form-group">
                                <label for="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expiry">Expiry Date</label>
                                    <input type="text" id="expiry" placeholder="MM/YY" required>
                                </div>
                                <div class="form-group">
                                    <label for="cvv">CVV</label>
                                    <input type="text" id="cvv" placeholder="123" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="checkout-actions">
                        <button type="button" class="cta-btn secondary" onclick="app.hidePaymentModal()">Cancel</button>
                        <button type="submit" class="cta-btn primary">Complete Order</button>
                    </div>
                </form>
            </div>
        `;
        
        // Setup payment method toggle
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const cardDetails = document.getElementById('cardDetails');
                if (e.target.value === 'card') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            });
        });
        
        // Setup form submission
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });
        
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }

    hidePaymentModal() {
        const modal = document.getElementById('paymentModal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    processPayment() {
        this.showLoading();
        
        // Simulate payment processing
        setTimeout(() => {
            this.hideLoading();
            this.hidePaymentModal();
            this.hideCartModal();
            
            // Clear cart
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            
            this.showToast('Order placed successfully! Thank you for your purchase.', 'success');
        }, 2000);
    }

    showFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('No favorites yet. Add some products to your favorites!', 'info');
            return;
        }
        
        const favoriteProducts = this.products.filter(p => this.favorites.includes(p.id));
        this.filteredProducts = favoriteProducts;
        this.renderProducts();
        this.showToast('Showing your favorite products', 'info');
    }

    showAuthModal(type) {
        const modal = document.getElementById('authModal');
        this.switchAuthTab(type);
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    switchAuthTab(type) {
        const signinTab = document.getElementById('signinTab');
        const signupTab = document.getElementById('signupTab');
        const signinForm = document.getElementById('signinForm');
        const signupForm = document.getElementById('signupForm');
        
        if (type === 'signin') {
            signinTab.classList.add('active');
            signupTab.classList.remove('active');
            signinForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
            signupForm.style.display = 'block';
            signinForm.style.display = 'none';
        }
    }

    setupGoogleAuth() {
        // Google OAuth setup
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: '6530', // Replace with actual client ID
                callback: this.handleGoogleAuth.bind(this)
            });
        }
    }

    handleGoogleAuth(response) {
        // Decode JWT token (simplified)
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        this.user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        };
        
        this.saveUser();
        this.updateUserInfo();
        this.hideAuthModal();
        this.showToast(`Welcome back, ${this.user.name}!`, 'success');
    }

    signOut() {
        this.user = null;
        this.saveUser();
        this.updateUserInfo();
        this.showToast('Signed out successfully', 'info');
    }

    handleNewsletterSignup() {
        const email = document.getElementById('newsletterEmail').value;
        this.showToast('Thank you for subscribing to our newsletter!', 'success');
        document.getElementById('newsletterEmail').value = '';
    }

    updateUserInfo() {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const signinBtn = document.getElementById('signinBtn');
        const signupBtn = document.getElementById('signupBtn');
        const signoutBtn = document.getElementById('signoutBtn');
        const profileBtn = document.getElementById('profileBtn');
        const ordersBtn = document.getElementById('ordersBtn');
        
        if (this.user) {
            userName.textContent = this.user.name;
            userEmail.textContent = this.user.email;
            signinBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            signoutBtn.style.display = 'block';
            profileBtn.style.display = 'block';
            ordersBtn.style.display = 'block';
        } else {
            userName.textContent = 'Guest';
            userEmail.textContent = 'Sign in to your account';
            signinBtn.style.display = 'block';
            signupBtn.style.display = 'block';
            signoutBtn.style.display = 'none';
            profileBtn.style.display = 'none';
            ordersBtn.style.display = 'none';
        }
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    updateFavoritesCount() {
        document.getElementById('favoritesCount').textContent = this.favorites.length;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="app.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            document.getElementById('products-heading').scrollIntoView({ behavior: 'smooth' });
        }
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${icon} toast-icon"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    saveUser() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }
}

// Initialize the application
const app = new TopSpinUSA();

// Global functions for onclick handlers
window.app = app;
