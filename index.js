const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const asyncCatch = require("./utilities/asyncCatch.js");
const ExpressError = require("./utilities/ExpressError.js");
const methodOverride = require("method-override");
const Campground = require("./models/campground.js");
const { campgroundSchema } = require("./utilities/validationSchemas.js")

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

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// routes ------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/campgrounds", asyncCatch(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

app.post("/campgrounds", validateCampground, asyncCatch(async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Ivalid Campground Data", 400);

    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

app.get("/campgrounds/:id", asyncCatch(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/show.ejs", { camp });
}));

app.put("/campgrounds/:id", validateCampground, asyncCatch(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campgrounds });
    res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campgrounds/:id", asyncCatch(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

app.get("/campgrounds/:id/edit", asyncCatch(async(req, res) => {
    const { id } = req.params;
    console.log(id);
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { camp });
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