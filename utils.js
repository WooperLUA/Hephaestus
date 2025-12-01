// All html tags that can be built
const tags = [
    "div", "span", "p", "button", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "section", "article", "header", "footer", "main",
    "input", "textarea", "label", "form", "a", "img"
];

const options_whitelist = [
    "text",
    "html",
    "children",
    "events",
    "style"
]

const errors = {
    "101": "Component passed isn't an hepha element",
    "102": "Forged component doesnt exist",
    "201": "Element doesnt exist anymore",
    "202": "Parent queried doesnt exist",

    "301": "Alias must be unique (disable strict_alias to remove this error)"

}


// This is to replace options in the use_template (I stole it)
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