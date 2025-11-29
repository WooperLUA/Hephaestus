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
    "201": "Element doesnt exist anymore"

}

const hepha_error = (error_code) =>
{
    return new Error(`HEPHA ${error_code} : ${errors[error_code]}`);
}

export {tags, options_whitelist, hepha_error};