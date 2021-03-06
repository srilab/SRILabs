const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      User       = require("../models/user"),
      Post       = require("../models/post"),
      middleware = require("../middleware");
      
const { isLoggedIn, checkUserPost } = middleware;
      
// ROOT ROUTE
router.get("/", function(req, res){
    res.render("home", {page: "home"});
});

// SHOW REGISTER FORM
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// HANDLE REGISTER LOGIC
router.post("/register", function(req, res){
    if(req.body.password !== req.body.passwordCheck) {
        req.flash("error", "Whoops! Passwords Do Not Match. Please Try Again.");
        res.redirect("/register");
    }
    var newUser = new User({
        classKey: req.body.key, 
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
            req.flash("success", "Welcome to SRI EnviroLabs " + req.body.username + "!");
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