const express = require("express");
const router = express.Router();
const asyncCatch = require("../utilities/asyncCatch.js");
const ExpressError = require("../utilities/ExpressError.js");

const Campground = require("../models/campground.js");
const { campgroundSchema } = require("../utilities/validationSchemas.js");



// validation middleware -----------------------------------------------------------
const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get("/", asyncCatch(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

router.get("/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

router.post("/", validateCampground, asyncCatch(async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Ivalid Campground Data", 400);

    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

router.get("/:id", asyncCatch(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show.ejs", { camp });
}));

router.put("/:id", validateCampground, asyncCatch(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:id", asyncCatch(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

router.get("/:id/edit", asyncCatch(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { camp });
}));

module.exports = router;