const {
    parseBoolean,
    parseDate,
    isNonEmptyString,
} = require("../utils/parsing");

function parseMemorialPayload(body, { requireAllFields = false } = {}) {
    if (!body || typeof body !== "object") {
        return {
            errors: ["Request body must be an object"],
            updates: {},
            unsetFields: [],
            hasUpdates: false,
        };
    }

    const errors = [];
    const updates = {};
    const unsetFields = [];

    const hasField = (field) => field in body;
    const checkRequired = (field, label) => {
        if (requireAllFields && !hasField(field)) {
            errors.push(`${label} is required`);
            return false;
        }
        return hasField(field);
    };

    // Validate name
    if (checkRequired("name", "name")) {
        const { error, value } = validateName(body.name);
        if (error) errors.push(error);
        else updates.name = value;
    }

    // Validate biography
    if (checkRequired("biography", "biography")) {
        if (!isNonEmptyString(body.biography)) {
            errors.push("biography is required");
        } else {
            updates.biography = body.biography.trim();
        }
    }

    // Validate dates
    for (const dateField of ["birthDate", "deathDate"]) {
        if (checkRequired(dateField, dateField)) {
            const value = body[dateField];
            if (!isNonEmptyString(value) && !(value instanceof Date)) {
                errors.push(`${dateField} is required`);
            } else {
                const { error, value: parsed } = parseDate(value, dateField);
                if (error) errors.push(error);
                else updates[dateField] = parsed;
            }
        }
    }

    // Validate imageUrl (optional)
    if (hasField("imageUrl")) {
        if (!body.imageUrl || !String(body.imageUrl).trim()) {
            unsetFields.push("imageUrl");
        } else if (!isNonEmptyString(body.imageUrl)) {
            errors.push("imageUrl must be a string");
        } else {
            updates.imageUrl = body.imageUrl.trim();
        }
    }

    // Validate locations (optional)
    for (const locationField of ["birthLocation", "deathLocation"]) {
        if (hasField(locationField)) {
            const value = body[locationField];

            if (value == null) {
                unsetFields.push(locationField);
            } else {
                const { error, value: parsed } = validateLocation(
                    value,
                    locationField
                );
                if (error) errors.push(error);
                else if (parsed) updates[locationField] = parsed;
                else unsetFields.push(locationField);
            }
        }
    }

    // Validate approved (admin only)
    if (hasField("approved")) {
        const parsed = parseBoolean(body.approved);
        if (typeof parsed !== "boolean") {
            errors.push("approved must be a boolean value");
        } else {
            updates.approved = parsed;
        }
    }

    const hasUpdates =
        Object.keys(updates).length > 0 || unsetFields.length > 0;

    return { errors, updates, unsetFields, hasUpdates };
}

module.exports = {
    parseMemorialPayload,
    validateLocation,
    validateName,
    validateState,
};
