// Load required packages
var mongoose = require('mongoose');
const crypto = require('crypto');

// Define our user schema
var UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        requirted: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    }, 
    ingredients: {
        type: Map,
        of: String
    },
    dateCreated: {
        type: Date,
        default: Date.now // Automatically set to the present date
    }
});

UserSchema.pre('save', function (next){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto
        .pbkdf2Sync(this.password, this.salt, 100, 16, 'sha256')
        .toString('hex');
    next()
});

UserSchema.methods.comparePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 100, 16, 'sha256').toString('hex');
    return this.password === hash;
};


// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
