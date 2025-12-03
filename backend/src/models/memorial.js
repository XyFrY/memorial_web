const { mongoose } = require('../db/mongo');

const NAME_SUFFIXES = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

const STATE_CODES = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY'
];

const nameSchema = new mongoose.Schema(
    {
        first: {
            type: String,
            required: true,
            trim: true
        },

        middle: {
            type: String,
            trim: true
        },

        last: {
            type: String,
            required: true,
            trim: true
        },

        suffix: {
            type: String,
            enum: NAME_SUFFIXES,
            trim: true
        }
    },
    { _id: false }
);

const locationSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            trim: true
        },

        state: {
            type: String,
            enum: STATE_CODES,
            uppercase: true,
            trim: true
        }
    },
    { _id: false }
);

const memorialSchema = new mongoose.Schema(
    {
        name: {
            type: nameSchema,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        birthDate: {
            type: Date,
            required: true
        },

        deathDate: {
            type: Date,
            required: true
        },

        biography: {
            type: String,
            required: true,
            trim: true
        },

        imageUrl: {
            type: String,
            trim: true
        },

        birthLocation: {
            type: locationSchema
        },

        deathLocation: {
            type: locationSchema
        },

        approved: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

memorialSchema.pre('save', function updateComputedFields(next) {
    if (this.isModified('approved')) {
        if (this.approved) {
            this.publishedAt = this.publishedAt ?? new Date();
        } else {
            this.publishedAt = undefined;
        }
    }

    next();
});

const Memorial = mongoose.model('Memorial', memorialSchema);

Memorial.NAME_SUFFIXES = NAME_SUFFIXES;
Memorial.STATE_CODES = STATE_CODES;

module.exports = Memorial;
