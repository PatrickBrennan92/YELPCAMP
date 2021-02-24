const Campground = require("../models/campground.js");
const { cloudinary } = require("../cloudinary/index.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MapboxToken;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
};

module.exports.createCampground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp)
    req.flash("success", "Successfully created new campground.");
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.showCampgrounds = async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author");
    if (!camp) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { camp });
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { camp });
};

module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...images)
    await camp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Successfully edited campground!");
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
};