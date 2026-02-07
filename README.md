# 🔨 Hephaestus

**Hephaestus** is a lightweight JavaScript library / framework that makes DOM manipulation less verbose and more intuitive.

## Overview

Hephaestus simplifies the creation and manipulation of DOM elements by providing a clean, chainable API. Instead of writing verbose `document.createElement` calls with multiple lines of configuration, Hephaestus lets you create and configure elements in a single, readable expression.

## 🌟 Features

- **Concise Element Creation** - Create any HTML element with `hepha.relic(tag, options)`
- **Chainable calls** - Use the `.into()` method to append elements fluently
- **Archetype System** - Define reusable element archetypes with `forge_archetype` and `use_archetype`
- **Alias Management** - Reference elements globally by name (Recommended: `hepha.get_alias()`)
- **Rich Options** - Configure text, HTML, classes, styles, events, attributes, and children in one object
- **State Management** - Create reactive states with `init_state` (Recommended access: `hepha.get_state()`)

## ⚡ Installation

Install via npm:

```bash
npm install hephaestus_js
```

## 🚀 Usage with Vite

If you are using [Vite](https://vitejs.dev/), you can simply import Hephaestus in your main file:

```javascript
import hepha from 'hephaestus_js';

hepha.relic('h1', { text: "Hello Hephaestus!" }).into("#app");
```

## 📖 Usage
See documentation :
https://wooperlua.github.io/Hephaestus/



