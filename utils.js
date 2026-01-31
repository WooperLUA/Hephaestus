
const tags = [
    "div", "span", "p", "button", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "section", "article", "header", "footer", "main",
    "input", "textarea", "label", "form", "a", "img",
    "nav", "aside", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
    "video", "audio", "source", "canvas", "svg",
    "select", "option", "optgroup", "fieldset", "legend"
];

const options_whitelist = [
    "text",
    "html",
    "children",
    "events",
    "style",
    "alias"
]


const errors = {
    "101": "Component passed isn't an hepha element",
    "102": "Forged component doesnt exist",
    "201": "Element doesnt exist anymore",
    "202": "Parent queried doesnt exist",

    "301": "Alias must be unique (disable strict_alias to remove this error)"

}



function deep_merge(base, overrides)
{
    const output = structuredClone(base);

    for (const [key, value] of Object.entries(overrides))
    {
        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value)
        )
        {
            output[key] = deep_merge(output[key] || {}, value);
        } else
        {
            output[key] = value;
        }
    }

    return output;
}

const hepha_error = (error_code) =>
{
    return new Error(`[Hepha] ${error_code} : ${errors[error_code]}`);
}

export {tags, options_whitelist, hepha_error, deep_merge};