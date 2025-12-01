// Import mongoose for database schema definition
const { mongoose } = require('../db/mongo');

// Valid name suffixes (Jr., Sr., etc.)
const NAME_SUFFIXES = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

// Valid US state codes
const STATE_CODES = [
    'AL', // Alabama
    'AK', // Alaska
    'AZ', // Arizona
    'AR', // Arkansas
    'CA', // California
    'CO', // Colorado
    'CT', // Connecticut
    'DE', // Delaware
    'FL', // Florida
    'GA', // Georgia
    'HI', // Hawaii
    'ID', // Idaho
    'IL', // Illinois
    'IN', // Indiana
    'IA', // Iowa
    'KS', // Kansas
    'KY', // Kentucky
    'LA', // Louisiana
    'ME', // Maine
    'MD', // Maryland
    'MA', // Massachusetts
    'MI', // Michigan
    'MN', // Minnesota
    'MS', // Mississippi
    'MO', // Missouri
    'MT', // Montana
    'NE', // Nebraska
    'NV', // Nevada
    'NH', // New Hampshire
    'NJ', // New Jersey
    'NM', // New Mexico
    'NY', // New York
    'NC', // North Carolina
    'ND', // North Dakota
    'OH', // Ohio
    'OK', // Oklahoma
    'OR', // Oregon
    'PA', // Pennsylvania
    'RI', // Rhode Island
    'SC', // South Carolina
    'SD', // South Dakota
    'TN', // Tennessee
    'TX', // Texas
    'UT', // Utah
    'VT', // Vermont
    'VA', // Virginia
    'WA', // Washington
    'WV', // West Virginia
    'WI', // Wisconsin
    'WY' // Wyoming
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
    // Update publishedAt when approval status changes
    if (this.isModified('approved')) {
        if (this.approved) {
            // Set publishedAt when first approved (if not already set)
            this.publishedAt = this.publishedAt ?? new Date();
        } else {
            // Clear publishedAt if memorial is unapproved
            this.publishedAt = undefined;
        }
    }

    next();
});

// Create the Memorial model from the schema
const Memorial = mongoose.model('Memorial', memorialSchema);

// Export constants along with the model
Memorial.NAME_SUFFIXES = NAME_SUFFIXES;
Memorial.STATE_CODES = STATE_CODES;

module.exports = Memorial;
