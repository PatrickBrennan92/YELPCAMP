const express = require("express");
const passport = require("passport");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const users = require("../controllers/users.js")

router.get("/register", users.renderRegister);

router.post("/register", asyncCatch(users.register));

router.get("/login", users.renderLogin);

router.post("/login",
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
    users.login);

router.get("/logout", users.logout)

module.exports = router;