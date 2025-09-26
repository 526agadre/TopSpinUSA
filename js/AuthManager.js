// modules/AuthManager.js - Authentication Management

export class AuthManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.user = null;
        this.userKey = 'topspin_user';
        this.sessionKey = 'topspin_session';
        this.tokenKey = 'topspin_token';
    }

    // Load user from storage
    loadUser() {
        try {
            const userData = this.storage.getItem(this.userKey);
            if (userData) {
                this.user = JSON.parse(userData);
                this.validateUser();
            }
        } catch (error) {
            console.warn('Failed to load user data:', error);
            this.clearUserData();
        }
    }

    // Validate stored user data
    validateUser() {
        if (!this.user || !this.user.id || !this.user.email) {
            this.clearUserData();
            return false;
        }

        // Check if session is expired
        const sessionData = this.getSession();
        if (sessionData && sessionData.expiresAt < Date.now()) {
            this.clearUserData();
            return false;
        }

        return true;
    }

    // Sign in with email and password
    async signIn(credentials) {
        const { email, password } = credentials;
        
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Mock user data for demo
            const userData = this.createMockUser(email);
            
            await this.setUser(userData);
            return userData;
        } catch (error) {
            throw new Error('Sign in failed. Please check your credentials.');
        }
    }

    // Sign up new user
    async signUp(userData) {
        const { name, email, password, confirmPassword } = userData;
        
        // Validation
        if (!name || name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters');
        }

        if (!email || !this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Create new user
            const newUser = this.createMockUser(email, name);
            
            await this.setUser(newUser);
            return newUser;
        } catch (error) {
            throw new Error('Sign up failed. Please try again.');
        }
    }

    // Google OAuth sign in
    async signInWithGoogle(googleResponse) {
        try {
            // Decode JWT token
            const payload = JSON.parse(atob(googleResponse.credential.split('.')[1]));
            
            const userData = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                provider: 'google',
                verified: true,
                createdAt: new Date().toISOString()
            };
            
            await this.setUser(userData);
            return userData;
        } catch (error) {
            throw new Error('Google sign in failed');
        }
    }

    // Sign out
    signOut() {
        this.clearUserData();
        
        // Revoke Google OAuth if applicable
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.revoke(this.user?.email || '');
        }
    }

    // Set user data and create session
    async setUser(userData) {
        this.user = {
            ...userData,
            lastLogin: new Date().toISOString()
        };

        // Create session
        const sessionData = {
            userId: this.user.id,
            createdAt: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
            token: this.generateSessionToken()
        };

        // Save to storage
        this.storage.setItem(this.userKey, JSON.stringify(this.user));
        this.storage.setItem(this.sessionKey, JSON.stringify(sessionData));
        this.storage.setItem(this.tokenKey, sessionData.token);
    }

    // Clear user data
    clearUserData() {
        this.user = null;
        this.storage.removeItem(this.userKey);
        this.storage.removeItem(this.sessionKey);
        this.storage.removeItem(this.tokenKey);
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.user !== null && this.validateUser();
    }

    // Get user session
    getSession() {
        try {
            const sessionData = this.storage.getItem(this.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            return null;
        }
    }

    // Get auth token
    getToken() {
        return this.storage.getItem(this.tokenKey);
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const allowedFields = ['name', 'email', 'phone', 'address', 'preferences'];
        const validUpdates = {};
        
        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                validUpdates[key] = updates[key];
            }
        });

        if (validUpdates.email && !this.isValidEmail(validUpdates.email)) {
            throw new Error('Invalid email address');
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Update user data
            this.user = {
                ...this.user,
                ...validUpdates,
                updatedAt: new Date().toISOString()
            };
            
            this.storage.setItem(this.userKey, JSON.stringify(this.user));
            return this.user;
        } catch (error) {
            throw new Error('Failed to update profile');
        }
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        if (!currentPassword || !newPassword) {
            throw new Error('Current and new passwords are required');
        }

        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters');
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // In a real app, this would verify the current password
            // and update it on the server
            
            return true;
        } catch (error) {
            throw new Error('Failed to change password');
        }
    }

    // Reset password
    async resetPassword(email) {
        if (!email || !this.isValidEmail(email)) {
            throw new Error('Valid email address is required');
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // In a real app, this would send a reset email
            return { message: 'Password reset email sent' };
        } catch (error) {
            throw new Error('Failed to send reset email');
        }
    }

    // Get user preferences
    getUserPreferences() {
        return this.user?.preferences || {
            theme: 'light',
            notifications: true,
            newsletter: true,
            language: 'en'
        };
    }

    // Update user preferences
    async updatePreferences(preferences) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const currentPrefs = this.getUserPreferences();
        const updatedPrefs = { ...currentPrefs, ...preferences };

        return await this.updateProfile({ preferences: updatedPrefs });
    }

    // Get user orders (mock)
    async getUserOrders() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            await this.simulateApiCall();
            
            // Mock orders data
            return [
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    status: 'delivered',
                    total: 159.99,
                    items: [
                        { name: 'Nike Court Advantage Tee', quantity: 1, price: 45 },
                        { name: 'Wilson Pro Staff Racket', quantity: 1, price: 114.99 }
                    ]
                },
                {
                    id: 'ORD-002',
                    date: '2024-01-08',
                    status: 'shipped',
                    total: 89.99,
                    items: [
                        { name: 'Adidas Barricade Shoes', quantity: 1, price: 89.99 }
                    ]
                }
            ];
        } catch (error) {
            throw new Error('Failed to load orders');
        }
    }

    // Utility methods
    createMockUser(email, name = null) {
        const firstName = name ? name.split(' ')[0] : email.split('@')[0];
        const lastName = name ? name.split(' ').slice(1).join(' ') : '';
        
        return {
            id: Date.now().toString(),
            email,
            name: name || firstName,
            firstName,
            lastName,
            picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=1a365d&color=fff`,
            provider: 'email',
            verified: false,
            createdAt: new Date().toISOString(),
            preferences: {
                theme: 'light',
                notifications: true,
                newsletter: true,
                language: 'en'
            }
        };
    }

    generateSessionToken() {
        return Math.random().toString(36).substring(2) + 
               Math.random().toString(36).substring(2) +
               Date.now().toString(36);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simulate API call with random delay and occasional failure
    async simulateApiCall(failureRate = 0.05) {
        const delay = Math.random() * 1000 + 500; // 500-1500ms delay
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        if (Math.random() < failureRate) {
            throw new Error('Network error');
        }
    }

    // Check if user has specific role/permission
    hasPermission(permission) {
        if (!this.isAuthenticated()) {
            return false;
        }

        // Mock permission system
        const userPermissions = this.user.permissions || ['user'];
        return userPermissions.includes(permission) || userPermissions.includes('admin');
    }

    // Get user's full display name
    getDisplayName() {
        if (!this.user) return 'Guest';
        return this.user.name || this.user.firstName || this.user.email.split('@')[0];
    }

    // Get user avatar URL
    getAvatarUrl() {
        if (!this.user) return null;
        return this.user.picture || 
               `https://ui-avatars.com/api/?name=${encodeURIComponent(this.getDisplayName())}&background=1a365d&color=fff`;
    }
}