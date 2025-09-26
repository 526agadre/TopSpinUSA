// modules/ProductManager.js - Product Management Module

export class ProductManager {
    constructor() {
        this.products = [];
        this.categories = {
            rackets: ['Pro Staff', 'Pure Drive', 'Aero', 'Blade', 'Clash', 'Speed', 'Gravity', 'Radical', 'Prestige', 'Extreme'],
            shoes: ['Air Zoom', 'Court', 'Barricade', 'Defiant', 'Solution', 'Gel Resolution', 'Court FF', 'Vapor', 'Zoom'],
            shirts: ['Dri-FIT', 'Aeroready', 'Court', 'Essential', 'Classic', 'Performance', 'Comfort', 'Active', 'Sport'],
            shorts: ['Court', 'Dri-FIT', 'Aeroready', 'Essential', 'Classic', 'Performance', 'Comfort', 'Active'],
            jackets: ['Windbreaker', 'Fleece', 'Puffer', 'Softshell', 'Rain', 'Thermal', 'Bomber', 'Track'],
            balls: ['Pressurized Tennis Balls', 'Practice Ball Can', 'Pressureless Ball Set', 'Can of 3 Balls'],
            bags: ['Racket Backpack', 'Tournament Bag', 'Duffel Bag', 'Racket Tote']
        };
        
        this.brands = {
            apparel: ['Nike', 'Adidas', 'Lacoste', 'Fila', 'New Balance', 'Asics', 'On'],
            equipment: ['Wilson', 'Babolat', 'Head', 'Yonex']
        };
        
        this.colors = ['Black', 'White', 'Navy', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Gray'];
    }

    async generateProducts() {
        let productId = 1;
        const allBrands = [...this.brands.apparel, ...this.brands.equipment];

        // Generate products for each category
        Object.keys(this.categories).forEach(category => {
            this.categories[category].forEach(productName => {
                const relevantBrands = this.getRelevantBrands(category);
                
                relevantBrands.forEach(brand => {
                    const product = this.createProduct(productId++, category, productName, brand);
                    this.products.push(product);
                });
            });
        });

        // Ensure we have between 200-250 products
        this.adjustProductCount();
        
        // Set featured and new products
        this.setSpecialProducts();
        
        return this.products;
    }

    createProduct(id, category, productName, brand) {
        const basePrice = this.getBasePrice(category, brand);
        const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0;
        const currentPrice = Math.floor(basePrice * (1 - discount / 100));
        const originalPrice = discount > 0 ? basePrice : currentPrice;

        return {
            id,
            name: `${brand} ${productName}`,
            brand: brand.toLowerCase().replace(' ', '-'),
            brandDisplay: brand,
            category,
            price: currentPrice,
            originalPrice,
            discount,
            image: this.getProductImage(id, category),
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            reviewCount: Math.floor(Math.random() * 500) + 10,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            sizes: this.getSizes(category),
            description: this.getDescription(brand, productName, category),
            features: this.getFeatures(category, brand),
            inStock: Math.random() > 0.1,
            isNew: Math.random() > 0.8,
            isFeatured: false, // Will be set later
            tags: this.getTags(category, brand),
            sku: this.generateSKU(brand, category, id),
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
        };
    }

    getRelevantBrands(category) {
        const apparelCategories = ['shirts', 'shorts', 'jackets', 'shoes'];
        const equipmentCategories = ['rackets', 'balls', 'bags'];
        
        if (apparelCategories.includes(category)) {
            return this.brands.apparel;
        } else if (equipmentCategories.includes(category)) {
            return this.brands.equipment;
        }
        
        return [...this.brands.apparel, ...this.brands.equipment];
    }

    getBasePrice(category, brand) {
        const basePrices = {
            rackets: { 'Wilson': 220, 'Babolat': 200, 'Head': 210, 'Yonex': 190, 'default': 180 },
            shoes: { 'Nike': 140, 'Adidas': 130, 'Asics': 120, 'New Balance': 110, 'default': 100 },
            shirts: { 'Lacoste': 80, 'Nike': 65, 'Adidas': 60, 'default': 45 },
            shorts: { 'Lacoste': 70, 'Nike': 55, 'Adidas': 50, 'default': 35 },
            jackets: { 'Nike': 120, 'Adidas': 110, 'Lacoste': 150, 'default': 90 },
            balls: { 'Wilson': 15, 'Babolat': 12, 'Head': 12, 'Yonex': 12, 'default': 10 },
            bags: { 'Wilson': 100, 'Babolat': 90, 'Head': 95, 'default': 75 }
        };
        
        const categoryPrices = basePrices[category];
        return categoryPrices[brand] || categoryPrices['default'] || 50;
    }

    getProductImage(id, category) {
        // Use different image services for variety
        const services = [
            `https://picsum.photos/400/400?random=${id}`,
            `https://source.unsplash.com/400x400/?tennis,${category}&sig=${id}`,
            `https://picsum.photos/seed/${category}${id}/400/400`
        ];
        
        return services[id % services.length];
    }

    getSizes(category) {
        const sizeMapping = {
            rackets: ['4 1/4', '4 3/8', '4 1/2', '4 5/8'],
            shoes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
            shirts: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            shorts: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            jackets: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            balls: ['Standard'],
            bags: ['One Size']
        };
        
        return sizeMapping[category] || ['One Size'];
    }

    getDescription(brand, productName, category) {
        const templates = {
            rackets: `The ${brand} ${productName} delivers exceptional performance for serious tennis players. Engineered with advanced technology for power, control, and precision.`,
            shoes: `Step up your game with the ${brand} ${productName}. Designed for court performance with superior comfort, stability, and traction.`,
            shirts: `The ${brand} ${productName} combines performance and style. Made with moisture-wicking technology to keep you cool and comfortable on court.`,
            shorts: `Professional-grade ${brand} ${productName} designed for peak performance. Features comfortable fit and advanced fabric technology.`,
            jackets: `Stay warm and stylish with the ${brand} ${productName}. Perfect for warming up or casual wear, combining function with fashion.`,
            balls: `High-quality ${brand} ${productName} for consistent play. Perfect bounce and durability for practice and competitive matches.`,
            bags: `The ${brand} ${productName} keeps your gear organized and protected. Durable construction with thoughtful design for tennis players.`
        };
        
        return templates[category] || `Premium ${brand} ${productName} - designed for tennis excellence.`;
    }

    getFeatures(category, brand) {
        const featureMap = {
            rackets: [
                'Advanced carbon fiber construction',
                'Precision string pattern',
                'Comfortable grip technology',
                'Professional tournament approved',
                'Enhanced sweet spot',
                'Vibration dampening system'
            ],
            shoes: [
                'Breathable mesh upper',
                'Responsive cushioning',
                'Non-marking outsole',
                'Lightweight construction',
                'Enhanced court grip',
                'Ankle support technology'
            ],
            shirts: [
                'Moisture-wicking fabric',
                'UV sun protection',
                'Quick-dry technology',
                'Athletic fit design',
                'Flatlock seams',
                'Anti-odor treatment'
            ],
            shorts: [
                'Elastic waistband with drawstring',
                'Moisture-wicking properties',
                'Multiple pockets',
                'Comfortable athletic fit',
                'Quick-dry fabric',
                'Freedom of movement design'
            ],
            jackets: [
                'Water-resistant coating',
                'Breathable fabric',
                'Lightweight construction',
                'Packable design',
                'Full zip closure',
                'Athletic fit'
            ],
            balls: [
                'ITF approved',
                'Consistent bounce',
                'Tournament quality felt',
                'Pressurized core',
                'All court surface',
                'Professional grade'
            ],
            bags: [
                'Multiple compartments',
                'Padded racket section',
                'Comfortable shoulder straps',
                'Durable water-resistant material',
                'Ventilated shoe compartment',
                'External accessory pockets'
            ]
        };
        
        const categoryFeatures = featureMap[category] || ['High-quality', 'Durable', 'Professional'];
        return categoryFeatures.slice(0, 4);
    }

    getTags(category, brand) {
        const tags = ['tennis', category, brand.toLowerCase()];
        
        if (category === 'rackets') tags.push('equipment', 'professional');
        if (category === 'shoes') tags.push('footwear', 'court');
        if (['shirts', 'shorts', 'jackets'].includes(category)) tags.push('apparel', 'clothing');
        
        return tags;
    }

    generateSKU(brand, category, id) {
        const brandCode = brand.substring(0, 3).toUpperCase();
        const categoryCode = category.substring(0, 3).toUpperCase();
        return `${brandCode}-${categoryCode}-${String(id).padStart(4, '0')}`;
    }

    adjustProductCount() {
        const MIN_PRODUCTS = 200;
        const MAX_PRODUCTS = 250;

        if (this.products.length > MAX_PRODUCTS) {
            this.products = this.products.slice(0, MAX_PRODUCTS);
        } else if (this.products.length < MIN_PRODUCTS) {
            // Duplicate existing products with variations
            let nextId = Math.max(...this.products.map(p => p.id)) + 1;
            const originalProducts = [...this.products];
            let i = 0;
            
            while (this.products.length < MIN_PRODUCTS && originalProducts.length > 0) {
                const src = originalProducts[i % originalProducts.length];
                const variation = this.createProductVariation(src, nextId++);
                this.products.push(variation);
                i++;
            }
        }
    }

    createProductVariation(originalProduct, newId) {
        const variations = ['Pro', 'Elite', 'Plus', 'Advanced', 'Premium', 'Sport'];
        const variation = variations[Math.floor(Math.random() * variations.length)];
        
        return {
            ...originalProduct,
            id: newId,
            name: `${originalProduct.name} ${variation}`,
            price: originalProduct.price + Math.floor(Math.random() * 30) - 15,
            originalPrice: originalProduct.originalPrice + Math.floor(Math.random() * 30) - 15,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            sku: this.generateSKU(originalProduct.brandDisplay, originalProduct.category, newId),
            inStock: Math.random() > 0.05
        };
    }

    setSpecialProducts() {
        // Set featured products (top 5% by rating)
        const sortedByRating = [...this.products].sort((a, b) => b.rating - a.rating);
        const featuredCount = Math.ceil(this.products.length * 0.05);
        
        sortedByRating.slice(0, featuredCount).forEach(product => {
            product.isFeatured = true;
        });

        // Ensure new products are recent (last 3 months)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        this.products.forEach(product => {
            if (product.isNew && product.createdAt < threeMonthsAgo) {
                product.isNew = false;
            }
        });
    }

    // Query methods
    getAllProducts() {
        return [...this.products];
    }

    getProduct(id) {
        return this.products.find(p => p.id === parseInt(id));
    }

    getFeaturedProducts(limit = 8) {
        return this.products
            .filter(p => p.isFeatured)
            .slice(0, limit);
    }

    getNewProducts(limit = 8) {
        return this.products
            .filter(p => p.isNew)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    }

    getProductsByCategory(category, limit = null) {
        const products = this.products.filter(p => p.category === category);
        return limit ? products.slice(0, limit) : products;
    }

    getProductsByBrand(brand, limit = null) {
        const products = this.products.filter(p => p.brand === brand);
        return limit ? products.slice(0, limit) : products;
    }

    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.brandDisplay.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.tags.some(tag => tag.includes(lowercaseQuery))
        );
    }

    getFilteredProducts({ searchQuery = '', filters = {}, sortBy = 'featured' } = {}) {
        let filteredProducts = [...this.products];

        // Apply search filter
        if (searchQuery && searchQuery.length >= 2) {
            filteredProducts = this.searchProducts(searchQuery);
        }

        // Apply category filter
        if (filters.category && filters.category.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                filters.category.includes(product.category)
            );
        }

        // Apply brand filter
        if (filters.brand && filters.brand.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                filters.brand.includes(product.brand)
            );
        }

        // Apply price range filter
        if (filters.priceRange) {
            const [minPrice, maxPrice] = filters.priceRange;
            filteredProducts = filteredProducts.filter(product =>
                product.price >= minPrice && product.price <= maxPrice
            );
        }

        // Apply sorting
        return this.sortProducts(filteredProducts, sortBy);
    }

    sortProducts(products, sortBy) {
        switch (sortBy) {
            case 'price-low':
                return products.sort((a, b) => a.price - b.price);
            case 'price-high':
                return products.sort((a, b) => b.price - a.price);
            case 'name':
                return products.sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'rating':
                return products.sort((a, b) => b.rating - a.rating);
            case 'featured':
            default:
                return products.sort((a, b) => {
                    // Featured products first
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    // Then by rating
                    return b.rating - a.rating;
                });
        }
    }

    // Statistics methods
    getProductStats() {
        const totalProducts = this.products.length;
        const inStockProducts = this.products.filter(p => p.inStock).length;
        const featuredProducts = this.products.filter(p => p.isFeatured).length;
        const newProducts = this.products.filter(p => p.isNew).length;
        
        const categoryCounts = {};
        const brandCounts = {};
        
        this.products.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
            brandCounts[product.brandDisplay] = (brandCounts[product.brandDisplay] || 0) + 1;
        });

        const priceRange = {
            min: Math.min(...this.products.map(p => p.price)),
            max: Math.max(...this.products.map(p => p.price)),
            average: this.products.reduce((sum, p) => sum + p.price, 0) / totalProducts
        };

        return {
            totalProducts,
            inStockProducts,
            featuredProducts,
            newProducts,
            categoryCounts,
            brandCounts,
            priceRange
        };
    }

    getAvailableFilters() {
        const categories = [...new Set(this.products.map(p => p.category))];
        const brands = [...new Set(this.products.map(p => p.brand))];
        const priceRange = [
            Math.min(...this.products.map(p => p.price)),
            Math.max(...this.products.map(p => p.price))
        ];

        return {
            categories,
            brands,
            priceRange
        };
    }
}