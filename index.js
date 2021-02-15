const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError.js");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// required routes -----------------------------------------------------------------
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");

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

// Config
// ejs-mate package
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

const sessionConfig = {
    secret: "Changethissecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for flash ----------------------------------------------------------
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// routes ------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);

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