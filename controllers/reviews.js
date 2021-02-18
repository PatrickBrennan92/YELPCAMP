const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.unshift(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground.id}`)
};

module.exports.deleteReview = async(req, res) => {
    const { revId } = req.params;
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId);
    req.flash("success", "Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`);
};