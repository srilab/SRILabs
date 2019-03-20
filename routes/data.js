const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      User       = require("../models/user"),
      Data       = require("../models/data"),
      Labs       = require("../models/labs"),
      middleware = require("../middleware");
      
const { isLoggedIn, checkUserPost, isTeacher } = middleware;

router.get("/", function(req, res) {
    Data.find({}, function(err, allData) {
        if(err) {
            console.log(err);
        } else {
            res.render("data/index", {data: allData, page: 'data'})
        }
    });
});

router.get("/:id", function(req, res) {
    Data.findById(req.params.id, function(err, foundData) {
        if(err) {
            console.log(err);
            res.redirect("data");
        } else {
            res.render("data/show", {data: foundData, page: 'data'});
        }
    });
})

module.exports = router;