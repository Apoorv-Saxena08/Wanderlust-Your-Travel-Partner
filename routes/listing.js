const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateFunction } = require("../middleware.js");

//to parse file data
const multer = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


//controllers
const listingController = require("../controllers/listing.js");

//router.route use
router.route("/")
.get( // index
  wrapAsync(listingController.index)
)
.post( // create
  isLoggedIn,
  validateFunction,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing)
);


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//search route
router.get("/search", wrapAsync(listingController.searchListings));

//search suggestions route
router.get("/search/suggestions", wrapAsync(listingController.searchSuggestions));

router.route("/:id")
.get(//show
  wrapAsync(listingController.showListing)
)
.put(//update
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateFunction,
  wrapAsync(listingController.updateListing)
)
.delete(//destroy
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
)


//Show route : Read : hr id ka sara data dikhayenge
// router.get(
//   "/:id",
//   wrapAsync(listingController.showListing)
// );

//create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateFunction,
//   wrapAsync(listingController.createListing)
// );

//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateFunction,
//   wrapAsync(listingController.updateListing)
// );

//Delete route - DELETE @ /listings/:id
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

//Index route
// router.get(
//   "/",
//   wrapAsync(listingController.index)
// );

module.exports = router;
