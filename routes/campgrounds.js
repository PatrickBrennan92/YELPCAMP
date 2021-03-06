const express = require("express");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const Campground = require("../models/campground.js");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js")
const multer = require("multer");
const { storage } = require("../cloudinary/index.js")
const upload = multer({ storage });


// routes --------------------------------------------------------------------------
router.route("/")
    .get(asyncCatch(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, asyncCatch(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(asyncCatch(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, asyncCatch(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, asyncCatch(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncCatch(campgrounds.renderEditForm));

module.exports = router;