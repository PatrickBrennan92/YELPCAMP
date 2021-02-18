const User = require("../models/user.js");

module.exports.renderRegister = (req, res) => {
    res.render("users/register.ejs")
};

module.exports.register = async(req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs")
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirect = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirect);
};

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
};