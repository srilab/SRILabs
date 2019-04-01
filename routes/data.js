const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      User       = require("../models/user"),
      Data       = require("../models/data"),
      Labs       = require("../models/labs"),
      middleware = require("../middleware"),
      mysql      = require("mysql");
      
const { isLoggedIn, checkUserPost, isTeacher } = middleware;

var hooverData = mysql.createConnection({
    host: "particle.wirelessrewired.com",
    database: "hoover_data",
    user: "uaSTEM",
    password: "uaSTEM2019!"
})

hooverData.connect(function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("MySQL Database Connected");
    }
});

router.get("/", function(req, res) {
    Data.find({}, function(err, allData) {
        if(err) {
            console.log(err);
        } else {
            res.render("data/index", {data: allData, page: 'data'})
        }
    });
});

router.get("/5c92953b1c9d440000c847bf", function(req, res) {
    Data.findById("5c92953b1c9d440000c847bf", function(err, foundData) {
        if(err) {
            console.log(err);
            res.redirect("data");
        } else {
            hooverData.query("SELECT latitude, longitude FROM hh_airquality LIMIT 1", function(err, results, fields) {
                if(err) {
                    console.log(err);
                } else {
                    var coords = "latitude: " + results[0].latitude + " longitude: " + results[0].longitude;
                    hooverData.query("SELECT temp_f FROM hh_airquality LIMIT 1", function(err, results, fields) {
                        if(err) {
                            console.log(err);
                        } else {
                            var temp = results[0].temp_f;
                            hooverData.query("SELECT heat_index FROM hh_airquality LIMIT 1", function(err, results, fields) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    var heat_index = results[0].heat_index;
                                    hooverData.query("SELECT dust FROM hh_airquality LIMIT 1", function(err, results, fields) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            var dust = results[0].dust;
                                            hooverData.query("SELECT humidity FROM hh_airquality LIMIT 1", function(err, results, fields) {
                                                if(err) {
                                                    console.log(err);
                                                } else {
                                                    var humidity = results[0].humidity;
                                                    res.render("data/air_qual", {data: foundData, page: 'data', coordinates: coords, temp: temp, heat_index: heat_index, dust: dust, humidity: humidity});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get("/:id", function(req, res) {
    Data.findById(req.params.id, function(err, foundData) {
        if(err || !foundData) {
            console.log(err);
            res.redirect("data");
        } else {
            res.render("data/show", {data: foundData, page: 'data'});
        }
    });
});

module.exports = router;