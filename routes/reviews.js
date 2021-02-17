const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncCatch = require("../utilities/asyncCatch.js");
const Campground = require("../models/campground.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")





// routes -------------------------------------------------------------------------
router.post("/", isLoggedIn, validateReview, asyncCatch(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.unshift(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground.id}`)
}));


router.delete("/:revId", isLoggedIn, isReviewAuthor, asyncCatch(async(req, res) => {
    const { revId } = req.params;
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId);
    req.flash("success", "Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;