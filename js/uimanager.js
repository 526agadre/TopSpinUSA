// modules/UIManager.js - User Interface Management

export class UIManager {
    constructor() {
        this.activeModals = new Set();
        this.toastContainer = null;
        this.loadingOverlay = null;
        this.toastCounter = 0;
    }

    // Modal Management
    showModal(modalId, content = null) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with id '${modalId}' not found`);
            return false;
        }

        // Update content if provided
        if (content && typeof content === 'string') {
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = content;
            }
        }

        // Add to active modals
        this.activeModals.add(modalId);

        // Show modal
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');

        // Focus management
        this.focusModal(modal);

        // Add escape key listener
        this.addModalEscapeListener(modalId);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return true;
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            return false;
        }

        // Remove from active modals
        this.activeModals.delete(modalId);

        // Hide modal
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');

        // Restore body scroll if no modals are active
        if (this.activeModals.size === 0) {
            document.body.style.overflow = '';
        }

        // Remove escape key listener
        this.removeModalEscapeListener();

        return true;
    }

    hideAllModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            this.hideModal(modal.id);
        });
        this.activeModals.clear();
        document.body.style.overflow = '';
    }

    focusModal(modal) {
        // Focus first focusable element in modal
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    addModalEscapeListener(modalId) {
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal(modalId);
            }
        };
        
        document.addEventListener('keydown', escapeHandler);
        this.currentEscapeHandler = escapeHandler;
    }

    removeModalEscapeListener() {
        if (this.currentEscapeHandler) {
            document.removeEventListener('keydown', this.currentEscapeHandler);
            this.currentEscapeHandler = null;
        }
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 5000) {
        if (!this.toastContainer) {
            this.toastContainer = document.getElementById('toastContainer');
            if (!this.toastContainer) {
                console.warn('Toast container not found');
                return;
            }
        }

        const toastId = `toast-${++this.toastCounter}`;
        const toast = this.createToastElement(toastId, message, type);
        
        this.toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            this.removeToast(toastId);
        }, duration);

        return toastId;
    }

    createToastElement(id, message, type) {
        const toast = document.createElement('div');
        toast.id = id;
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${icon} toast-icon"></i>
                <span class="toast-message">${this.escapeHtml(message)}</span>
                <button class="toast-close" onclick="window.TopSpinUSA?.uiManager?.removeToast('${id}')" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        return toast;
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }

    clearAllToasts() {
        if (this.toastContainer) {
            this.toastContainer.innerHTML = '';
        }
        this.toastCounter = 0;
    }

    // Loading States
    showLoading(message = 'Loading...') {
        if (!this.loadingOverlay) {
            this.loadingOverlay = document.getElementById('loadingOverlay');
        }

        if (this.loadingOverlay) {
            const loadingText = this.loadingOverlay.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = message;
            }
            
            this.loadingOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('show');
            
            // Only restore scroll if no modals are active
            if (this.activeModals.size === 0) {
                document.body.style.overflow = '';
            }
        }
    }

    // User Interface Updates
    updateUserInterface(user) {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const signinBtn = document.getElementById('signinBtn');
        const signupBtn = document.getElementById('signupBtn');
        const signoutBtn = document.getElementById('signoutBtn');
        const profileBtn = document.getElementById('profileBtn');
        const ordersBtn = document.getElementById('ordersBtn');

        if (user) {
            // Authenticated state
            if (userName) userName.textContent = user.name;
            if (userEmail) userEmail.textContent = user.email;
            
            this.setElementDisplay(signinBtn, 'none');
            this.setElementDisplay(signupBtn, 'none');
            this.setElementDisplay(signoutBtn, 'block');
            this.setElementDisplay(profileBtn, 'block');
            this.setElementDisplay(ordersBtn, 'block');
        } else {
            // Guest state
            if (userName) userName.textContent = 'Guest';
            if (userEmail) userEmail.textContent = 'Sign in to your account';
            
            this.setElementDisplay(signinBtn, 'block');
            this.setElementDisplay(signupBtn, 'block');
            this.setElementDisplay(signoutBtn, 'none');
            this.setElementDisplay(profileBtn, 'none');
            this.setElementDisplay(ordersBtn, 'none');
        }
    }

    updateViewMode(mode) {
        const productsGrid = document.getElementById('productsGrid');
        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');

        if (productsGrid) {
            if (mode === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        }

        if (gridViewBtn && listViewBtn) {
            if (mode === 'list') {
                gridViewBtn.classList.remove('active');
                listViewBtn.classList.add('active');
            } else {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
            }
        }
    }

    updateFilterCounts(products) {
        // Update category filter counts
        const categoryCheckboxes = document.querySelectorAll('.filter-checkbox[value]');
        categoryCheckboxes.forEach(checkbox => {
            const value = checkbox.value;
            const countElement = checkbox.parentElement?.querySelector('.filter-count');
            if (countElement) {
                const count = products.filter(p => p.category === value).length;
                countElement.textContent = `(${count})`;
            }
        });

        // Update brand filter counts