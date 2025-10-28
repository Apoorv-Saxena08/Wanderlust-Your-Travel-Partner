const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
//const Listing = require("./models/listing.js");
const {listingSchema , reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Please Login first to add a listing");
        return res.redirect("/login");
    }
    next();
}
 
module.exports.saveRedirectUrl = (req,res,next)=>{
    //bcoz passport session resent krdeta h 
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; 
     }
     next();
};

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not owner of this listing");

        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateFunction = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);  
    //console.log(result);

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    } 
};

//review server side validation
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);  
    //console.log(result);

    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    } 
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You did not created this review");

        return res.redirect(`/listings/${id}`);
    }

    next();
}