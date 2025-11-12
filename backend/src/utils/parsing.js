// Express query/body values arrive as strings, this function turns common string inputs (like "true", "false", "1", "0") into real booleans.
function parseBoolean(value) {
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(normalized)) return true;
        if (["false", "0", "no", "off"].includes(normalized)) return false;
    }

    return undefined;
}
// Memorial request fields must contain real text. This function returns true only when the value is a string with at least one non-whitespace character after trimming.
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function normalizeString(value) {
    return typeof value === "string" ? value.trim() : "";
}

function normalizeDate(value) {
    if (!value) {
        return undefined;
    }

    // Convert to Date if it's not already
    const dateValue = value instanceof Date ? value : new Date(value);

    // Check if date is invalid (NaN)
    if (Number.isNaN(dateValue.valueOf())) {
        return undefined;
    }

    return dateValue;
}

// Turn a request value into a real Date. If the value can’t form a valid date, return an error message.
function parseDate(value, fieldName) {
    const date = new Date(value);

    if (Number.isNaN(date.valueOf())) {
        return { error: `${fieldName} must be a valid date` };
    }

    return { value: date };
}

// Sanitize user search terms before building a regex by escaping regex metacharacters, so symbols like "." or "*" are matched literally and can’t alter the query pattern.
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
    escapeRegex,
    isNonEmptyString,
    normalizeString,
    normalizeDate,
    parseBoolean,
    parseDate,
};
