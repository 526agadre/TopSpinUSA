/**
 * TopSpinUSA - Main JavaScript
 * Handles interactive elements, dynamic content loading, and UI logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Utility Functions ---

    /**
     * Toggles a class on an element.
     * @param {string} selector - CSS selector of the element.
     * @param {string} className - Class name to toggle.
     */
    const toggleClass = (selector, className = 'active') => {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.toggle(className);
        }
    };

    /**
     * Toggles the display of a dropdown/modal.
     * @param {HTMLElement} btnElement - The button that triggers the toggle.
     * @param {HTMLElement} containerElement - The container/menu element.
     * @param {string} activeClass - The class to toggle on the button/parent.
     */
    const setupDropdownToggle = (btnElement, containerElement, activeClass = 'active') => {
        if (!btnElement || !containerElement) return;

        const toggleDropdown = (event) => {
            event.stopPropagation();
            btnElement.parentElement.classList.toggle(activeClass);
        };

        const closeDropdown = (event) => {
            if (!containerElement.contains(event.target) && event.target !== btnElement) {
                btnElement.parentElement.classList.remove(activeClass);
            }
        };

        btnElement.addEventListener('click', toggleDropdown);
        document.addEventListener('click', closeDropdown);
    };

    // --- Header / Navigation Logic ---

    // User Menu Dropdown
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.querySelector('.user-menu');
    setupDropdownToggle(userBtn, userMenu, 'active');

    // Category Menu Dropdown
    const allCategoriesBtn = document.getElementById('allCategoriesBtn');
    const categoryDropdown = document.querySelector('.category-dropdown');
    setupDropdownToggle(allCategoriesBtn, categoryDropdown, 'active');

    // Price Range Filter in Header
    const priceRangeInput = document.getElementById('priceRange');
    const maxPriceDisplay = document.getElementById('maxPrice');
    if (priceRangeInput && maxPriceDisplay) {
        priceRangeInput.addEventListener('input', (event) => {
            maxPriceDisplay.textContent = `$${event.target.value}`;
        });
    }

    // --- Hero Section Actions ---

    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            // Smooth scroll to the main product section
            document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Dynamic Product Loading (Simulated) ---

    // Sample product data for demonstration
    const sampleProducts = [
        { id: 1, brand: 'Wilson', name: 'Blade 98 V8', price: 249, rating: 4.8, image: 'https://images.unsplash.com/photo-1547347559-3ec9cdbd3f3a?q=80&w=600&auto=format&fit=crop', category: 'rackets' },
        { id: 2, brand: 'Nike', name: 'Vapor Pro 2', price: 120, rating: 4.5, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop', category: 'shoes' },
        { id: 3, brand: 'Babolat', name: 'Pure Aero', price: 269, rating: 4.7, image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600&auto=format&fit=crop', category: 'rackets' },
        { id: 4, brand: 'Adidas', name: 'Court Jam Control', price: 95, rating: 4.2, image: 'https://images.unsplash.com/photo-1582582621959-48b09c554f79?q=80&w=600&auto=format&fit=crop', category: 'shoes' },
        { id: 5, brand: 'Head', name: 'Speed Pro', price: 239, rating: 4.6, image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?q=80&w=600&auto=format&fit=crop', category: 'rackets' },
        { id: 6, brand: 'ASICS', name: 'Gel-Resolution 9', price: 150, rating: 4.9, image: 'https://images.unsplash.com/photo-1581012778430-3f22b4f5baf4?q=80&w=600&auto=format&fit=crop', category: 'shoes' },
    ];

    /**
     * Creates the HTML string for a product card.
     * @param {object} product - Product data object.
     * @returns {string} HTML string.
     */
    const createProductCard = (product) => {
        return `
            <article class="product-card" data-id="${product.id}" role="gridcell">
                <a href="product-detail.html?id=${product.id}">
                    <div class="product-image-container">
                        <img class="product-image" src="${product.image}" alt="${product.brand} ${product.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-brand">${product.brand}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price"><span class="current-price">$${product.price}</span></div>
                        <div class="product-rating" aria-label="Rating: ${product.rating} stars">
                            ${'★'.repeat(Math.floor(product.rating))}
                            <span style="color: ${product.rating < 5 ? '#ccc' : 'inherit'}">
                                ${'★'.repeat(5 - Math.floor(product.rating))}
                            </span>
                        </div>
                    </div>
                </a>
            </article>
        `;
    };

    /**
     * Renders products to a specified container.
     * @param {HTMLElement} container - The DOM element to render into.
     * @param {Array<object>} products - The array of product objects.
     */
    const renderProducts = (container, products) => {
        if (container) {
            container.innerHTML = products.map(createProductCard).join('');
        }
    };

    // Render Featured Products (first 4)
    const featuredContainer = document.getElementById('featuredProducts');
    renderProducts(featuredContainer, sampleProducts.slice(0, 4));

    // Render All Products (all of them)
    const productsGridContainer = document.getElementById('productsGrid');
    // NOTE: In a real app, this would be an API call with pagination/filtering applied
    renderProducts(productsGridContainer, sampleProducts.concat(sampleProducts)); // Duplicate for a fuller grid look


    // --- View Controls (Grid/List Toggle) ---

    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');

    const toggleView = (viewType) => {
        if (!productsGridContainer) return;

        if (viewType === 'list') {
            productsGridContainer.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        } else {
            productsGridContainer.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        }
    };

    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => toggleView('grid'));
    }
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => toggleView('list'));
    }

    // --- Filter Sidebar Controls ---

    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const filterCheckboxes = document.querySelectorAll('.filters-sidebar .filter-checkbox');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            filterCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            // In a real app, trigger the main product filter/fetch function here
            console.log("Filters cleared. Triggering product refresh.");
        });
    }

    // --- Authentication Modal Logic ---

    const authModal = document.getElementById('authModal');
    const authModalClose = document.getElementById('authModalClose');
    const signinTab = document.getElementById('signinTab');
    const signupTab = document.getElementById('signupTab');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const signinBtnHeader = document.getElementById('signinBtn');
    const signupBtnHeader = document.getElementById('signupBtn');
    const userDropdown = document.getElementById('userDropdown');

    const openModal = (targetTabId = 'signinForm') => {
        authModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
        showAuthTab(targetTabId);
    };

    const closeModal = () => {
        authModal.classList.remove('open');
        document.body.style.overflow = '';
    };

    const showAuthTab = (targetId) => {
        // Reset tabs
        signinTab.classList.remove('active');
        signupTab.classList.remove('active');
        signinForm.style.display = 'none';
        signupForm.style.display = 'none';

        // Activate target tab and form
        if (targetId === 'signinForm') {
            signinTab.classList.add('active');
            signinForm.style.display = 'block';
        } else if (targetId === 'signupForm') {
            signupTab.classList.add('active');
            signupForm.style.display = 'block';
        }
    };

    if (authModal && authModalClose) {
        authModalClose.addEventListener('click', closeModal);
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) { // Close when clicking outside the content
                closeModal();
            }
        });

        signinTab.addEventListener('click', () => showAuthTab('signinForm'));
        signupTab.addEventListener('click', () => showAuthTab('signupForm'));

        if (signinBtnHeader) {
            signinBtnHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.remove('active'); // Close user dropdown
                openModal('signinForm');
            });
        }
        if (signupBtnHeader) {
            signupBtnHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.remove('active'); // Close user dropdown
                openModal('signupForm');
            });
        }
    }

    // Optional: Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;
            console.log(`Newsletter subscription attempt for: ${email}`);
            alert(`Thank you for subscribing, ${email}!`);
            newsletterForm.reset();
        });
    }

});