const express = require("express");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const Campground = require("../models/campground.js");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js")


// routes --------------------------------------------------------------------------

router.get("/", asyncCatch(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post("/", isLoggedIn, validateCampground, asyncCatch(campgrounds.createCampground));

router.get("/:id", asyncCatch(campgrounds.showCampgrounds));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, asyncCatch(campgrounds.updateCampground));

router.delete("/:id", isLoggedIn, isAuthor, asyncCatch(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncCatch(campgrounds.renderEditForm));

module.exports = router;