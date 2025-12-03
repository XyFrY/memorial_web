function parseBoolean(value) {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['true', '1', 'yes', 'on'].includes(normalized)) {
            return true;
        }
        if (['false', '0', 'no', 'off'].includes(normalized)) {
            return false;
        }
    }

    return undefined;
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function normalizeString(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function normalizeDate(value) {
    if (!value) {
        return undefined;
    }

    const dateValue = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(dateValue.valueOf())) {
        return undefined;
    }

    return dateValue;
}

function parseDate(value, fieldName) {
    const date = new Date(value);

    if (Number.isNaN(date.valueOf())) {
        return { error: `${fieldName} must be a valid date` };
    }

    return { value: date };
}

module.exports = {
    isNonEmptyString,
    normalizeString,
    normalizeDate,
    parseBoolean,
    parseDate
};
