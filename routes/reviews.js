const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncCatch = require("../utilities/asyncCatch.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviews = require("../controllers/reviews.js")


// routes -------------------------------------------------------------------------
router.post("/", isLoggedIn, validateReview, asyncCatch(reviews.createReview));


router.delete("/:revId", isLoggedIn, isReviewAuthor, asyncCatch(reviews.deleteReview));


module.exports = router;