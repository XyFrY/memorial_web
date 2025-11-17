// Import mongoose for database schema definition
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        name: {
            type: String,
            trim: true
        },

        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Create an index on email for fast lookups
userSchema.index({ email: 1 }, { unique: true });

// Export the User model
module.exports = mongoose.model('User', userSchema);
