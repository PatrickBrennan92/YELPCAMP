const express = require("express");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const Campground = require("../models/campground.js");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


// routes --------------------------------------------------------------------------
router.route("/")
    .get(asyncCatch(campgrounds.index))
    // .post(isLoggedIn, validateCampground, asyncCatch(campgrounds.createCampground));
    .post(upload.array("image"), (req, res) => {
        console.log(req.body, req.files)
        res.send("it worked")
    })

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(asyncCatch(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, validateCampground, asyncCatch(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, asyncCatch(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncCatch(campgrounds.renderEditForm));

module.exports = router;