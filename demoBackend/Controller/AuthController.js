
const Auth = require("../model/auth");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const nodeMalier = require('nodemailer');

const jwtToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "24h"
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = jwtToken(user._id);
    cookieOption = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.cookie("jwt", token, cookieOption);
    if (user.password) user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: user
    })
}

const nodemailerConfig = nodeMalier.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,

    ignoreTLS: true,
    auth: {
        user: "b.v.m.k.raja369@gmail.com",
        pass: "jhmeeujuhbrrgnri",
    },
});
exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;

    const newUser = {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
    };
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "sign in confirmation mail",
        message: "hiiiiii",
        html: "<div><head><h1>form Confirmation:</h1></head><body><b>you successfully submitted your form</b></body></div>"
    }
    const user = await Auth.create(newUser);
    createSendToken(user, 201, res);


    nodemailerConfig.sendMail(mailOptions, function (error, res) {
        if (error) {
            console.log(error);
        } else {
            console.log("successfully mail sended " + res.response);
        }
    });


})
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('please Enter Email and password', 400))
    };

    const user = await Auth.findOne({ email });
    if (!user || ! await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401))
    };

    createSendToken(user, 201, res);
})
