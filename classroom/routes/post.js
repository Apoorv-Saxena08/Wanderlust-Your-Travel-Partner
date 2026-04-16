const express = require("express");
const router = express.Router();

//Index 
router.get("/" , (req,res)=>{
    res.send("GET for posts");
})

//Show  posts
router.get("/:id" , (req,res)=>{
    res.send("GET for show posts");
})

//Post a post
router.post("/" , (req,res)=>{
    res.send("POST for post");
})

//Delete
router.delete("/:id" , (req,res)=>{
    res.send("DELETE for post id");
})

module.exports = router;