const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      User       = require("../models/user"),
      Post       = require("../models/post"),
      Labs       = require("../models/labs"),
      middleware = require("../middleware");
      
const { isLoggedIn, checkUserPost, isTeacher } = middleware;

// SHOW LABS FOR USER
router.get("/:id", isLoggedIn, function(req, res) {
    res.render("labs/currLabs", {labs: req.user.labs, page: 'labs'});
});


// SHOW ALL LABS
router.get("/", isLoggedIn, isTeacher, function(req, res) {
    Labs.find({}, function(err, allLabs) {
        if(err) {
            console.log(err);
        } else {
            res.render("labs/index", {labs: allLabs, page: 'labs'})
        }
    });
})

module.exports = router;