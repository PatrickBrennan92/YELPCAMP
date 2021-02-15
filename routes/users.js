const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const asyncCatch = require("../utilities/asyncCatch.js");

router.get("/register", (req, res) => {
    res.render("users/register.ejs")
});

router.post("/register", asyncCatch(async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirect = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirect);
});

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
})

module.exports = router;