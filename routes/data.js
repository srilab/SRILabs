const express    = require("express"),
      request    = require("request"),
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
                                    hooverData.query("SELECT dewpoint FROM hh_airquality LIMIT 1", function(err, results, fields) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            var dewpoint = results[0].dewpoint;
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
                                                        request("https://soco.wirelessrewired.com/php/getAfricaDataJSON.php", function(error, response, body) {
                                                            if(!error && response.statusCode === 200) {
                                                                const data = JSON.parse(body);
                                                                var i = data.length-1;
                                                                var aCoordinates = "latitude: " + data[i]["latitude"] + " longitude: " + data[i]["longitude"];
                                                                res.render("data/air_qual", {data: foundData, page: 'data', 
                                                                    hCoordinates: coords,       hTemp: temp,              hHeat_index: heat_index,            hDust: dust,            hHumidity: humidity,            hDewpoint: dewpoint,
                                                                    aCoordinates: aCoordinates, aTemp: data[i]["temp_f"], aHeat_index: data[i]["heat_index"], aDust: data[i]["dust"], aHumidity: data[i]["humidity"], aDewpoint: data[i]["dewpoint"]
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