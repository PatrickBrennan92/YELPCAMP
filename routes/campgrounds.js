const express = require("express");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const Campground = require("../models/campground.js");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");


// routes --------------------------------------------------------------------------

router.get("/", asyncCatch(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

router.post("/", isLoggedIn, validateCampground, asyncCatch(async(req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully created new campground.");
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

router.get("/:id", asyncCatch(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author");
    if (!camp) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { camp });
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, asyncCatch(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground });
    req.flash("success", "Successfully edited campground!");
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:id", isLoggedIn, isAuthor, asyncCatch(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
}));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncCatch(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { camp });
}));

module.exports = router;