const options_whitelist = [
    "text",
    "html",
    "children",
    "events",
    "style",
    "alias",
    "class"
]


const errors = {
    "101": "Component passed isn't an hepha element",
    "102": "Forged archetype doesnt exist",
    "201": "Element doesnt exist anymore",
    "202": "Parent queried doesnt exist",

    "301": "Alias must be unique (disable strict_alias to remove this error)"
}

const dev_logs = {
    init_state: (name, initialState) => `[Hepha] Created a reactive state "${name}" with variables ${Object.keys(initialState)}.`,
    forge_archetype : (name, tag) => `[Hepha] Created archetype <|${name}|> being a ${tag}.`,
    use_archetype : (name) => `[Hepha] Made an hepha element from archetype <|${name}|>.`,
    create_element : (tag, options) => `[Hepha] Created ${tag} with alias : <|${options.alias || "unreferenced"}|>.`
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

export {options_whitelist, hepha_error, deep_merge, dev_logs};