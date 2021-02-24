const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

// making the schema
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

CampgroundSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);