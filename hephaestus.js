/*

                Hephaestus makes DOM interactions in JS less verbose

 */

import {hepha_error, deep_merge, options_whitelist, tags} from "./utils.js";


/**
 * @typedef {Object} HephaOptions
 * @property {string} [alias] - An alias to register the element under hepha.aliases.
 * @property {string|{__hepha_ref: boolean, get: Function}} [text] - Text content or a reactive reference.
 * @property {string} [html] - Inner HTML content.
 * @property {HTMLElement[]} [children] - Array of child elements to append.
 * @property {string} [class] - Space-separated CSS classes.
 * @property {Object<string, Function>} [events] - Event listeners (e.g., {click: fn}).
 * @property {Object} [style] - Inline styles in camelCase or snake_case.
 */


/**
 * Internal storage for aliases, templates, and states.
 * @private
 */
const _aliases = new Proxy({}, {
    get(target, prop)
    {
        const el = target[prop];
        if (!el || !document.contains(el)) throw hepha_error(201);
        return el;
    }, set(target, prop, value)
    {
        if (target[prop] && hepha.dev_mode)
        {
            console.warn(`[Hepha] Alias <|${prop}|> was overwritten, consider removing previous alias or defining a new one.`);
        }
        if (hepha.strict_alias)
        {
            throw hepha_error(301);
        } else
        {
            target[prop] = value;
        }
        return true;
    }
});

const _templates = {};
const _states = {};

/**
 * The main Hephaestus object.
 * Provides tools for reactive DOM manipulation and template management.
 * @namespace
 */
const hepha = {
    /** @type {boolean} Enables or disables development logs. */
    dev_mode: false,
    /** @type {boolean} If true, prevents overwriting existing aliases. */
    strict_alias: false,
    /** @private @type {Function|null} Internal reference for reactivity subscription. */
    _sub: null,

    /**
     * Accessor for DOM element aliases.
     * @returns {Object<string, HTMLElement>}
     */
    get aliases() { return _aliases; },

    /**
     * Accessor for stored templates.
     * @returns {Object<string, {tag: string, options: Object}>}
     */
    get templates() { return _templates; },

    /**
     * Accessor for reactive states.
     * @returns {Object<string, Proxy>}
     */
    get states() { return _states; },

    /**
     * Retrieves a registered alias.
     * @param {string} name - The name of the alias.
     * @returns {HTMLElement} The element.
     */
    get_alias(name) { return _aliases[name]; },

    /**
     * Retrieves a registered template.
     * @param {string} name - The name of the template.
     * @returns {Object} The template definition.
     */
    get_template(name) { return _templates[name]; },

    /**
     * Retrieves a registered reactive state.
     * @param {string} name - The name of the state.
     * @returns {Proxy} The reactive state.
     */
    get_state(name) { return _states[name]; }
};

/**
 * Toggles development mode (logging).
 */
hepha.use_dev = () =>
{
    hepha.dev_mode = !hepha.dev_mode;
};

/**
 * Toggles strict alias mode.
 */
hepha.use_strict_alias = () =>
{
    hepha.strict_alias = !hepha.strict_alias;
}

/**
 * Creates a reactive state object.
 * @param {string} name - The name of the state.
 * @param {Object} initialState - The initial state object.
 * @returns {Proxy} A reactive proxy of the initial state.
 */
hepha.init_state = (name, initialState) =>
{
    const deps = new Map();

    if (hepha.dev_mode) console.log(`[Hepha] Created a reactive variable "${name}" with a value of ${initialState}.`);
    const proxy = new Proxy(initialState, {
        get(target, prop)
        {
            if (hepha._sub)
            {
                if (!deps.has(prop)) deps.set(prop, new Set());
                deps.get(prop).add(hepha._sub);
            }
            return target[prop];
        }, set(target, prop, value)
        {
            target[prop] = value;
            if (deps.has(prop))
            {
                deps.get(prop).forEach(sub => sub());
            }
            return true;
        }})

    hepha.states[name] = proxy;
    return proxy
};

/**
 * Creates a reference to a getter function for reactive values.
 * @param {Function} getter - A function that returns a value.
 * @returns {{__hepha_ref: boolean, get: Function}} A reference object.
 */
hepha.ref = (getter) =>
{
    return {
        __hepha_ref: true, get: () => getter()
    };
};

/**
 * Registers a template that can be reused later.
 * @param {string} name - The name of the template.
 * @param {string} tag - The HTML tag name.
 * @param {HephaOptions} [options={}] - Default options for the element.
 */
hepha.forge_template = (name, tag, options = {}) =>
{
    hepha.templates[name] = {tag, options: structuredClone(options)};

    if (hepha.dev_mode) console.log(`[Hepha] Created template <|${name}|> being a ${tag}.`);
};

/**
 * Creates an element from a registered template.
 * @param {string} name - The name of the template to use.
 * @param {HephaOptions} [overrides={}] - Options to override the template's defaults.
 * @returns {HTMLElement} The created DOM element.
 * @throws Will throw an error if the template does not exist.
 */
hepha.use_template = (name, overrides = {}) =>
{
    const template = hepha.templates[name];
    if (!template) throw hepha_error(102);

    const merged = deep_merge(structuredClone(template.options), overrides);

    if (hepha.dev_mode) console.log(`[Hepha] Made an hepha element from template <|${name}|>.`);

    return create_element(template.tag, merged);
};


const create_element = (tag, options = {}) =>
{
    const elt = document.createElement(tag)

    // Add the node to the global aliases
    if (options.alias)
    {
        hepha.aliases[options.alias] = elt;
    }


    if (options.text)
    {
        // Reactive text
        if (options.text && options.text.__hepha_ref)
        {
            const update = () =>
            {
                elt.textContent = options.text.get();
            };
            hepha._sub = update;
            update();
            hepha._sub = null;
        }
        // Basic text
        else
        {
            elt.textContent = options.text;
        }
    }

    if (options.html) elt.innerHTML = options.html

    // Append children to the node
    if (options.children) options.children.forEach(c => elt.appendChild(c))

    // Add classes to the node
    if (options.class) elt.classList.add(...options.class.split(" "));

    // Adds events to the node
    if (options.events) Object.entries(options.events).forEach(([evt, fn]) => elt.addEventListener(evt, fn))

    // Adds style to the node and also converts to kebab case from snake
    if (options.style && typeof options.style === "object")
    {
        Object.entries(options.style).forEach(([prop, value]) =>
        {
            elt.style[prop.replace(/_/g, "-")] = value;
        });
    }

    // Adds the attributes of a node
    Object.entries(options).forEach(([k, v]) =>
    {
        if (!options_whitelist.includes(k)) elt.setAttribute(k, v)
    })

    /**
     * Appends the element to a parent.
     * @memberof HTMLElement
     * @param {string|HTMLElement} parent - A CSS selector or a DOM element.
     * @returns {HTMLElement} The element itself.
     */
    elt.into = parent =>
    {
        if (typeof parent === "string")
        {
            const p = document.querySelector(parent);
            if (!p) throw hepha_error(202);
            p.appendChild(elt);
        } else
        {
            parent.appendChild(elt);
        }
        return elt;
    };

    if (hepha.dev_mode) console.log(`[Hepha] Created ${tag} with alias : <|${options.alias || "unreferenced"}|>.`);

    return elt
}

function init_tags()
{
    tags.forEach(tag =>
    {
        if (!hepha[tag])
        {
            hepha[tag] = options => create_element(tag, options);
        }
    });
}

init_tags();

export default hepha
