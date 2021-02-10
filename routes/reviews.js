const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utilities/ExpressError.js");
const asyncCatch = require("../utilities/asyncCatch.js");
const Campground = require("../models/campground.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../utilities/validationSchemas.js");



// validation middleware -----------------------------------------------------------

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// routes -------------------------------------------------------------------------
router.post("/", validateReview, asyncCatch(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)
}));


router.delete("/:revId", asyncCatch(async(req, res) => {
    const { revId } = req.params;
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId);
    res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;