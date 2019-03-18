const express  = require("express"),
      router   = express.Router(),
      passport = require("passport"),
      User  = require("../models/user");
      
// ROOT ROUTE
router.get("/", function(req, res){
    res.render("home", {page: "home"});
});

// SHOW REGISTER FORM
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// HANDLE TEACHER REGISTER LOGIC
router.post("/register", function(req, res){
    console.log(req.body.type);
    var newUser = new User({
        registrationKey: req.body.key, 
        email: req.body.email, 
        username: req.body.username,
        type: req.body.type
    });
    User.register(newUser, req.body.password, function(err, teacher) {
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate('local')(req, res, function () {
            req.flash("success", "Welcome to SRI EnviroLabs " + req.body.username);
            res.redirect('/');
        });
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
        // successFlash: 'Welcome to YelpCamp!'
    }), function(req, res){
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Successfully Logged Out.");
   res.redirect("/");
});

module.exports = router;