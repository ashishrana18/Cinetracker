const { application } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    console.log("   !")
    res.render("./users/signup.ejs");
})

router.post("/signup",async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        console.log(username,email,password);
        // const newUser = new User({email,username});
        const newUser = new User({
            username:username,
            email:email
            //we cant store password in this,as password is not defined in user schema model
        })
        const registeredUser = await User.register(newUser,password); //save password from here
        console.log(newUser);
        req.logIn(registeredUser,(err)=>{
            if(err){next(err);} 
            req.flash("success","Welcome to Cinetracker");
            res.redirect("/movies");
        })
    }catch(err){
        req.flash("error",err.message);
        // next(err);
        res.redirect("/signup");
    }
})

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
})

router.post("/login",passport.authenticate("local",{ failureRedirect: '/login', failureFlash : true} ),async(req,res,next)=>{
    try{
        req.flash("success","Welcome back to Cinetracker!");
        res.redirect("/movies");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/login");
    }
})

router.get("/logout", (req, res, next) => {
    req.logout((err)=>{
        if(err) next(err);
    });
    console.log("Logged out!");
    req.flash("success","You have been logged out!"); // Flash message after logout
    res.redirect("/movies"); // Redirecting the user
});


module.exports = router;