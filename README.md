# Hephaestus

**Hephaestus** is a lightweight JavaScript library / framework that makes DOM manipulation less verbose and more intuitive.

## Overview

Hephaestus simplifies the creation and manipulation of DOM elements by providing a clean, chainable API. Instead of writing verbose `document.createElement` calls with multiple lines of configuration, Hephaestus lets you create and configure elements in a single, readable expression.

## 🌟 Features

- **Concise Element Creation** - Create any HTML element with a simple function call
- **Global Tag Builders** - All HTML tags are available as global functions (e.g., `div()`, `span()`, `button()`)
- **Chainable calls** - Use the `.into()` method to append elements fluently
- **Template System** - Define reusable element templates with `forge_template` and `use_template`
- **Alias Management** - Reference elements globally by name using aliases
- **Rich Options** - Configure text, HTML, classes, styles, events, attributes, and children in one object

## ⚡ Installation

```bash
# Clone the repository
git clone https://github.com/WooperLUA/Hephaestus.git
cd Hephaestus
```

Then import Hephaestus in your project:

```javascript
import hepha from './hephaestus.js';
```

## 📖 Usage

### Basic Element Creation

```javascript
// Create a simple div
const my_div = div({
    text: "Hello, World!",
    class: "container primary"
});

// Create a button with an event listener
const my_button = button({
    text: "Click me",
    class: "btn btn-primary",
    events: {
        click: () => alert("Button clicked!")
    }
});
```

### Chainable Appending with `.into()`

```javascript
// Create and append in one expression
div({
    text: "Child element",
    class: "child"
}).into(document.body);

// Build nested structures
div({
    class: "parent"
}).into(
    section({
        id: "main-section"
    }).into(document.body)
);
```

### Working with Children

```javascript
// Create a list with multiple items
const list = ul({
    children: [
        li({ text: "Item 1" }),
        li({ text: "Item 2" }),
        li({ text: "Item 3" })
    ]
}).into(document.body);
```

### Using Aliases

```javascript
// Create an element with an alias for global reference
div({
    alias: "main_container",
    class: "container"
}).into(document.body);

// Access it later via hepha.aliases
const main_container = hepha.aliases.mainContainer
main_container.style.backgroundColor = "lightblue";
```

### Styling Elements

```javascript
// Add inline styles (supports snake_case to kebab-case conversion)
div({
    text: "Styled div",
    style: {
        background_color: "blue",
        font_size: "16px",
        padding: "20px"
    }
}).into(document.body);
```

### Custom Attributes

```javascript
// Add any HTML attributes
input({
    type: "text",
    placeholder: "Enter your name",
    "data-user-id": "12345",
    required: true
}).into(document.body);
```

### Template System

```javascript
// Define a reusable template
hepha.forge_template("primary_button", "button", {
    class: "btn btn-primary",
    style: {
        padding: "10px 20px",
        border_radius: "5px"
    }
});

// Use the template
const btn1 = hepha.use_template("primary_button");
btn1.textContent = "Submit";
btn1.into(document.body);

const btn2 = hepha.use_template("primaryButton");
btn2.textContent = "Cancel";
btn2.into(document.body);
```

### Complete Example

```javascript
import hepha from './hephaestus.js';

// Create a card component
const card = div({
    class: "card",
    alias: "user_card",
    style: {
        border: "1px solid #ccc",
        border_radius: "8px",
        padding: "16px",
        max_width: "300px"
    },
    children: [
        h2({ text: "User Profile" }),
        p({ text: "Name: John Doe" }),
        button({
            text: "View Details",
            class: "btn",
            events: {
                click: () => console.log("Viewing details...")
            }
        })
    ]
}).into(document.body);

// Access via alias later
hepha.aliases.user_card.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
```

## ℹ️ References

### Element Creation

All HTML tags are available as global functions. Call them with an options object:

```javascript
tagName(options)
```

### Options Object

- **`text`** (string) - Sets `textContent` of the element
- **`html`** (string) - Sets `innerHTML` of the element
- **`class`** (string) - Space-separated class names to add
- **`style`** (object) - Inline styles (snake_case automatically converted to kebab-case)
- **`events`** (object) - Event listeners as key-value pairs (e.g., `{click: handler}`)
- **`children`** (array) - Array of child elements to append
- **`alias`** (string) - Global alias name for the element
- Any other properties are set as HTML attributes

### Hepha Object Methods

- **`hepha.forge_template(name, tag, options)`** - Create a reusable template
- **`hepha.use_template(name)`** - Instantiate an element from a template
- **`hepha.get_templates()`** - Get all defined templates
- **`hepha.get_aliases()`** - Get all aliased elements

### Element Methods

- **`.into(parent)`** - Append the element to a parent and return the element

## ⚠️ Error Codes

- **101** : "Component passed isn't an hepha element"
- **102** : "Forged component doesnt exist"
- **201** : "Element doesnt exist anymore"
