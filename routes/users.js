const express = require("express");
const passport = require("passport");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const users = require("../controllers/users.js")

router.route("/register")
    .get(users.renderRegister)
    .post(asyncCatch(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        users.login);

router.get("/logout", users.logout)

module.exports = router;