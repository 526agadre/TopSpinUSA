// modules/CartManager.js - Shopping Cart and Favorites Management

export class CartManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.cart = [];
        this.favorites = [];
        this.cartKey = 'topspin_cart';
        this.favoritesKey = 'topspin_favorites';
    }

    // Load data from storage
    loadCart() {
        try {
            const cartData = this.storage.getItem(this.cartKey);
            this.cart = cartData ? JSON.parse(cartData) : [];
            this.validateCartItems();
        } catch (error) {
            console.warn('Failed to load cart data:', error);
            this.cart = [];
        }
    }

    loadFavorites() {
        try {
            const favoritesData = this.storage.getItem(this.favoritesKey);
            this.favorites = favoritesData ? JSON.parse(favoritesData) : [];
            this.validateFavorites();
        } catch (error) {
            console.warn('Failed to load favorites data:', error);
            this.favorites = [];
        }
    }

    // Validate and clean up stored data
    validateCartItems() {
        this.cart = this.cart.filter(item => 
            item && 
            typeof item.id === 'number' && 
            typeof item.quantity === 'number' && 
            item.quantity > 0 &&
            item.name &&
            typeof item.price === 'number'
        );
        this.saveCart();
    }

    validateFavorites() {
        this.favorites = this.favorites.filter(id => 
            typeof id === 'number' && id > 0
        );
        this.saveFavorites();
    }

    // Cart operations
    addToCart(product, options = {}) {
        if (!product || !product.id) {
            throw new Error('Invalid product');
        }

        if (!product.inStock) {
            throw new Error('Product is out of stock');
        }

        const { size, color, quantity = 1 } = options;
        
        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(item => 
            item.id === product.id && 
            item.selectedSize === size && 
            item.selectedColor === color
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            const cartItem = {
                id: product.id,
                name: product.name,
                brand: product.brandDisplay,
                category: product.category,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                image: product.image,
                selectedSize: size || (product.sizes && product.sizes[0]),
                selectedColor: color || product.color,
                quantity,
                inStock: product.inStock,
                addedAt: new Date().toISOString()
            };
            
            this.cart.push(cartItem);
        }

        this.saveCart();
        return this.getCartItem(product.id);
    }

    removeFromCart(productId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== productId);
        
        if (this.cart.length < initialLength) {
            this.saveCart();
            return true;
        }
        return false;
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        
        if (!item) {
            return false;
        }

        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }

        // Limit quantity to reasonable amount
        const maxQuantity = 99;
        item.quantity = Math.min(quantity, maxQuantity);
        
        this.saveCart();
        return true;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Favorites operations
    addToFavorites(productId) {
        if (!this.favorites.includes(productId)) {
            this.favorites.push(productId);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    removeFromFavorites(productId) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(id => id !== productId);
        
        if (this.favorites.length < initialLength) {
            this.saveFavorites();
            return true;
        }
        return false;
    }

    toggleFavorite(productId) {
        if (this.isFavorited(productId)) {
            return this.removeFromFavorites(productId);
        } else {
            return this.addToFavorites(productId);
        }
    }

    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
    }

    // Query methods
    getCartItems() {
        return [...this.cart];
    }

    getCartItem(productId) {
        return this.cart.find(item => item.id === productId);
    }

    getFavorites() {
        return [...this.favorites];
    }

    isInCart(productId) {
        return this.cart.some(item => item.id === productId);
    }

    isFavorited(productId) {
        return this.favorites.includes(productId);
    }

    isEmpty() {
        return this.cart.length === 0;
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getFavoritesCount() {
        return this.favorites.length;
    }

    // Cart calculations
    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalSavings() {
        return this.cart.reduce((total, item) => {
            if (item.originalPrice > item.price) {
                return total + ((item.originalPrice - item.price) * item.quantity);
            }
            return total;
        }, 0);
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        const freeShippingThreshold = 75;
        
        if (subtotal >= freeShippingThreshold) {
            return 0;
        }
        
        return 9.99;
    }

    getTax(taxRate = 0.08) {
        return Math.round(this.getSubtotal() * taxRate * 100) / 100;
    }

    getTotal(taxRate = 0.08) {
        return this.getSubtotal() + this.getShipping() + this.getTax(taxRate);
    }

    // Cart summary
    getCartSummary(taxRate = 0.08) {
        const subtotal = this.getSubtotal();
        const savings = this.getTotalSavings();
        const shipping = this.getShipping();
        const tax = this.getTax(taxRate);
        const total = this.getTotal(taxRate);
        const itemCount = this.getTotalItems();
        
        return {
            itemCount,
            subtotal,
            savings,
            shipping,
            tax,
            total,
            freeShippingEligible: shipping === 0,
            freeShippingRemaining: Math.max(0, 75 - subtotal)
        };
    }

    // Validation methods
    validateCartForCheckout() {
        const errors = [];
        
        if (this.cart.length === 0) {
            errors.push('Cart is empty');
        }

        this.cart.forEach((item, index) => {
            if (!item.inStock) {
                errors.push(`${item.name} is out of stock`);
            }
            
            if (item.quantity <= 0) {
                errors.push(`Invalid quantity for ${item.name}`);
            }
            
            if (!item.selectedSize && item.category !== 'balls' && item.category !== 'bags') {
                errors.push(`Please select a size for ${item.name}`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Cart comparison and merge (for user login)
    mergeCart(serverCart) {
        if (!Array.isArray(serverCart)) {
            return;
        }

        const mergedCart = [...this.cart];
        
        serverCart.forEach(serverItem => {
            const existingIndex = mergedCart.findIndex(item => 
                item.id === serverItem.id &&
                item.selectedSize === serverItem.selectedSize &&
                item.selectedColor === serverItem.selectedColor
            );

            if (existingIndex > -1) {
                // Merge quantities
                mergedCart[existingIndex].quantity += serverItem.quantity;
            } else {
                // Add server item
                mergedCart.push(serverItem);
            }
        });

        this.cart = mergedCart;
        this.saveCart();
    }

    mergeFavorites(serverFavorites) {
        if (!Array.isArray(serverFavorites)) {
            return;
        }

        const mergedFavorites = [...new Set([...this.favorites, ...serverFavorites])];
        this.favorites = mergedFavorites;
        this.saveFavorites();
    }

    // Storage methods
    saveCart() {
        try {
            this.storage.setItem(this.cartKey, JSON.stringify(this.cart));
        } catch (error) {
            console.error('Failed to save cart:', error);
        }
    }

    saveFavorites() {
        try {
            this.storage.setItem(this.favoritesKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    // Analytics and recommendations
    getCartAnalytics() {
        const categoryCount = {};
        const brandCount = {};
        let totalValue = 0;
        let totalSavings = 0;

        this.cart.forEach(item => {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + item.quantity;
            brandCount[item.brand] = (brandCount[item.brand] || 0) + item.quantity;
            totalValue += item.price * item.quantity;
            if (item.originalPrice > item.price) {
                totalSavings += (item.originalPrice - item.price) * item.quantity;
            }
        });

        return {
            categoryDistribution: categoryCount,
            brandDistribution: brandCount,
            totalValue,
            totalSavings,
            averageItemPrice: this.cart.length > 0 ? totalValue / this.getTotalItems() : 0
        };
    }

    getRecommendedCategories() {
        const analytics = this.getCartAnalytics();
        const categories = Object.keys(analytics.categoryDistribution);
        
        // Recommend complementary categories
        const recommendations = [];
        
        if (categories.includes('rackets') && !categories.includes('balls')) {
            recommendations.push('balls');
        }
        
        if (categories.includes('rackets') && !categories.includes('bags')) {
            recommendations.push('bags');
        }
        
        if ((categories.includes('shirts') || categories.includes('shorts')) && !categories.includes('shoes')) {
            recommendations.push('shoes');
        }
        
        return recommendations;
    }

    // Export/Import for backup
    exportData() {
        return {
            cart: this.cart,
            favorites: this.favorites,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
    }

    importData(data) {
        try {
            if (data && data.version === '1.0') {
                if (Array.isArray(data.cart)) {
                    this.cart = data.cart;
                    this.validateCartItems();
                }
                
                if (Array.isArray(data.favorites)) {
                    this.favorites = data.favorites;
                    this.validateFavorites();
                }
                
                return true;
            }
        } catch (error) {
            console.error('Failed to import data:', error);
        }
        
        return false;
    }
}