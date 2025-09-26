// modules/EventHandler.js - Event Management

export class EventHandler {
    constructor(app) {
        this.app = app;
        this.boundHandlers = new Map();
        this.setupGlobalEventListeners();
    }

    setupAllEventListeners() {
        this.setupSearchEventListeners();
        this.setupNavigationEventListeners();
        this.setupFilterEventListeners();
        this.setupModalEventListeners();
        this.setupFormEventListeners();
        this.setupUIEventListeners();
    }

    setupGlobalEventListeners() {
        // Click outside handler for dropdowns
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));
    }

    setupSearchEventListeners() {
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.getElementById('searchInput');

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchInput?.value?.trim() || '';
                this.app.performSearch(query);
            });
        }

        if (searchInput) {
            // Debounced search as user types
            searchInput.addEventListener('input', this.debounce((e) => {
                const query = e.target.value.trim();
                if (query.length >= 2 || query.length === 0) {
                    this.app.performSearch(query);
                }
            }, 300));
        }
    }

    setupNavigationEventListeners() {
        // Category navigation
        const categoryBtn = document.getElementById('allCategoriesBtn');
        if (categoryBtn) {
            categoryBtn.addEventListener('click', () => {
                this.app.uiManager.toggleDropdown('categoryMenu');
            });
        }

        // Category links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-link')) {
                e.preventDefault();
                const category = e.target.dataset.category;
                if (category) {
                    this.app.applyFilters({ category: [category] });
                    this.app.uiManager.closeDropdowns();
                }
            }
        });

        // User dropdown
        const userBtn = document.getElementById('userBtn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                this.app.uiManager.toggleDropdown('userDropdown');
            });
        }

        // Brand filter
        const brandFilter = document.getElementById('brandFilter');
        if (brandFilter) {
            brandFilter.addEventListener('change', (e) => {
                const brand = e.target.value;
                this.app.applyFilters({ brand: brand ? [brand] : [] });
            });
        }

        // Price range filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                const maxPrice = parseInt(e.target.value);
                const maxPriceLabel = document.getElementById('maxPrice');
                if (maxPriceLabel) {
                    maxPriceLabel.textContent = `${maxPrice}`;
                }
                
                this.app.applyFilters({ 
                    priceRange: [this.app.state.currentFilters.priceRange[0], maxPrice] 
                });
            });
        }

        // Hero buttons
        const shopNowBtn = document.getElementById('shopNowBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', () => {
                this.app.scrollToProducts();
            });
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                this.app.showToast('Learn more about our premium tennis equipment!', 'info');
            });
        }
    }

    setupFilterEventListeners() {
        // Filter checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('filter-checkbox')) {
                this.updateCheckboxFilters();
            }
        });

        // Price inputs
        const minPriceInput = document.getElementById('minPriceInput');
        const maxPriceInput = document.getElementById('maxPriceInput');

        if (minPriceInput) {
            minPriceInput.addEventListener('change', (e) => {
                const minPrice = parseInt(e.target.value) || 0;
                this.app.applyFilters({
                    priceRange: [minPrice, this.app.state.currentFilters.priceRange[1]]
                });
            });
        }

        if (maxPriceInput) {
            maxPriceInput.addEventListener('change', (e) => {
                const maxPrice = parseInt(e.target.value) || 500;
                this.app.applyFilters({
                    priceRange: [this.app.state.currentFilters.priceRange[0], maxPrice]
                });
                
                // Update range slider
                const priceRange = document.getElementById('priceRange');
                if (priceRange) {
                    priceRange.value = maxPrice;
                }
                
                // Update label
                const maxPriceLabel = document.getElementById('maxPrice');
                if (maxPriceLabel) {
                    maxPriceLabel.textContent = `${maxPrice}`;
                }
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.app.clearFilters();
            });
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.app.setSortBy(e.target.value);
            });
        }

        // View mode buttons
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');

        if (gridView) {
            gridView.addEventListener('click', () => {
                this.app.setViewMode('grid');
            });
        }

        if (listView) {
            listView.addEventListener('click', () => {
                this.app.setViewMode('list');
            });
        }
    }

    setupModalEventListeners() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.app.showCartModal();
            });
        }

        // Favorites button
        const favoritesBtn = document.getElementById('favoritesBtn');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                // Show favorites as filtered products
                this.app.state.currentFilters = {
                    category: [],
                    brand: [],
                    priceRange: [0, 500]
                };
                this.app.state.searchQuery = '';
                
                // Filter to show only favorited products
                const favoriteIds = this.app.cartManager.getFavorites();
                const favoriteProducts = this.app.productManager.getAllProducts()
                    .filter(p => favoriteIds.includes(p.id));
                
                if (favoriteProducts.length === 0) {
                    this.app.showToast('No favorites yet. Add some products to your favorites!', 'info');
                } else {
                    // Temporarily override filtered products to show favorites
                    const originalMethod = this.app.getFilteredProducts;
                    this.app.getFilteredProducts = () => favoriteProducts;
                    this.app.renderProducts();
                    this.app.getFilteredProducts = originalMethod;
                    
                    this.app.showToast('Showing your favorite products', 'info');
                    this.app.scrollToProducts();
                }
            });
        }

        // Auth buttons
        const signinBtn = document.getElementById('signinBtn');
        const signupBtn = document.getElementById('signupBtn');
        const signoutBtn = document.getElementById('signoutBtn');

        if (signinBtn) {
            signinBtn.addEventListener('click', () => {
                this.app.showAuthModal('signin');
            });
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                this.app.showAuthModal('signup');
            });
        }

        if (signoutBtn) {
            signoutBtn.addEventListener('click', () => {
                this.app.signOut();
            });
        }

        // Modal close buttons and overlay clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                (e.target.classList.contains('modal') && e.target === e.currentTarget)) {
                const modal = e.target.closest('.modal') || e.target;
                this.app.uiManager.hideModal(modal.id);
            }
        });
    }

    setupFormEventListeners() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('newsletterEmail')?.value?.trim();
                if (email) {
                    this.app.subscribeNewsletter(email);
                }
            });
        }

        // Auth forms (delegated event handling for dynamic content)
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'emailSigninForm') {
                e.preventDefault();
                this.handleSigninForm(e.target);
            } else if (e.target.id === 'emailSignupForm') {
                e.preventDefault();
                this.handleSignupForm(e.target);
            }
        });

        // Auth tab switching
        document.addEventListener('click', (e) => {
            if (e.target.id === 'signinTab') {
                this.switchAuthTab('signin');
            } else if (e.target.id === 'signupTab') {
                this.switchAuthTab('signup');
            }
        });
    }

    setupUIEventListeners() {
        // Toast close buttons (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.toast-close')) {
                const toast = e.target.closest('.toast');
                if (toast) {
                    this.app.uiManager.removeToast(toast.id);
                }
            }
        });

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.hash) {
                const targetElement = document.querySelector(e.target.hash);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Event handler methods
    handleOutsideClick(e) {
        // Close dropdowns when clicking outside
        if (!e.target.closest('.dropdown') && !e.target.closest('.user-menu')) {
            this.app.uiManager.closeDropdowns();
        }
    }

    handleKeyboardNavigation(e) {
        // Escape key to close modals and dropdowns
        if (e.key === 'Escape') {
            if (this.app.uiManager.activeModals.size > 0) {
                // Close the most recently opened modal
                const modals = Array.from(this.app.uiManager.activeModals);
                const lastModal = modals[modals.length - 1];
                this.app.uiManager.hideModal(lastModal);
            } else {
                this.app.uiManager.closeDropdowns();
            }
        }

        // Enter key for search
        if (e.key === 'Enter' && e.target.id === 'searchInput') {
            e.preventDefault();
            const query = e.target.value.trim();
            this.app.performSearch(query);
        }
    }

    handleWindowResize() {
        // Update UI based on screen size changes
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Close any open dropdowns on mobile
            this.app.uiManager.closeDropdowns();
        }
    }

    updateCheckboxFilters() {
        const categoryCheckboxes = document.querySelectorAll('.filter-checkbox[value]');
        const checkedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        this.app.applyFilters({ category: checkedCategories });
    }

    async handleSigninForm(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || document.getElementById('signinEmail')?.value;
        const password = formData.get('password') || document.getElementById('signinPassword')?.value;

        if (!email || !password) {
            this.app.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            await this.app.signIn({ email, password });
        } catch (error) {
            this.app.showToast(error.message, 'error');
        }
    }

    async handleSignupForm(form) {
        const formData = new FormData(form);
        const name = formData.get('name') || document.getElementById('signupName')?.value;
        const email = formData.get('email') || document.getElementById('signupEmail')?.value;
        const password = formData.get('password') || document.getElementById('signupPassword')?.value;
        const confirmPassword = formData.get('confirmPassword') || document.getElementById('signupConfirmPassword')?.value;

        if (!name || !email || !password || !confirmPassword) {
            this.app.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            await this.app.signUp({ name, email, password, confirmPassword });
        } catch (error) {
            this.app.showToast(error.message, 'error');
        }
    }

    switchAuthTab(type) {
        const signinTab = document.getElementById('signinTab');
        const signupTab = document.getElementById('signupTab');
        const signinForm = document.getElementById('signinForm');
        const signupForm = document.getElementById('signupForm');
        const modalTitle = document.getElementById('authModalTitle');

        if (type === 'signin') {
            signinTab?.classList.add('active');
            signupTab?.classList.remove('active');
            if (signinForm) signinForm.style.display = 'block';
            if (signupForm) signupForm.style.display = 'none';
            if (modalTitle) modalTitle.textContent = 'Sign In to TopSpinUSA';
        } else {
            signupTab?.classList.add('active');
            signinTab?.classList.remove('active');
            if (signupForm) signupForm.style.display = 'block';
            if (signinForm) signinForm.style.display = 'none';
            if (modalTitle) modalTitle.textContent = 'Create Your Account';
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Clean up event listeners
    destroy() {
        // Remove global event listeners
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleKeyboardNavigation);
        window.removeEventListener('resize', this.handleWindowResize);
        
        // Clear stored handlers
        this.boundHandlers.clear();
    }
}