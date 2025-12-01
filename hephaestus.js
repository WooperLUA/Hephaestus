/*

                Hephaestus makes DOM interactions in JS less verbose

 */

import {hepha_error, deep_merge, options_whitelist, tags} from "./utils.js";


const hepha = {
    dev_mode:  false,
    strict_alias : false,
    aliases:   new Proxy({}, {
        get(target, prop)
        {
            const el = target[prop];
            if (!el || !document.contains(el)) throw hepha_error(201);
            return el;
        },
        set(target, prop, value)
        {
            if (target[prop] && hepha.dev_mode)
            {
                console.warn(`[Hepha] Alias <|${prop}|> was overwritten, consider removing previous alias or defining a new one.`);
            }
            if (hepha.strict_alias)
            {
                throw hepha_error(301);
            }
            else
            {
                target[prop] = value;
            }
            return true;
        }
    }),
    templates: {},
};

hepha.use_dev = () =>
{
    hepha.dev_mode = !hepha.dev_mode;
};

hepha.use_strict_alias = () =>
{
    hepha.strict_alias = !hepha.strict_alias;
}

// Makes a template from a hepha element
hepha.forge_template = (name, tag, options = {}) =>
{
    hepha.templates[name] = {tag, options: structuredClone(options)};

    if (hepha.dev_mode)
        console.log(`[Hepha] Created template <|${name}|> being a ${tag}.`);
};

// Turns a template into a node
hepha.use_template = (name, overrides = {}) =>
{
    const template = hepha.templates[name];
    if (!template) throw hepha_error(102);

    const merged = deep_merge(structuredClone(template.options), overrides);

    if (hepha.dev_mode)
        console.log(`[Hepha] Made an hepha element from template <|${name}|>.`);

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
        elt.textContent = options.text

    if (options.html)
        elt.innerHTML = options.html

    // Append children to the node
    if (options.children)
        options.children.forEach(c => elt.appendChild(c))

    // Add classes to the node
    if (options.class)
        elt.classList.add(...options.class.split(" "));

    // Adds events to the node
    if (options.events)
        Object.entries(options.events).forEach(([evt, fn]) => elt.addEventListener(evt, fn))

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
        if (!options_whitelist.includes(k))
            elt.setAttribute(k, v)
    })

    // Append the node to parent node
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

    if (hepha.dev_mode)
        console.log(`[Hepha] Created ${tag} with alias : <|${options.alias || "unreferenced"}|>.`);

    return elt
}

// Basically adds all the tag builders to the window for reference
function init()
{
    tags.forEach(tag =>
    {
        if (!window[tag])
            window[tag] = options => create_element(tag, options)
    })
}

init();

export default hepha
