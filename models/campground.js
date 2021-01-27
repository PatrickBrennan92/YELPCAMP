const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// making the schema
const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);