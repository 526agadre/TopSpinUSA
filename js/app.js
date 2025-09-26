// app.js - Main Application Entry Point
import { ProductManager } from './modules/ProductManager.js';
import { CartManager } from './modules/CartManager.js';
import { AuthManager } from './modules/AuthManager.js';
import { UIManager } from './modules/UIManager.js';
import { ComponentRenderer } from './modules/ComponentRenderer.js';
import { EventHandler } from './modules/EventHandler.js';
import { StorageManager } from './modules/StorageManager.js';

class TopSpinUSA {
    constructor() {
        this.version = '2.0.0';
        this.debug = false;
        
        // Initialize managers
        this.storage = new StorageManager();
        this.productManager = new ProductManager();
        this.cartManager = new CartManager(this.storage);
        this.authManager = new AuthManager(this.storage);
        this.uiManager = new UIManager();
        this.componentRenderer = new ComponentRenderer();
        this.eventHandler = new EventHandler(this);
        
        // Application state
        this.state = {
            currentPage: 1,
            productsPerPage: 12,
            currentFilters: {
                category: [],
                brand: [],
                priceRange: [0, 500]
            },
            searchQuery: '',
            sortBy: 'featured',
            viewMode: 'grid'
        };
        
        this.init();
    }

    async init() {
        try {
            this.log('Initializing TopSpinUSA application...');
            
            // Check if we're on products page for different page size
            if (this.isProductsPage()) {
                this.state.productsPerPage = 24;
            }
            
            // Initialize components in order
            await this.loadInitialData();
            this.renderComponents();
            this.setupEventListeners();
            this.updateUI();
            
            this.log('Application initialized successfully');
        } catch (error) {
            this.handleError('Failed to initialize application', error);
        }
    }

    async loadInitialData() {
        try {
            // Generate products
            await this.productManager.generateProducts();
            
            // Load user data
            this.authManager.loadUser();
            
            // Load cart and favorites
            this.cartManager.loadCart();
            this.cartManager.loadFavorites();
            
        } catch (error) {
            this.handleError('Failed to load initial data', error);
        }
    }

    renderComponents() {
        // Render header
        const headerElement = document.getElementById('main-header');
        if (headerElement) {
            headerElement.innerHTML = this.componentRenderer.renderHeader();
        }

        // Render footer
        const footerElement = document.getElementById('main-footer');
        if (footerElement) {
            footerElement.innerHTML = this.componentRenderer.renderFooter();
        }

        // Render modals
        const modalsContainer = document.getElementById('modals-container');
        if (modalsContainer) {
            modalsContainer.innerHTML = this.componentRenderer.renderModals();
        }

        // Render section components
        this.renderSectionComponents();
    }

    renderSectionComponents() {
        // New arrivals section
        const newArrivalsSection = document.getElementById('new-arrivals');
        if (newArrivalsSection) {
            newArrivalsSection.innerHTML = this.componentRenderer.renderNewArrivals(
                this.productManager.getNewProducts()
            );
        }

        // Featured products section
        const featuredSection = document.getElementById('featured-products');
        if (featuredSection) {
            featuredSection.innerHTML = this.componentRenderer.renderFeaturedProducts(
                this.productManager.getFeaturedProducts()
            );
        }

        // Products section
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
            productsSection.innerHTML = this.componentRenderer.renderProductsSection();
        }

