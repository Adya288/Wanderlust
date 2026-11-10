const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapasync = require("../utils/wrapAsync");
const passport = require('passport');
const {saveRedirectUrl}= require("../middleware.js");
const userController= require ("../controllers/users.js");

router.route("/signup")
.get(wrapasync(userController.renderSignup))
.post(wrapasync(userController.signup));
 

router.route("/login")
.get( wrapasync(userController.renderLogin))
.post(
    saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true
}),
 userController.login
);


router.get("/logout", wrapasync(userController.logout));
    
module.exports = router;