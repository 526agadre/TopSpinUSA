// modules/ComponentRenderer.js - HTML Component Rendering

export class ComponentRenderer {
    constructor() {
        this.escapeHtml = this.escapeHtml.bind(this);
    }

    renderHeader() {
        return `
            <nav class="navbar" role="navigation" aria-label="Main navigation">
                <div class="nav-container container">
                    <div class="logo-section">
                        <a href="#home" class="logo-link" aria-label="TopSpinUSA Home">
                            <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='60'>🎾</text></svg>" alt="TopSpinUSA Logo" class="logo-img">
                            <span class="logo-text">TopSpinUSA</span>
                        </a>
                    </div>
                    
                    <div class="search-section">
                        <form class="search-form" id="searchForm">
                            <div class="search-input-group">
                                <input type="search" id="searchInput" class="search-input" placeholder="Search tennis equipment..." aria-label="Search products">
                                <button type="submit" class="search-btn" aria-label="Search">
                                    <i class="fas fa-search" aria-hidden="true"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="nav-actions">
                        <button class="favorites-btn" id="favoritesBtn" aria-label="View favorites">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                            <span class="favorites-count" id="favoritesCount">0</span>
                        </button>
                        
                        <button class="cart-btn" id="cartBtn" aria-label="View shopping cart">
                            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                            <span class="cart-count" id="cartCount">0</span>
                        </button>
                        
                        <div class="user-menu dropdown">
                            <button class="user-btn dropdown-toggle" id="userBtn" aria-label="User account menu">
                                <i class="fas fa-user" aria-hidden="true"></i>
                            </button>
                            <div class="user-dropdown dropdown-menu" id="userDropdown" role="menu" aria-label="User menu">
                                <div class="user-info" id="userInfo">
                                    <p class="user-name" id="userName">Guest</p>
                                    <p class="user-email" id="userEmail">Sign in to your account</p>
                                </div>
                                <div class="user-actions">
                                    <button class="btn btn-primary" id="signinBtn">Sign In</button>
                                    <button class="btn btn-secondary" id="signupBtn">Sign Up</button>
                                    <button class="btn btn-ghost" id="signoutBtn" style="display: none;">Sign Out</button>
                                    <button class="btn btn-ghost" id="profileBtn" style="display: none;">My Profile</button>
                                    <button class="btn btn-ghost" id="ordersBtn" style="display: none;">My Orders</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <nav class="category-nav" role="navigation" aria-label="Product categories">
                <div class="category-container container">
                    <div class="dropdown">
                        <button class="dropdown-toggle category-btn" id="allCategoriesBtn">
                            <i class="fas fa-bars" aria-hidden="true"></i>
                            All Categories
                            <i class="fas fa-chevron-down" aria-hidden="true"></i>
                        </button>
                        <div class="dropdown-menu category-menu" id="categoryMenu" role="menu">
                            ${this.renderCategoryMenu()}
                        </div>
                    </div>

                    <div class="brand-filter">
                        <select class="brand-select" id="brandFilter" aria-label="Filter by brand">
                            <option value="">All Brands</option>
                            <option value="nike">Nike</option>
                            <option value="adidas">Adidas</option>
                            <option value="wilson">Wilson</option>
                            <option value="babolat">Babolat</option>
                            <option value="head">Head</option>
                            <option value="yonex">Yonex</option>
                            <option value="lacoste">Lacoste</option>
                            <option value="fila">Fila</option>
                            <option value="new-balance">New Balance</option>
                            <option value="asics">Asics</option>
                            <option value="on">On</option>
                        </select>
                    </div>

                    <div class="price-filter">
                        <label for="priceRange" class="price-label">Price Range:</label>
                        <input type="range" id="priceRange" class="price-range" min="0" max="500" value="500" aria-label="Price range filter">
                        <div class="price-display">
                            <span id="minPrice">$0</span> - <span id="maxPrice">$500</span>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    renderCategoryMenu() {
        const categories = {
            'Equipment': [
                { name: 'Tennis Rackets', value: 'rackets' },
                { name: 'Tennis Balls', value: 'balls' },
                { name: 'Racket Bags', value: 'bags' }
            ],
            'Footwear': [
                { name: 'Tennis Shoes', value: 'shoes' }
            ],
            'Apparel': [
                { name: 'Tennis Shirts', value: 'shirts' },
                { name: 'Tennis Shorts', value: 'shorts' },
                { name: 'Jackets & Sweaters', value: 'jackets' }
            ]
        };

        return Object.entries(categories).map(([sectionName, items]) => `
            <div class="category-section">
                <h3 class="category-title">${sectionName}</h3>
                <ul class="category-list" role="list">
                    ${items.map(item => `
                        <li>
                            <a href="#" class="category-link" data-category="${item.value}">
                                ${item.name}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }

    renderFooter() {
        return `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3 class="footer-title">TopSpinUSA</h3>
                        <p class="footer-description">Your premier destination for tennis equipment and apparel from the world's leading brands.</p>
                        <div class="social-links">
                            <a href="#" class="social-link" aria-label="Facebook">
                                <i class="fab fa-facebook" aria-hidden="true"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Twitter">
                                <i class="fab fa-twitter" aria-hidden="true"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Instagram">
                                <i class="fab fa-instagram" aria-hidden="true"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="YouTube">
                                <i class="fab fa-youtube" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h4 class="footer-subtitle">Shop</h4>
                        <ul class="footer-links" role="list">
                            <li><a href="#" class="footer-link">Tennis Rackets</a></li>
                            <li><a href="#" class="footer-link">Tennis Shoes</a></li>
                            <li><a href="#" class="footer-link">Tennis Apparel</a></li>
                            <li><a href="#" class="footer-link">Tennis Balls</a></li>
                            <li><a href="#" class="footer-link">Bags</a></li>
                            <li><a href="#" class="footer-link">Sale</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4 class="footer-subtitle">Customer Service</h4>
                        <ul class="footer-links" role="list">
                            <li><a href="#" class="footer-link">Contact Us</a></li>
                            <li><a href="#" class="footer-link">Shipping Info</a></li>
                            <li><a href="#" class="footer-link">Returns & Exchanges</a></li>
                            <li><a href="#" class="footer-link">Size Guide</a></li>
                            <li><a href="#" class="footer-link">FAQ</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4 class="footer-subtitle">Company</h4>
                        <ul class="footer-links" role="list">
                            <li><a href="#" class="footer-link">About Us</a></li>
                            <li><a href="#" class="footer-link">Careers</a></li>
                            <li><a href="#" class="footer-link">Press</a></li>
                            <li><a href="#" class="footer-link">Privacy Policy</a></li>
                            <li><a href="#" class="footer-link">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <div class="payment-methods">
                            <i class="fab fa-cc-visa" aria-label="Visa"></i>
                            <i class="fab fa-cc-amex" aria-label="American Express"></i>
                            <i class="fab fa-paypal" aria-label="PayPal"></i>
                            <i class="fab fa-apple-pay" aria-label="Apple Pay"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderNewArrivals(products) {
        return `
            <div class="container">
                <header class="section-header row">
                    <h2 id="new-arrivals-heading" class="section-title">New Arrivals</h2>
                    <a href="#" class="section-link" onclick="app.setSortBy('newest')">View All</a>
                </header>
                <div class="carousel" aria-label="New arrivals carousel">
                    <div class="carousel-track">
                        ${products.map(product => this.renderCarouselProductCard(product)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderFeaturedProducts(products) {
        return `
            <div class="container">
                <header class="section-header">
                    <h2 id="featured-heading" class="section-title">Featured Products</h2>
                    <p class="section-subtitle">Handpicked favorites from our collection</p>
                </header>
                <div class="products-grid" id="featuredProducts" role="grid" aria-label="Featured products">
                    ${products.map(product => this.renderProductCard(product)).join('')}
                </div>
            </div>
        `;
    }

    renderProductsSection() {
        return `
            <div class="container">
                <header class="section-header">
                    <h2 id="products-heading" class="section-title">All Products</h2>
                    <div class="section-controls">
                        <div class="sort-controls">
                            <label for="sortSelect" class="sort-label">Sort by:</label>
                            <select id="sortSelect" class="sort-select" aria-label="Sort products">
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                                <option value="newest">Newest First</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                        <div class="view-controls">
                            <button class="view-btn active" id="gridView" aria-label="Grid view">
                                <i class="fas fa-th" aria-hidden="true"></i>
                            </button>
                            <button class="view-btn" id="listView" aria-label="List view">
                                <i class="fas fa-list" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </header>
                
                <div class="products-container">
                    ${this.renderFiltersSidebar()}
                    <div class="products-main">
                        <div class="products-grid" id="productsGrid" role="grid" aria-label="Product listings">
                            <!-- Products will be rendered here -->
                        </div>
                        <div class="pagination" id="pagination" role="navigation" aria-label="Product pagination">
                            <!-- Pagination will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderFiltersSidebar() {
        return `
            <aside class="filters-sidebar" role="complementary" aria-labelledby="filters-heading">
                <h3 id="filters-heading" class="filters-title">Filters</h3>
                
                <div class="filter-group">
                    <h4 class="filter-title">Category</h4>
                    <div class="filter-options">
                        ${this.renderFilterOption('rackets', 'Rackets', '45')}
                        ${this.renderFilterOption('shoes', 'Shoes', '38')}
                        ${this.renderFilterOption('shirts', 'Shirts', '52')}
                        ${this.renderFilterOption('shorts', 'Shorts', '28')}
                        ${this.renderFilterOption('jackets', 'Jackets', '35')}
                        ${this.renderFilterOption('balls', 'Balls', '40')}
                        ${this.renderFilterOption('bags', 'Bags', '22')}
                    </div>
                </div>
                
                <div class="filter-group">
                    <h4 class="filter-title">Brand</h4>
                    <div class="filter-options">
                        ${this.renderFilterOption('nike', 'Nike', '42')}
                        ${this.renderFilterOption('adidas', 'Adidas', '38')}
                        ${this.renderFilterOption('wilson', 'Wilson', '35')}
                        ${this.renderFilterOption('babolat', 'Babolat', '28')}
                        ${this.renderFilterOption('head', 'Head', '22')}
                        ${this.renderFilterOption('yonex', 'Yonex', '18')}
                        ${this.renderFilterOption('lacoste', 'Lacoste', '12')}
                        ${this.renderFilterOption('new-balance', 'New Balance', '10')}
                        ${this.renderFilterOption('asics', 'ASICS', '8')}
                        ${this.renderFilterOption('on', 'On', '6')}
                    </div>
                </div>
                
                <div class="filter-group">
                    <h4 class="filter-title">Price Range</h4>
                    <div class="price-inputs">
                        <input type="number" id="minPriceInput" class="price-input" placeholder="Min" min="0">
                        <span class="price-separator">-</span>
                        <input type="number" id="maxPriceInput" class="price-input" placeholder="Max" min="0">
                    </div>
                </div>
                
                <button class="btn btn-ghost" id="clearFiltersBtn">Clear All Filters</button>
            </aside>
        `;
    }

    renderFilterOption(value, label, count) {
        return `
            <label class="filter-option">
                <input type="checkbox" value="${value}" class="filter-checkbox">
                <span class="filter-label">${label}</span>
                <span class="filter-count">(${count})</span>
            </label>
        `;
    }

    renderProductCard(product, options = {}) {
        const { isFavorited = false, isInCart = false } = options;
        
        const badges = [];
        if (product.discount > 0) {
            badges.push(`<div class="product-badge badge-secondary">${product.discount}% OFF</div>`);
        }
        if (product.isNew) {
            badges.push(`<div class="product-badge badge-success">NEW</div>`);
        }
        if (!product.inStock) {
            badges.push(`<div class="product-badge badge-error">OUT OF STOCK</div>`);
        }

        return `
            <article class="product-card card" data-product-id="${product.id}" onclick="app.showProductModal(${product.id})">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${this.escapeHtml(product.name)}" class="product-image" loading="lazy">
                    ${badges.join('')}
                    <div class="product-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); app.toggleFavorite(${product.id})" title="Add to favorites">
                            <i class="fas fa-heart ${isFavorited ? 'favorited' : ''}" aria-hidden="true"></i>
                        </button>
                        <button class="action-btn" onclick="event.stopPropagation(); app.showProductModal(${product.id})" title="Quick view">
                            <i class="fas fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brandDisplay.toUpperCase()}</div>
                    <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${this.renderStars(product.rating)}
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
                        <button class="btn btn-primary add-to-cart-btn" onclick="event.stopPropagation(); app.addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="btn ${isFavorited ? 'btn-secondary' : 'btn-ghost'} add-to-favorites-btn" onclick="event.stopPropagation(); app.toggleFavorite(${product.id})">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    renderCarouselProductCard(product) {
        return `
            <article class="product-card card" onclick="app.showProductModal(${product.id})">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}" alt="${this.escapeHtml(product.name)}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brandDisplay.toUpperCase()}</div>
                    <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice > product.price ?
                            `<span class="original-price">$${product.originalPrice}</span>` : ''}
                        ${product.discount > 0 ?
                            `<span class="discount-percent">-${product.discount}%</span>` : ''}
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" onclick="event.stopPropagation(); app.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                        Add to Cart
                    </button>
                </div>
            </article>
        `;
    }