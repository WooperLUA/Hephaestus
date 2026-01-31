# 🔨 Hephaestus

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
- **State Management** - Create reactive states with `init_state` and access them via `hepha.states`
- **Global Stores** - Create persistent and shared states with `hepha.store`
- **Dependency Injection** - Share data or services with `provide` and `inject`

## ⚡ Installation

Install via npm:

```bash
npm install hephaestus_js
```

## 🚀 Usage with Vite

If you are using [Vite](https://vitejs.dev/), you can simply import Hephaestus in your main file:

```javascript
import hepha from 'hephaestus_js';

hepha.h1({ text: "Hello Hephaestus!" }).into("#app");
```

## 📖 Usage
See documentation :
https://wooperlua.github.io/Hephaestus/

### Global Stores
Create reactive stores that can be accessed globally and even persisted to `localStorage`.

```javascript
// Create a store
hepha.store('settings', { theme: 'dark' }, { persist: true });

// Access it anywhere
const settings = hepha.stores.settings;
hepha.div({ 
    text: hepha.ref(() => `Theme is ${settings.theme}`) 
}).into('body');
```

### Provide & Inject
Easily share data or services without prop drilling.

```javascript
hepha.provide('userService', { name: 'John Doe' });

// Later in another part of the app
const user = hepha.inject('userService');
```


