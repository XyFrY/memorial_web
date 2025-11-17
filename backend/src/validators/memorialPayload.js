const {
    parseBoolean,
    parseDate,
    isNonEmptyString
} = require('../utils/parsing');
const Memorial = require('../models/memorial');

// Validate a person's name object with first, middle, last, and suffix fields.
function validateName(name) {
    if (!name || typeof name !== 'object') {
        return { error: 'name must be an object with first and last fields' };
    }

    const first = name.first?.trim();
    const middle = name.middle?.trim();
    const last = name.last?.trim();
    const suffix = name.suffix?.trim();

    if (!first) {
        return { error: 'first name is required' };
    }

    if (!last) {
        return { error: 'last name is required' };
    }

    if (suffix && !Memorial.NAME_SUFFIXES.includes(suffix)) {
        return {
            error: `suffix must be one of: ${Memorial.NAME_SUFFIXES.join(
                ', '
            )}`
        };
    }

    return {
        value: {
            first,
            middle: middle || undefined,
            last,
            suffix: suffix || undefined
        }
    };
}

// Validate a location object with optional city and state fields.
function validateLocation(location, fieldName) {
    if (!location || typeof location !== 'object') {
        return {
            error: `${fieldName} must be an object with city and/or state`
        };
    }

    const city = location.city?.trim();
    const state = location.state?.trim().toUpperCase();

    if (!city && !state) {
        return { value: null };
    }

    if (state && !Memorial.STATE_CODES.includes(state)) {
        return { error: `${fieldName} state must be a valid US state code` };
    }

    return {
        value: {
            city: city || undefined,
            state: state || undefined
        }
    };
}

// Validate a US state code against the list of valid state abbreviations.
function validateState(state) {
    if (!state || typeof state !== 'string') {
        return { error: 'state is required' };
    }

    const normalized = state.trim().toUpperCase();

    if (!Memorial.STATE_CODES.includes(normalized)) {
        return { error: 'state must be a valid US state code' };
    }

    return { value: normalized };
}

// Parse and validate a memorial request body, returning any validation errors and the sanitized data to save.
function parseMemorialPayload(body, { requireAllFields = false } = {}) {
    if (!body || typeof body !== 'object') {
        return {
            errors: ['Request body must be an object'],
            updates: {},
            unsetFields: [],
            hasUpdates: false
        };
    }

    const errors = [];
    const updates = {};
    const unsetFields = [];

    // Helper functions to check whether fields exist and whether they're required for this request.
    const hasField = (field) => field in body;
    const checkRequired = (field, label) => {
        if (requireAllFields && !hasField(field)) {
            errors.push(`${label} is required`);
            return false;
        }
        return hasField(field);
    };

    // Validate name
    if (checkRequired('name', 'name')) {
        const { error, value } = validateName(body.name);
        if (error) {
            errors.push(error);
        } else {
            updates.name = value;
        }
    }

    // Validate biography
    if (checkRequired('biography', 'biography')) {
        if (!isNonEmptyString(body.biography)) {
            errors.push('biography is required');
        } else {
            updates.biography = body.biography.trim();
        }
    }

    // Validate dates - both birth and death dates are required and must be parseable as valid Date objects.
    for (const dateField of ['birthDate', 'deathDate']) {
        if (checkRequired(dateField, dateField)) {
            const value = body[dateField];
            if (!isNonEmptyString(value) && !(value instanceof Date)) {
                errors.push(`${dateField} is required`);
            } else {
                const { error, value: parsed } = parseDate(value, dateField);
                if (error) {
                    errors.push(error);
                } else {
                    updates[dateField] = parsed;
                }
            }
        }
    }

    // Validate imageUrl (optional) - if provided as an empty value, we mark it for removal from the database.
    if (hasField('imageUrl')) {
        if (!body.imageUrl || !String(body.imageUrl).trim()) {
            unsetFields.push('imageUrl');
        } else if (!isNonEmptyString(body.imageUrl)) {
            errors.push('imageUrl must be a string');
        } else {
            updates.imageUrl = body.imageUrl.trim();
        }
    }

    // Validate locations (optional) - birth and death locations have city/state fields that must pass validation if provided.
    for (const locationField of ['birthLocation', 'deathLocation']) {
        if (hasField(locationField)) {
            const value = body[locationField];

            if (value === null) {
                unsetFields.push(locationField);
            } else {
                const { error, value: parsed } = validateLocation(
                    value,
                    locationField
                );
                if (error) {
                    errors.push(error);
                } else if (parsed) {
                    updates[locationField] = parsed;
                } else {
                    unsetFields.push(locationField);
                }
            }
        }
    }

    // Validate approved (admin only) - only admins can set this field, but we still parse it here for validation.
    if (hasField('approved')) {
        const parsed = parseBoolean(body.approved);
        if (typeof parsed !== 'boolean') {
            errors.push('approved must be a boolean value');
        } else {
            updates.approved = parsed;
        }
    }

    // Check if any changes were actually provided in the request body.
    const hasUpdates =
        Object.keys(updates).length > 0 || unsetFields.length > 0;

    return { errors, updates, unsetFields, hasUpdates };
}

module.exports = {
    parseMemorialPayload,
    validateLocation,
    validateName,
    validateState
};
