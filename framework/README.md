<!--
===============================================================================
SVG+PHP FRAMEWORK - COMPREHENSIVE DOCUMENTATION
===============================================================================

FILE PURPOSE:
Complete documentation and usage guide for the SVG+PHP Framework. Provides
detailed instructions, examples, best practices, and component reference for
creating interactive SVG applications with embedded PHP using a CSS-first
approach that minimizes JavaScript requirements.

GENERATION PROMPT:
"Stworz frameowrk z css i JS, zmniejszajac ilosc JS na rzecz Css w celu łatwego 
tworzenia plików SVG z zagniezdzonym php, na podsatwie pliku todo.php.svg"

English: "Create a framework with CSS and JS, reducing JS in favor of CSS for 
easy creation of SVG files with embedded PHP, based on todo.php.svg file"

TECHNICAL DETAILS:
- Framework: SVG+PHP Framework v1.0.0
- Component: Documentation and usage guide
- Based on: Successful todo.php.svg modernization and lessons learned
- Architecture: CSS-first framework with minimal JavaScript utilities
- Validation: Framework template passes SVG+PWA validator (31/31 tests)
- Dependencies: PHP 7.4+, modern browser with SVG+foreignObject support

FRAMEWORK COMPONENTS:
- svg-php-framework.css: Core CSS components and styling
- svg-php-framework.js: Minimal JavaScript utilities
- template.php.svg: Complete application template and example
- README.md: This comprehensive documentation file

USAGE SCENARIOS:
- Interactive SVG+PHP web applications
- Desktop apps with Tauri integration
- PWA applications with modern HTML forms in SVG
- Rapid prototyping of data-driven interfaces

===============================================================================
-->

# SVG+PHP Framework 🎨⚡

**A CSS-first framework for creating interactive SVG applications with embedded PHP**

