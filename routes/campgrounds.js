const express = require("express");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const Campground = require("../models/campground.js");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js")


// routes --------------------------------------------------------------------------
router.route("/")
    .get(asyncCatch(campgrounds.index))
    .post(isLoggedIn, validateCampground, asyncCatch(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(asyncCatch(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, validateCampground, asyncCatch(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, asyncCatch(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncCatch(campgrounds.renderEditForm));

module.exports = router;