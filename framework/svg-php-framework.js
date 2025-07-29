/*
 * SVG+PHP Framework - Minimal JavaScript Core
 * Provides essential functionality with CSS-first approach
 * Based on successful todo.php.svg modernization
 * Version: 1.0.0
 */

// ==========================================================================
// CORE FRAMEWORK CLASS
// ==========================================================================

class SVGPHPFramework {
  constructor() {
    this.components = new Map();
    this.eventListeners = new Map();
    this.data = new Map();
    
    // Initialize framework when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  // Initialize framework
  init() {
    console.log('SVG+PHP Framework initialized');
    this.bindAutoEvents();
    this.setupComponents();
  }

  // ==========================================================================
  // ELEMENT CREATION (SVG Context Compatible)
  // ==========================================================================

  // Create HTML element with proper namespace for SVG context
  createElement(tagName, attributes = {}, styles = {}) {
    const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    // Set styles (avoid template literals in SVG context)
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
    
    return element;
  }

  // Create container with framework classes
  createContainer(className = 'svg-content-container', attributes = {}) {
    return this.createElement('div', {
      class: className,
      ...attributes
    });
  }

  // Create input with framework styling
  createInput(type = 'text', placeholder = '', className = 'svg-input') {
    return this.createElement('input', {
      type: type,
      placeholder: placeholder,
      class: className
    });
  }

  // Create button with framework styling
  createButton(text, onClick, className = 'svg-btn-primary') {
    const button = this.createElement('button', {
      class: className
    });
    button.textContent = text;
    if (onClick) button.onclick = onClick;
    return button;
  }

  // Create select dropdown
  createSelect(options = [], className = 'svg-select') {
    const select = this.createElement('select', {
      class: className
    });
    
    options.forEach(option => {
      const optionElement = this.createElement('option', {
        value: option.value || option
      });
      optionElement.textContent = option.text || option;
      select.appendChild(optionElement);
    });
    
    return select;
  }

  // ==========================================================================
  // DATA MANAGEMENT
  // ==========================================================================

  // Set data
  setData(key, value) {
    this.data.set(key, value);
    this.saveToLocalStorage(key, value);
  }

  // Get data
  getData(key, defaultValue = null) {
    if (this.data.has(key)) {
      return this.data.get(key);
    }
    
    // Try to load from localStorage
    const stored = this.loadFromLocalStorage(key);
    if (stored !== null) {
      this.data.set(key, stored);
      return stored;
    }
    
    return defaultValue;
  }

  // Save to localStorage
  saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(`svg-php-${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  // Load from localStorage
  loadFromLocalStorage(key) {
    try {
      const item = localStorage.getItem(`svg-php-${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return null;
    }
  }

  // ==========================================================================
  // LIST MANAGEMENT (Common Pattern)
  // ==========================================================================

  // Generic list manager
  createListManager(containerId, itemRenderer) {
    return {
      container: document.getElementById(containerId),
      items: [],
      
      add: (item) => {
        this.items.push(item);
        this.render();
      },
      
      remove: (id) => {
        this.items = this.items.filter(item => item.id !== id);
        this.render();
      },
      
      update: (id, updatedItem) => {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...updatedItem };
          this.render();
        }
      },
      
      render: () => {
        if (!this.container) return;
        
        // Clear container
        this.container.innerHTML = '';
        
        if (this.items.length === 0) {
          this.container.innerHTML = '<div class="svg-text-muted svg-text-center svg-margin-top-large">No items yet</div>';
          return;
        }
        
        // Render items
        this.items.forEach(item => {
          const element = itemRenderer(item);
          this.container.appendChild(element);
        });
      }
    };
  }

  // ==========================================================================
  // FORM HELPERS
  // ==========================================================================

  // Get form data from container
  getFormData(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return {};
    
    const data = {};
    const inputs = container.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.id) {
        data[input.id] = input.value;
      }
    });
    
    return data;
  }

  // Reset form in container
  resetForm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inputs = container.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
  }

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================

  // Generate unique ID
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Format date
  formatDate(date) {
    return new Date(date).toLocaleDateString();
  }

  // Format time
  formatTime(date) {
    return new Date(date).toLocaleTimeString();
  }

  // Debounce function
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

  // ==========================================================================
  // EVENT SYSTEM
  // ==========================================================================

  // Auto-bind events based on data attributes
  bindAutoEvents() {
    // Find elements with data-svg-click
    document.querySelectorAll('[data-svg-click]').forEach(element => {
      const handler = element.getAttribute('data-svg-click');
      if (window[handler] && typeof window[handler] === 'function') {
        element.onclick = window[handler];
      }
    });
  }

  // Set up framework components
  setupComponents() {
    // Auto-initialize containers
    document.querySelectorAll('.svg-content-container').forEach(container => {
      container.classList.add('svg-fade-in');
    });
  }

  // ==========================================================================
  // EXPORT/IMPORT HELPERS
  // ==========================================================================

  // Export data as JSON
  exportAsJSON(data, filename = 'export.json') {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create temporary link and trigger download
    const tempLink = this.createElement('a', {
      href: url,
      download: filename,
      style: 'display: none;'
    });
    
    document.body.appendChild(tempLink);
    
    // Use setTimeout to ensure the link is in DOM before clicking
    setTimeout(() => {
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    }, 10);
  }

  // Import JSON data
  importFromJSON(callback) {
    const input = this.createElement('input', {
      type: 'file',
      accept: '.json',
      style: 'display: none;'
    });
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            callback(data);
          } catch (error) {
            console.error('Failed to parse JSON:', error);
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }
}

// ==========================================================================
// GLOBAL INSTANCE
// ==========================================================================

// Create global instance
window.SVGPHPFramework = new SVGPHPFramework();

// Shortcut alias
window.SPF = window.SVGPHPFramework;

// ==========================================================================
// COMMON HELPER FUNCTIONS
// ==========================================================================

// Quick element creation
function spfElement(tagName, attributes = {}, styles = {}) {
  return window.SPF.createElement(tagName, attributes, styles);
}

// Quick container creation
function spfContainer(className, attributes = {}) {
  return window.SPF.createContainer(className, attributes);
}

// Quick input creation
function spfInput(type, placeholder, className) {
  return window.SPF.createInput(type, placeholder, className);
}

// Quick button creation
function spfButton(text, onClick, className) {
  return window.SPF.createButton(text, onClick, className);
}

// Quick select creation
function spfSelect(options, className) {
  return window.SPF.createSelect(options, className);
}

console.log('SVG+PHP Framework loaded successfully');
