const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  //jb user logged in hota h uski basic info store ho jati h
  //console.log(req.user);
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing Doesn't exist");
      res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
  }

module.exports.createListing = async (req, res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing")
    // }

    //let {title,description,image,price,country,location} = req.body;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url: req.file.path, filename: req.file.filename};

    await newListing.save ();
    req.flash("success", "New listing created");
    res.redirect("/listings");
  }

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req, res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing")
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined" ){
    listing.image = {url: req.file.path, filename: req.file.filename};
    await listing.save();
    }
    

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }