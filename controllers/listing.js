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

module.exports.searchListings = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.redirect("/listings");
        }

        // Extract search terms by splitting on common delimiters
        const searchTerms = q.split(/[-,]+/).map(term => term.trim());
        
        // Create case-insensitive search conditions for each term
        const searchConditions = searchTerms.map(term => ({
            $or: [
                { title: new RegExp(term, "i") },
                { location: new RegExp(term, "i") },
                { country: new RegExp(term, "i") }
            ]
        }));

        // Search in title, location, and country fields with combined terms
        const allListings = await Listing.find({
            $and: searchConditions
        });

        res.render("listings/index.ejs", { 
            allListings,
            searchQuery: q 
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error performing search");
        res.redirect("/listings");
    }
}

module.exports.searchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }

        const searchQuery = new RegExp(q, "i");
        
        // Search in title, location, and country fields
        const suggestions = await Listing.find({
            $or: [
                { title: searchQuery },
                { location: searchQuery },
                { country: searchQuery }
            ]
        })
        .select('title location country') // Only select the fields we need
        .limit(5); // Limit to 5 suggestions

        // Format suggestions
        const formattedSuggestions = suggestions.map(listing => ({
            title: listing.title,
            location: listing.location,
            country: listing.country,
            text: `${listing.title} - ${listing.location}, ${listing.country}`
        }));

        res.json(formattedSuggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching suggestions" });
    }
}