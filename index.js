const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError.js");
const methodOverride = require("method-override");

// required routes -----------------------------------------------------------------
const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, "public")));



// routes ------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.use("/campgrounds", campgrounds);

app.use("/campgrounds/:id/review", reviews);

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