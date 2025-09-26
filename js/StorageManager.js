// modules/StorageManager.js - Local Storage Management

export class StorageManager {
    constructor() {
        this.storageAvailable = this.checkStorageAvailability();
        this.prefix = 'topspin_';
        this.maxSize = 5 * 1024 * 1024; // 5MB limit
    }

    // Check if localStorage is available
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('LocalStorage is not available, using memory storage fallback');
            this.memoryStorage = new Map();
            return false;
        }
    }

    // Get item from storage
    getItem(key) {
        const fullKey = this.prefix + key;
        
        if (this.storageAvailable) {
            try {
                const item = localStorage.getItem(fullKey);
                
                if (item === null) {
                    return null;
                }

                // Try to parse as JSON, fallback to string
                try {
                    const parsed = JSON.parse(item);
                    
                    // Check if item has expiration
                    if (parsed && typeof parsed === 'object' && parsed.__expires) {
                        if (Date.now() > parsed.__expires) {
                            this.removeItem(key);
                            return null;
                        }
                        return parsed.__value;
                    }
                    
                    return parsed;
                } catch (e) {
                    return item; // Return as string if not valid JSON
                }
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        } else {
            // Fallback to memory storage
            return this.memoryStorage.get(fullKey) || null;
        }
    }

    // Set item in storage
    setItem(key, value, expirationMs = null) {
        const fullKey = this.prefix + key;
        
        try {
            let storageValue = value;
            
            // Add expiration if specified
            if (expirationMs) {
                storageValue = {
                    __value: value,
                    __expires: Date.now() + expirationMs
                };
            }
            
            const serializedValue = JSON.stringify(storageValue);
            
            // Check size limit
            if (serializedValue.length > this.maxSize) {
                throw new Error('Data too large for storage');
            }
            
            if (this.storageAvailable) {
                localStorage.setItem(fullKey, serializedValue);
            } else {
                this.memoryStorage.set(fullKey, serializedValue);
            }
            
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
                console.warn('Storage quota exceeded, attempting cleanup');
                this.cleanup();
                
                // Try again after cleanup
                try {
                    const serializedValue = JSON.stringify(value);
                    if (this.storageAvailable) {
                        localStorage.setItem(fullKey, serializedValue);
                    } else {
                        this.memoryStorage.set(fullKey, serializedValue);
                    }
                    return true;
                } catch (e2) {
                    console.error('Storage failed even after cleanup:', e2);
                    return false;
                }
            } else {
                console.error('Error writing to storage:', e);
                return false;
            }
        }
    }

    // Remove item from storage
    removeItem(key) {
        const fullKey = this.prefix + key;
        
        try {
            if (this.storageAvailable) {
                localStorage.removeItem(fullKey);
            } else {
                this.memoryStorage.delete(fullKey);
            }
            return true;
        } catch (e) {
            console.error('Error removing from storage:', e);
            return false;
        }
    }

    // Clear all application data
    clear() {
        try {
            if (this.storageAvailable) {
                // Remove only our app's keys
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith(this.prefix)) {
                        localStorage.removeItem(key);
                    }
                });
            } else {
                this.memoryStorage.clear();
            }
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }

    // Get all keys for this application
    getKeys() {
        const keys = [];
        
        try {
            if (this.storageAvailable) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.prefix)) {
                        keys.push(key.substring(this.prefix.length));
                    }
                }
            } else {
                this.memoryStorage.forEach((value, key) => {
                    if (key.startsWith(this.prefix)) {
                        keys.push(key.substring(this.prefix.length));
                    }
                });
            }
        } catch (e) {
            console.error('Error getting keys:', e);
        }
        
        return keys;
    }

    // Check if key exists
    hasItem(key) {
        return this.getItem(key) !== null;
    }

    // Get storage usage statistics
    getStorageStats() {
        let totalSize = 0;
        let itemCount = 0;
        const itemSizes = {};
        
        try {
            if (this.storageAvailable) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.prefix)) {
                        const value = localStorage.getItem(key);
                        const size = value ? value.length : 0;
                        totalSize += size;
                        itemCount++;
                        itemSizes[key.substring(this.prefix.length)] = size;
                    }
                }
            } else {
                this.memoryStorage.forEach((value, key) => {
                    if (key.startsWith(this.prefix)) {
                        const size = typeof value === 'string' ? value.length : JSON.stringify(value).length;
                        totalSize += size;
                        itemCount++;
                        itemSizes[key.substring(this.prefix.length)] = size;
                    }
                });
            }
        } catch (e) {
            console.error('Error getting storage stats:', e);
        }
        
        return {
            totalSize,
            itemCount,
            itemSizes,
            percentUsed: (totalSize / this.maxSize) * 100,
            available: this.storageAvailable
        };
    }

    // Clean up expired items
    cleanup() {
        const keys = this.getKeys();
        let cleanedCount = 0;
        
        keys.forEach(key => {
            const item = this.getItem(key);
            if (item === null) {
                // Item was expired and already removed by getItem
                cleanedCount++;
            }
        });
        
        console.log(`Cleaned up ${cleanedCount} expired items`);
        return cleanedCount;
    }

    // Backup data to JSON
    exportData() {
        const data = {};
        const keys = this.getKeys();
        
        keys.forEach(key => {
            const value = this.getItem(key);
            if (value !== null) {
                data[key] = value;
            }
        });
        
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data
        };
    }

    // Restore data from JSON
    importData(backup) {
        try {
            if (!backup || !backup.data || !backup.version) {
                throw new Error('Invalid backup format');
            }
            
            let importCount = 0;
            
            Object.entries(backup.data).forEach(([key, value]) => {
                try {
                    if (this.setItem(key, value)) {
                        importCount++;
                    }
                } catch (e) {
                    console.warn(`Failed to import ${key}:`, e);
                }
            });
            
            console.log(`Imported ${importCount} items`);
            return importCount;
        } catch (e) {
            console.error('Error importing data:', e);
            return 0;
        }
    }

    // Batch operations for better performance
    setMultiple(items) {
        const results = {};
        
        Object.entries(items).forEach(([key, value]) => {
            results[key] = this.setItem(key, value);
        });
        
        return results;
    }

    getMultiple(keys) {
        const results = {};
        
        keys.forEach(key => {
            results[key] = this.getItem(key);
        });
        
        return results;
    }

    removeMultiple(keys) {
        const results = {};
        
        keys.forEach(key => {
            results[key] = this.removeItem(key);
        });
        
        return results;
    }

    // Utility methods for common data types
    setObject(key, obj) {
        return this.setItem(key, obj);
    }

    getObject(key, defaultValue = null) {
        const value = this.getItem(key);
        return value !== null ? value : defaultValue;
    }

    setArray(key, arr) {
        return this.setItem(key, arr);
    }

    getArray(key, defaultValue = []) {
        const value = this.getItem(key);
        return Array.isArray(value) ? value : defaultValue;
    }

    setNumber(key, num) {
        return this.setItem(key, num);
    }

    getNumber(key, defaultValue = 0) {
        const value = this.getItem(key);
        return typeof value === 'number' ? value : defaultValue;
    }

    setString(key, str) {
        return this.setItem(key, str);
    }

    getString(key, defaultValue = '') {
        const value = this.getItem(key);
        return typeof value === 'string' ? value : defaultValue;
    }

    setBoolean(key, bool) {
        return this.setItem(key, bool);
    }

    getBoolean(key, defaultValue = false) {
        const value = this.getItem(key);
        return typeof value === 'boolean' ? value : defaultValue;
    }

    // Cache management
    setCache(key, data, ttlSeconds = 3600) {
        return this.setItem(key, data, ttlSeconds * 1000);
    }

    getCache(key) {
        return this.getItem(key);
    }

    clearCache(pattern = null) {
        const keys = this.getKeys();
        let clearedCount = 0;
        
        keys.forEach(key => {
            if (!pattern || key.includes(pattern)) {
                if (this.removeItem(key)) {
                    clearedCount++;
                }
            }
        });
        
        return clearedCount;
    }

    // Event-like notifications for storage changes
    onChange(callback) {
        if (this.storageAvailable) {
            window.addEventListener('storage', (e) => {
                if (e.key && e.key.startsWith(this.prefix)) {
                    const key = e.key.substring(this.prefix.length);
                    callback({
                        key,
                        oldValue: e.oldValue,
                        newValue: e.newValue,
                        storageArea: e.storageArea
                    });
                }
            });
        }
    }

    // Migrate data between versions
    migrate(migrations) {
        const currentVersion = this.getNumber('_version', 0);
        let migrationCount = 0;
        
        migrations.forEach(migration => {
            if (migration.version > currentVersion) {
                try {
                    migration.up(this);
                    migrationCount++;
                    this.setNumber('_version', migration.version);
                } catch (e) {
                    console.error(`Migration ${migration.version} failed:`, e);
                }
            }
        });
        
        return migrationCount;
    }
}