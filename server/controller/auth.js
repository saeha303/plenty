//works
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
// const cookieParser = require('cookie-parser');
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
// const cors=require("cors");

// app.use(cookieParser());
exports.signup = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    try {
        const { username } = req.body;
        // Check if the username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                error: 'Username already exists, please choose a different one'
            });
        }
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User signed up successfully!' });
        // You may want to handle the response or redirect to a login page

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.signin = (req, res) => {

    // res.setHeader("Access-Control-Allow-Origin", "*");
// res.setHeader("Access-Control-Allow-Credentials", "true");
// res.setHeader("Access-Control-Max-Age", "1800");
// res.setHeader("Access-Control-Allow-Headers", "content-type");
// res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 

    // console.log(req.body);
    const errors = validationResult(req);
    // console.log(errors);
    const { username, email, password } = req.body;
    // console.log(email);
    if (!errors.isEmpty()) {
        // console.log("here");
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    // console.log("here");
    User.findOne({ $or: [{ email }, { username }] })
        .then((user) => {
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Username/email or password do not match"
                });
            }
            //create token
            const token = jwt.sign({ _id: user._id }, process.env.SECRET);
            //put token in cookie
            // console.log(token);
            // res.headers.Cook=token;
            res.cookie("token", token);
            // console.log(res.cookie)
            res.json({ token, user });
            // console.log(res.cookies.token);
        })
        .catch((error) => {
            //When there are errors We handle them here
            return res.status(400).json({
                error: "User does not exist"
            });
        });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
};

//protected routes
exports.isSignedIn = (req, res, next) => {
    // Check if the token is present in the request headers
    const token = req.cookies.token;
    // console.log(req.cookies)
    // const token = res.headers.authorization;
    // console.log("token: "+token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Attach the decoded user information to the request object
        req.auth = decoded;
        next();
    });
};

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    //to store authentication-related information in req
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not ADMIN, Access denied"
        });
    }
    //   console.log("verified admin");
    next();
};

