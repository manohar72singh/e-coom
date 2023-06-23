
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const authSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        min: 3,
        max: 26,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        max: 50,
        validate: [validator.isEmail, "Please enter Unique Email"],
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        min: [5, "please min password is greaterthan 6 words"],

    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: "please enter correct password,Passwords are not same!!!!",

        }
    },
    passwordChangedAt: Date,
    passwordRestToken: String,
    passwordExpiredDate: Date,
});


authSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

authSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date - 1000;
    next();
});

authSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


const Auth = mongoose.model("Auth", authSchema);

//this function about converting normal password to bcryto;


module.exports = Auth;