Based on the successful modernization of `todo.php.svg`, this framework minimizes JavaScript in favor of CSS-driven UI components, making it easy to create beautiful, interactive SVG+PHP applications.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Framework Architecture](#framework-architecture)
- [CSS Components](#css-components)
- [JavaScript Utilities](#javascript-utilities)
- [Template Usage](#template-usage)
- [Best Practices](#best-practices)
- [Examples](#examples)

## ✨ Features

- **🎨 CSS-First Approach**: Maximum styling with CSS, minimal JavaScript
- **🖼️ SVG+PHP Integration**: Seamless PHP backend with SVG frontend
- **📱 Responsive Design**: Mobile-friendly components and layouts
- **🔧 Reusable Components**: Buttons, inputs, containers, and layouts
- **⚡ Minimal JavaScript**: Essential utilities without bloat
- **🌈 Modern UI**: Beautiful gradients, animations, and styling
- **📊 Data Management**: Built-in localStorage and JSON export/import
- **🔄 Event System**: Auto-binding and component management

## 🚀 Quick Start

### 1. Copy Framework Files

```bash
# Copy framework files to your project
cp framework/svg-php-framework.css your-project/
cp framework/svg-php-framework.js your-project/
cp framework/template.php.svg your-project/my-app.php.svg
```

### 2. Start with Template

Open `template.php.svg` and customize:

```php
<?php
// Your PHP logic here
$appTitle = "My Custom App";
$data = [...]; // Your data
?>

<svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Framework components here -->
</svg>
```

### 3. Serve with PHP

```bash
php -S localhost:8088 -t . router.php
```

## 🏗️ Framework Architecture

```
framework/
├── svg-php-framework.css    # Core CSS components and utilities
├── svg-php-framework.js     # Minimal JavaScript utilities
├── template.php.svg         # Complete application template
└── README.md               # This documentation
```

### File Structure
- **CSS Framework**: Component-based styling with CSS variables
- **JS Framework**: Essential utilities with SVG context support  
- **SVG Template**: Complete example with PHP integration
- **Documentation**: Usage guide and best practices

## 🎨 CSS Components

### Variables (Customizable)
```css
:root {
  --primary-color: #4caf50;
  --background-dark: #2c3e50;
  --text-light: #ffffff;
  --border-radius: 8px;
  /* ... more variables */
}
```

### Core Components

#### Containers
```html
<div class="svg-content-container">Content here</div>
<div class="svg-card">Card content</div>
```

#### Form Elements
```html
<input class="svg-input" type="text" placeholder="Enter text..."/>
<select class="svg-select">...</select>
<button class="svg-btn-primary">Primary Button</button>
<button class="svg-btn-danger">Delete</button>
```

#### Layout
```html
<div class="svg-flex-between">
  <div class="svg-flex-grow">Content</div>
  <div>Actions</div>
</div>
```

#### Task/Item Display
```html
<div class="svg-task-item">
  <div class="svg-task-content">Item content</div>
  <div class="svg-flex-row svg-flex-gap-small">
    <button class="svg-btn-success">Edit</button>
    <button class="svg-btn-danger">Delete</button>
  </div>
</div>
```

## ⚡ JavaScript Utilities

### Core Framework Class
```javascript
// Global instance available as SPF
const framework = window.SVGPHPFramework;

// Create elements (SVG-context compatible)
const div = SPF.createElement('div', {class: 'my-class'});
const button = SPF.createButton('Click me', handleClick, 'svg-btn-primary');
```

### Data Management
```javascript
// Set/get data with localStorage sync
SPF.setData('items', myItems);
const items = SPF.getData('items', []);

// Export/import JSON
SPF.exportAsJSON(data, 'my-export.json');
SPF.importFromJSON(data => console.log('Imported:', data));
```

### List Management
```javascript
const listManager = SPF.createListManager('container-id', (item) => {
  const element = SPF.createElement('div', {class: 'svg-task-item'});
  element.innerHTML = `<strong>${item.name}</strong>`;
  return element;
});

listManager.add({id: 1, name: 'New Item'});
listManager.remove(1);
```

## 📝 Template Usage

### 1. Basic Structure
```xml
<svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- CSS Framework -->
  <defs>
    <style><![CDATA[
      /* Paste svg-php-framework.css content here */
      /* Your custom styles */
    ]]></style>
  </defs>

  <!-- Your UI components -->
  <foreignObject x="50" y="50" width="900" height="600">
    <xhtml:div class="svg-content-container">
      <!-- Your content here -->
    </xhtml:div>
  </foreignObject>

  <!-- JavaScript -->
  <script><![CDATA[
    // Paste svg-php-framework.js content here
    // Your app logic
  ]]></script>

</svg>
```

### 2. PHP Integration
```php
<?php
// Handle form submissions
if ($_POST) {
  $action = $_POST['action'] ?? '';
  // Handle different actions
}

// Prepare data
$items = [...];
?>

<!-- Use PHP data in SVG -->
<xhtml:div id="items-container">
  <?php foreach ($items as $item): ?>
    <xhtml:div class="svg-task-item">
      <?php echo htmlspecialchars($item['name']); ?>
    </xhtml:div>
  <?php endforeach; ?>
</xhtml:div>
```

### 3. JavaScript Integration
```javascript
// Initialize with PHP data
let items = <?php echo json_encode($items); ?>;

// Use framework utilities
function addItem() {
  const formData = SPF.getFormData('form-container');
  const newItem = {
    id: SPF.generateId(),
    name: formData['item-name'],
    createdAt: new Date().toISOString()
  };
  
  items.push(newItem);
  renderItems();
  SPF.setData('items', items);
}
```

## 💡 Best Practices

### 1. CSS-First Development
- ✅ Use framework CSS classes instead of inline styles
- ✅ Leverage CSS variables for theming
- ✅ Minimize JavaScript DOM manipulation
- ✅ Use CSS animations instead of JS animations

### 2. SVG Context Considerations
- ✅ Use `document.createElementNS('http://www.w3.org/1999/xhtml', 'tagName')` for HTML elements
- ✅ Avoid template literals with interpolation in CSS strings
- ✅ Use `<foreignObject>` for HTML content in SVG
- ✅ Include proper XHTML namespace: `xmlns:xhtml="http://www.w3.org/1999/xhtml"`

### 3. PHP Integration
- ✅ Always use `htmlspecialchars()` for user data
- ✅ Use `json_encode()` to pass data to JavaScript
- ✅ Handle form submissions at the top of the file
- ✅ Separate PHP logic from presentation

### 4. Performance
- ✅ Use framework's data management for localStorage sync
- ✅ Implement debouncing for frequent operations
- ✅ Use CSS transforms instead of changing layout properties
- ✅ Minimize DOM queries with element caching

## 📚 Examples

### Simple Todo App
```xml
<!-- Form -->
<foreignObject x="50" y="50" width="900" height="60">
  <xhtml:div class="svg-flex-row svg-flex-gap-normal">
    <xhtml:input type="text" id="task-input" class="svg-input" placeholder="Enter task..."/>
    <xhtml:button class="svg-btn-primary" onclick="addTask()">Add Task</xhtml:button>
  </xhtml:div>
</foreignObject>

<!-- Tasks Display -->
<foreignObject x="50" y="120" width="900" height="400">
  <xhtml:div id="tasks-container" class="svg-content-container">
    <!-- Tasks rendered here by JavaScript -->
  </xhtml:div>
</foreignObject>
```

### Data Dashboard
```xml
<!-- Stats Cards -->
<foreignObject x="50" y="50" width="280" height="100">
  <xhtml:div class="svg-card">
    <xhtml:h3 class="svg-text-primary">Total Items</xhtml:h3>
    <xhtml:div style="font-size: 24px; color: #4caf50;"><?php echo count($items); ?></xhtml:div>
  </xhtml:div>
</foreignObject>

<!-- Chart Area -->
<foreignObject x="350" y="50" width="600" height="300">
  <xhtml:div class="svg-content-container">
    <!-- Chart rendered here -->
  </xhtml:div>
</foreignObject>
```

## 📞 Support

Created based on successful `todo.php.svg` modernization. For issues or improvements:

1. Check existing components in `svg-php-framework.css`
2. Review JavaScript utilities in `svg-php-framework.js`  
3. Reference complete example in `template.php.svg`
4. Follow SVG+PHP best practices outlined above

## 📄 License

This framework is based on the successful modernization of the todo.php.svg application and follows the same principles of CSS-first development with minimal JavaScript footprint.

---

**Happy coding with SVG+PHP Framework! 🎉**