        // Render products grid
        this.renderProducts();
    }

    setupEventListeners() {
        this.eventHandler.setupAllEventListeners();
    }

    // Product Management
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const filteredProducts = this.getFilteredProducts();
        const paginatedProducts = this.getPaginatedProducts(filteredProducts);

        productsGrid.innerHTML = paginatedProducts
            .map(product => this.componentRenderer.renderProductCard(product, {
                isFavorited: this.cartManager.isFavorited(product.id),
                isInCart: this.cartManager.isInCart(product.id)
            }))
            .join('');

        this.renderPagination(filteredProducts.length);
        this.updateFilterCounts();
    }

    getFilteredProducts() {
        return this.productManager.getFilteredProducts({
            searchQuery: this.state.searchQuery,
            filters: this.state.currentFilters,
            sortBy: this.state.sortBy
        });
    }

    getPaginatedProducts(products) {
        const startIndex = (this.state.currentPage - 1) * this.state.productsPerPage;
        const endIndex = startIndex + this.state.productsPerPage;
        return products.slice(startIndex, endIndex);
    }

    renderPagination(totalProducts) {
        const paginationElement = document.getElementById('pagination');
        if (!paginationElement) return;

        const totalPages = Math.ceil(totalProducts / this.state.productsPerPage);
        paginationElement.innerHTML = this.componentRenderer.renderPagination(
            this.state.currentPage,
            totalPages
        );
    }

    updateFilterCounts() {
        const products = this.productManager.getAllProducts();
        this.uiManager.updateFilterCounts(products);
    }

    // Search and Filtering
    performSearch(query) {
        this.state.searchQuery = query;
        this.state.currentPage = 1;
        this.renderProducts();
    }

    applyFilters(filters) {
        this.state.currentFilters = { ...this.state.currentFilters, ...filters };
        this.state.currentPage = 1;
        this.renderProducts();
    }

    clearFilters() {
        this.state.currentFilters = {
            category: [],
            brand: [],
            priceRange: [0, 500]
        };
        this.state.currentPage = 1;
        this.uiManager.resetFilterUI();
        this.renderProducts();
    }

    setSortBy(sortBy) {
        this.state.sortBy = sortBy;
        this.state.currentPage = 1;
        this.renderProducts();
    }

    setViewMode(mode) {
        this.state.viewMode = mode;
        this.uiManager.updateViewMode(mode);
    }

    goToPage(page) {
        const totalProducts = this.getFilteredProducts().length;
        const totalPages = Math.ceil(totalProducts / this.state.productsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.state.currentPage = page;
            this.renderProducts();
            this.scrollToProducts();
        }
    }

    // Cart Operations
    addToCart(productId, options = {}) {
        const product = this.productManager.getProduct(productId);
        if (!product || !product.inStock) {
            this.showToast('Product is out of stock', 'error');
            return;
        }

        this.cartManager.addToCart(product, options);
        this.updateCartUI();
        this.showToast(`${product.name} added to cart!`, 'success');
    }

    removeFromCart(productId) {
        const product = this.productManager.getProduct(productId);
        this.cartManager.removeFromCart(productId);
        this.updateCartUI();
        this.showToast(`${product?.name || 'Item'} removed from cart`, 'info');
    }

    updateCartQuantity(productId, quantity) {
        this.cartManager.updateQuantity(productId, quantity);
        this.updateCartUI();
        
        if (quantity <= 0) {
            this.removeFromCart(productId);
        }
    }

    toggleFavorite(productId) {
        const product = this.productManager.getProduct(productId);
        const wasFavorited = this.cartManager.isFavorited(productId);
        
        this.cartManager.toggleFavorite(productId);
        this.updateFavoritesUI();
        
        const message = wasFavorited ? 'Removed from favorites' : 'Added to favorites';
        this.showToast(message, wasFavorited ? 'info' : 'success');
        
        // Re-render products to update heart icons
        this.renderProducts();
    }

    // Authentication
    async signIn(credentials) {
        try {
            await this.authManager.signIn(credentials);
            this.updateUserUI();
            this.uiManager.hideModal('authModal');
            this.showToast(`Welcome back, ${this.authManager.user.name}!`, 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async signUp(userData) {
        try {
            await this.authManager.signUp(userData);
            this.updateUserUI();
            this.uiManager.hideModal('authModal');
            this.showToast(`Welcome, ${this.authManager.user.name}!`, 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    signOut() {
        this.authManager.signOut();
        this.updateUserUI();
        this.showToast('Signed out successfully', 'info');
    }

    // UI Updates
    updateUI() {
        this.updateCartUI();
        this.updateFavoritesUI();
        this.updateUserUI();
    }

    updateCartUI() {
        const cartCount = this.cartManager.getTotalItems();
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    updateFavoritesUI() {
        const favoritesCount = this.cartManager.getFavoritesCount();
        const favoritesCountElement = document.getElementById('favoritesCount');
        if (favoritesCountElement) {
            favoritesCountElement.textContent = favoritesCount;
        }
    }

    updateUserUI() {
        const user = this.authManager.user;
        this.uiManager.updateUserInterface(user);
    }

    // Modal Management
    showProductModal(productId) {
        const product = this.productManager.getProduct(productId);
        if (!product) return;

        const modalContent = this.componentRenderer.renderProductModal(product, {
            isFavorited: this.cartManager.isFavorited(productId),
            isInCart: this.cartManager.isInCart(productId)
        });

        this.uiManager.showModal('productModal', modalContent);
    }

    showCartModal() {
        const cartItems = this.cartManager.getCartItems();
        const modalContent = this.componentRenderer.renderCartModal(cartItems);
        this.uiManager.showModal('cartModal', modalContent);
    }

    showAuthModal(type = 'signin') {
        const modalContent = this.componentRenderer.renderAuthModal(type);
        this.uiManager.showModal('authModal', modalContent);
    }

    // Checkout Process
    async proceedToCheckout() {
        if (this.cartManager.isEmpty()) {
            this.showToast('Your cart is empty', 'error');
            return;
        }

        if (!this.authManager.isAuthenticated()) {
            this.showAuthModal('signin');
            this.showToast('Please sign in to continue', 'info');
            return;
        }

        const cartItems = this.cartManager.getCartItems();
        const modalContent = this.componentRenderer.renderCheckoutModal(cartItems);
        this.uiManager.showModal('paymentModal', modalContent);
    }

    async processPayment(paymentData) {
        try {
            this.uiManager.showLoading();
            
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Clear cart
            this.cartManager.clearCart();
            
            this.uiManager.hideLoading();
            this.uiManager.hideAllModals();
            this.updateCartUI();
            
            this.showToast('Order placed successfully! Thank you for your purchase.', 'success');
        } catch (error) {
            this.uiManager.hideLoading();
            this.showToast('Payment failed. Please try again.', 'error');
        }
    }

    // Newsletter
    subscribeNewsletter(email) {
        // In a real app, this would make an API call
        this.showToast('Thank you for subscribing to our newsletter!', 'success');
        
        const emailInput = document.getElementById('newsletterEmail');
        if (emailInput) {
            emailInput.value = '';
        }
    }

    // Utility Methods
    showToast(message, type = 'info') {
        this.uiManager.showToast(message, type);
    }

    scrollToProducts() {
        const element = document.getElementById('products-heading') || document.getElementById('productsGrid');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    isProductsPage() {
        try {
            const path = window.location.pathname.toLowerCase();
            return path.endsWith('/products.html') || path.includes('products');
        } catch (e) {
            return false;
        }
    }

    log(message, data = null) {
        if (this.debug) {
            console.log(`[TopSpinUSA] ${message}`, data || '');
        }
    }

    handleError(message, error) {
        console.error(`[TopSpinUSA Error] ${message}:`, error);
        this.showToast('Something went wrong. Please try again.', 'error');
    }

    // Public API for global access
    getAPI() {
        return {
            addToCart: (id, options) => this.addToCart(id, options),
            removeFromCart: (id) => this.removeFromCart(id),
            toggleFavorite: (id) => this.toggleFavorite(id),
            showProductModal: (id) => this.showProductModal(id),
            showCartModal: () => this.showCartModal(),
            showAuthModal: (type) => this.showAuthModal(type),
            goToPage: (page) => this.goToPage(page),
            performSearch: (query) => this.performSearch(query),
            applyFilters: (filters) => this.applyFilters(filters),
            clearFilters: () => this.clearFilters(),
            setSortBy: (sortBy) => this.setSortBy(sortBy),
            setViewMode: (mode) => this.setViewMode(mode),
            subscribeNewsletter: (email) => this.subscribeNewsletter(email),
            signIn: (credentials) => this.signIn(credentials),
            signUp: (userData) => this.signUp(userData),
            signOut: () => this.signOut(),
            proceedToCheckout: () => this.proceedToCheckout(),
            processPayment: (data) => this.processPayment(data)
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TopSpinUSA();
    
    // Expose API globally for onclick handlers and external access
    window.app = app.getAPI();
    window.TopSpinUSA = app;
});

export default TopSpinUSA;