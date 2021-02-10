const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const asyncCatch = require("./utilities/asyncCatch.js");
const ExpressError = require("./utilities/ExpressError.js");
const methodOverride = require("method-override");
const Campground = require("./models/campground.js");
const { campgroundSchema, reviewSchema } = require("./utilities/validationSchemas.js");
const Review = require("./models/review.js");

// required routes -----------------------------------------------------------------
const campgrounds = require("./routes/campgrounds.js")

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

// ejs-mate package
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

// routes ------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.use("/campgrounds", campgrounds);


app.delete("/campgrounds/:id/review/:revId", asyncCatch(async(req, res) => {
    const { revId } = req.params;
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId);
    res.redirect(`/campgrounds/${id}`);
}));



app.post("/campgrounds/:id/review", validateReview, asyncCatch(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`)
}));

// for any paths that don't exist
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found!", 404));
});

// Error Handler --------------------------------------------------------------
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error.ejs", { err });
});


// listener -------------------------------------------------------------------
app.listen(port, () => {
    console.log("Listening on port 3000!");
});