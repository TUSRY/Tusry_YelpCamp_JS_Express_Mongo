const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const methodOverride = require("method-override");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`campgrounds/${campground._id}`);
});

app.get("/campgrounds/:_id", async (req, res) => {
  const campground = await Campground.findById(req.params._id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:_id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params._id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:_id", async (req, res) => {
  const { _id } = req.params;
  const campground = await Campground.findByIdAndUpdate(_id, {
    ...req.body.campground,
    new: true,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:_id", async (req, res) => {
  const { _id } = req.params;
  await Campground.findByIdAndDelete(_id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
