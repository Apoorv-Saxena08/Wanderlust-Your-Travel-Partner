const express = require("express");
const app = express();
const users = require("./routes/user");
const posts = require("./routes/post");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


// app.use(cookieParser());


// //cookie - name : value pair m jati h 
// app.get("/getcookies" , (req,res)=>{
//     res.cookie("greet" , "namaste");
//     res.send("Sending cookies.......");
// })

// //using cookie
// app.get("/greet" , (req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi , ${name}`);
// })

//************************************/
//signed cookie - stamp lgana thru "secret code"
// app.use(cookieParser("secretcode"));

// app.get("/getsigned" , (req,res)=>{
//     res.cookie("madeIn" , "India" , {signed:true});
//     res.send("Signed cookie sent !!");
// })
// //agr tampering (chedkhani) kri , to vo {} ya false dikhayga
// app.get("/verify", (req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// //********************************************* */
// app.get("/" , (req,res) =>{
//     //console.dir(req.cookies);
//     res.send("Hi , i am root");
// })

// app.use("/users" , users);
// app.use("/posts",posts);
const sessionOptions = {
    secret :"mysupersecret",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
     //usng locals
    res.locals.messages = req.flash("success");
    next();
})

app.get("/register" , (req,res)=>{
    let {name = "anonymous"} = req.query;
    //created a new var in session object
    req.session.name = name ;
    req.flash("success","User registered successfully");
    res.redirect("/hello");
    // res.send(name);
})

app.get("/hello" , (req,res)=>{
    res.render("page.ejs", {name :  req.session.name} );
})


// app.use("/reqcount" , (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`you have sent reuest ${req.session.count} times`);
// })

// app.get("/test" , (req,res)=>{
//     res.send("test successfull");
// })


app.listen(3000 ,()=>{
    console.log("Server is listening at port 3000"); 
})