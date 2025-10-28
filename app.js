if(process.env.NODE_ENV != "production")
require('dotenv').config();

//console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const dbUrl = process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");//listingRouter
const reviews = require("./routes/review.js")//reviewRouter
const userRouter = require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
const {isLoggedIn , isOwner}  = require("./middleware.js");
const listingController = require("./controllers/listing.js");


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error" , ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie: {
        //                  days  hours min sec milisec
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

// app.get("/", (req,res)=>{
//     res.send("Hi i am root");
// })


app.use(session(sessionOptions));
app.use(flash());

//auth vala code session k baad likhna h 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//middlewares
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 

app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//for auth
// app.get("/demouser" , async(req,res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username:"college-student"
//     })
//     //                                        user ,     pwd
//     let registeredUSer = await User.register(fakeUser , "helloworld");
//     res.send(registeredUSer); 
// })

// Route Handlers - Order matters!
// Mount listings routes first
app.use("/listings", listings);

// Mount reviews routes (with mergeParams)
app.use("/listings/:id/reviews", reviews);

// User routes
app.use("/", userRouter);

// Root Route - Redirect to Listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});


//jb sare route check krlega to yhn ayega and * means all
// app.all("*" , (req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// })

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
})

// Root route redirect to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Error handler for undefined routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is starting at port ${port}`);
});
