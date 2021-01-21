const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers.js");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// return a random element from an array
const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

// creating some useable data for the database
const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            price: `${Math.floor(Math.random() * 300)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
});