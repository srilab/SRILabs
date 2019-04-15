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

router.get("/labs/aqiava", isLoggedIn, function(req, res) {
            hooverData.query("SELECT latitude, longitude FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                if(err) {
                    console.log(err);
                } else {
                    var latitude = [results[0].latitude, results[1].latitude, results[2].latitude, results[3].latitude, results[4].latitude, results[5].latitude, results[6].latitude, results[7].latitude, results[8].latitude, results[9].latitude];
                    var longitude = [results[0].longitude, results[1].longitude, results[2].longitude, results[3].longitude, results[4].longitude, results[5].longitude, results[6].longitude, results[7].longitude, results[8].longitude, results[9].longitude];
                    hooverData.query("SELECT temp_f FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                        if(err) {
                            console.log(err);
                        } else {
                            var temp = [results[0].temp_f, results[1].temp_f, results[2].temp_f, results[3].temp_f, results[4].temp_f, results[5].temp_f, results[6].temp_f, results[7].temp_f, results[8].temp_f, results[9].temp_f];
                            hooverData.query("SELECT heat_index FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    var heat_index = [results[0].heat_index, results[1].heat_index, results[2].heat_index, results[3].heat_index, results[4].heat_index, results[5].heat_index, results[6].heat_index, results[7].heat_index, results[8].heat_index, results[9].heat_index];
                                    hooverData.query("SELECT dewpoint FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            var dewpoint = [results[0].dewpoint, results[1].dewpoint, results[2].dewpoint, results[3].dewpoint, results[4].dewpoint, results[5].dewpoint, results[6].dewpoint, results[7].dewpoint, results[8].dewpoint, results[9].dewpoint];
                                            hooverData.query("SELECT dust FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                            if(err) {
                                                console.log(err);
                                            } else {
                                                var dust = [results[0].dust, results[1].dust, results[2].dust, results[3].dust, results[4].dust, results[5].dust, results[6].dust, results[7].dust, results[8].dust, results[9].dust];
                                                hooverData.query("SELECT humidity FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                                    if(err) {
                                                        console.log(err);
                                                    } else {
                                                        var humidity = [results[0].humidity, results[1].humidity, results[2].humidity, results[3].humidity, results[4].humidity, results[5].humidity, results[6].humidity, results[7].humidity, results[8].humidity, results[9].humidity];
                                                        request("https://soco.wirelessrewired.com/php/getAfricaDataJSON.php", function(error, response, body) {
                                                            if(!error && response.statusCode === 200) {
                                                                const data = JSON.parse(body);
                                                                var i = data.length-1;
                                                                res.render("labs/aqiava", {page: 'labs', 
                                                                    hLat1: latitude[0], hLat2: latitude[1], hLat3: latitude[2], hLat4: latitude[3], hLat5: latitude[4], hLat6: latitude[5], hLat7: latitude[6], hLat8: latitude[7], hLat9: latitude[8], hLat10: latitude[9],
                                                                    hLong1: longitude[0], hLong2: longitude[0], hLong3: longitude[2], hLong4: longitude[3], hLong5: longitude[4], hLong6: longitude[5], hLong7: longitude[6], hLong8: longitude[7], hLong9: longitude[8], hLong10: longitude[9],
                                                                    hTemp1: temp[0], hTemp2: temp[1], hTemp3: temp[2], hTemp4: temp[3], hTemp5: temp[4], hTemp6: temp[5], hTemp7: temp[6], hTemp8: temp[7], hTemp9: temp[8], hTemp10: temp[9],          
                                                                    hHeat_index1: heat_index[0], hHeat_index2: heat_index[1], hHeat_index3: heat_index[2], hHeat_index4: heat_index[3], hHeat_index5: heat_index[4], hHeat_index6: heat_index[5], hHeat_index7: heat_index[6], hHeat_index8: heat_index[7], hHeat_index9: heat_index[8], hHeat_index10: heat_index[9],         
                                                                    hDewpoint1: dewpoint[0], hDewpoint2: dewpoint[1], hDewpoint3: dewpoint[2], hDewpoint4: dewpoint[3], hDewpoint5: dewpoint[4], hDewpoint6: dewpoint[5], hDewpoint7: dewpoint[6], hDewpoint8: dewpoint[7], hDewpoint9: dewpoint[8], hDewpoint10: dewpoint[9], 
                                                                    hDust1: dust[0], hDust2: dust[1], hDust3: dust[2], hDust4: dust[3], hDust5: dust[4], hDust6: dust[5], hDust7: dust[6], hDust8: dust[7], hDust9: dust[8], hDust10: dust[9],
                                                                    hHumidity1: humidity[0], hHumidity2: humidity[1], hHumidity3: humidity[2], hHumidity4: humidity[3], hHumidity5: humidity[4], hHumidity6: humidity[5], hHumidity7: humidity[6], hHumidity8: humidity[7], hHumidity9: humidity[8], hHumidity10: humidity[9], 
                                                                    aLat1: data[i]["latitude"], aLat2: data[i-1]["latitude"], aLat3: data[i-2]["latitude"], aLat4: data[i-3]["latitude"], aLat5: data[i-4]["latitude"], aLat6: data[i-5]["latitude"], aLat7: data[i-6]["latitude"], aLat8: data[i-7]["latitude"], aLat9: data[i-8]["latitude"], aLat10: data[i-9]["latitude"], 
                                                                    aLong1: data[i]["longitude"], aLong2: data[i-1]["longitude"], aLong3: data[i-2]["longitude"], aLong4: data[i-3]["longitude"], aLong5: data[i-4]["longitude"], aLong6: data[i-5]["longitude"], aLong7: data[i-6]["longitude"], aLong8: data[i-7]["longitude"], aLong9: data[i-8]["longitude"], aLong10: data[i-9]["longitude"], 
                                                                    aTemp1: data[i]["temp_f"], aTemp2: data[i-1]["temp_f"], aTemp3: data[i-2]["temp_f"], aTemp4: data[i-3]["temp_f"], aTemp5: data[i-4]["temp_f"], aTemp6: data[i-5]["temp_f"], aTemp7: data[i-6]["temp_f"], aTemp8: data[i-7]["temp_f"], aTemp9: data[i-8]["temp_f"], aTemp10: data[i-9]["temp_f"],  
                                                                    aHeat_index1: data[i]["heat_index"], aHeat_index2: data[i-1]["heat_index"], aHeat_index3: data[i-2]["heat_index"], aHeat_index4: data[i-3]["heat_index"], aHeat_index5: data[i-4]["heat_index"], aHeat_index6: data[i-5]["heat_index"], aHeat_index7: data[i-6]["heat_index"], aHeat_index8: data[i-7]["heat_index"], aHeat_index9: data[i-8]["heat_index"], aHeat_index10: data[i-9]["heat_index"],   
                                                                    aDust1: data[i]["dust"], aDust2: data[i-1]["dust"], aDust3: data[i-2]["dust"], aDust4: data[i-3]["dust"], aDust5: data[i-4]["dust"], aDust6: data[i-5]["dust"], aDust7: data[i-6]["dust"], aDust8: data[i-7]["dust"], aDust9: data[i-8]["dust"], aDust10: data[i-9]["dust"], 
                                                                    aHumidity1: data[i]["humidity"], aHumidity2: data[i-1]["humidity"], aHumidity3: data[i-2]["humidity"], aHumidity4: data[i-3]["humidity"], aHumidity5: data[i-4]["humidity"], aHumidity6: data[i-5]["humidity"], aHumidity7: data[i-6]["humidity"], aHumidity8: data[i-7]["humidity"], aHumidity9: data[i-8]["humidity"], aHumidity10: data[i-9]["humidity"], 
                                                                    aDewpoint1: data[i]["dewpoint"], aDewpoint2: data[i-1]["dewpoint"], aDewpoint3: data[i-2]["dewpoint"], aDewpoint4: data[i-3]["dewpoint"], aDewpoint5: data[i-4]["dewpoint"], aDewpoint6: data[i-5]["dewpoint"], aDewpoint7: data[i-6]["dewpoint"], aDewpoint8: data[i-7]["dewpoint"], aDewpoint9: data[i-8]["dewpoint"], aDewpoint10: data[i-9]["dewpoint"], 
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

router.get("/5c92953b1c9d440000c847bf", function(req, res) {
    Data.findById("5c92953b1c9d440000c847bf", function(err, foundData) {
        if(err) {
            console.log(err);
            res.redirect("data");
        } else {
            hooverData.query("SELECT latitude, longitude FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                if(err) {
                    console.log(err);
                } else {
                    var latitude = [results[0].latitude, results[1].latitude, results[2].latitude, results[3].latitude, results[4].latitude, results[5].latitude, results[6].latitude, results[7].latitude, results[8].latitude, results[9].latitude];
                    var longitude = [results[0].longitude, results[1].longitude, results[2].longitude, results[3].longitude, results[4].longitude, results[5].longitude, results[6].longitude, results[7].longitude, results[8].longitude, results[9].longitude];
                    hooverData.query("SELECT temp_f FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                        if(err) {
                            console.log(err);
                        } else {
                            var temp = [results[0].temp_f, results[1].temp_f, results[2].temp_f, results[3].temp_f, results[4].temp_f, results[5].temp_f, results[6].temp_f, results[7].temp_f, results[8].temp_f, results[9].temp_f];
                            hooverData.query("SELECT heat_index FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    var heat_index = [results[0].heat_index, results[1].heat_index, results[2].heat_index, results[3].heat_index, results[4].heat_index, results[5].heat_index, results[6].heat_index, results[7].heat_index, results[8].heat_index, results[9].heat_index];
                                    hooverData.query("SELECT dewpoint FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            var dewpoint = [results[0].dewpoint, results[1].dewpoint, results[2].dewpoint, results[3].dewpoint, results[4].dewpoint, results[5].dewpoint, results[6].dewpoint, results[7].dewpoint, results[8].dewpoint, results[9].dewpoint];
                                            hooverData.query("SELECT dust FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                            if(err) {
                                                console.log(err);
                                            } else {
                                                var dust = [results[0].dust, results[1].dust, results[2].dust, results[3].dust, results[4].dust, results[5].dust, results[6].dust, results[7].dust, results[8].dust, results[9].dust];
                                                hooverData.query("SELECT humidity FROM hh_airquality ORDER BY timestamp DESC LIMIT 10", function(err, results, fields) {
                                                    if(err) {
                                                        console.log(err);
                                                    } else {
                                                        var humidity = [results[0].humidity, results[1].humidity, results[2].humidity, results[3].humidity, results[4].humidity, results[5].humidity, results[6].humidity, results[7].humidity, results[8].humidity, results[9].humidity];
                                                        request("https://soco.wirelessrewired.com/php/getAfricaDataJSON.php", function(error, response, body) {
                                                            if(!error && response.statusCode === 200) {
                                                                const data = JSON.parse(body);
                                                                var i = data.length-1;
                                                                res.render("data/air_qual", {data: foundData, page: 'data', 
                                                                    hLat1: latitude[0], hLat2: latitude[1], hLat3: latitude[2], hLat4: latitude[3], hLat5: latitude[4], hLat6: latitude[5], hLat7: latitude[6], hLat8: latitude[7], hLat9: latitude[8], hLat10: latitude[9],
                                                                    hLong1: longitude[0], hLong2: longitude[0], hLong3: longitude[2], hLong4: longitude[3], hLong5: longitude[4], hLong6: longitude[5], hLong7: longitude[6], hLong8: longitude[7], hLong9: longitude[8], hLong10: longitude[9],
                                                                    hTemp1: temp[0], hTemp2: temp[1], hTemp3: temp[2], hTemp4: temp[3], hTemp5: temp[4], hTemp6: temp[5], hTemp7: temp[6], hTemp8: temp[7], hTemp9: temp[8], hTemp10: temp[9],          
                                                                    hHeat_index1: heat_index[0], hHeat_index2: heat_index[1], hHeat_index3: heat_index[2], hHeat_index4: heat_index[3], hHeat_index5: heat_index[4], hHeat_index6: heat_index[5], hHeat_index7: heat_index[6], hHeat_index8: heat_index[7], hHeat_index9: heat_index[8], hHeat_index10: heat_index[9],         
                                                                    hDewpoint1: dewpoint[0], hDewpoint2: dewpoint[1], hDewpoint3: dewpoint[2], hDewpoint4: dewpoint[3], hDewpoint5: dewpoint[4], hDewpoint6: dewpoint[5], hDewpoint7: dewpoint[6], hDewpoint8: dewpoint[7], hDewpoint9: dewpoint[8], hDewpoint10: dewpoint[9], 
                                                                    hDust1: dust[0], hDust2: dust[1], hDust3: dust[2], hDust4: dust[3], hDust5: dust[4], hDust6: dust[5], hDust7: dust[6], hDust8: dust[7], hDust9: dust[8], hDust10: dust[9],
                                                                    hHumidity1: humidity[0], hHumidity2: humidity[1], hHumidity3: humidity[2], hHumidity4: humidity[3], hHumidity5: humidity[4], hHumidity6: humidity[5], hHumidity7: humidity[6], hHumidity8: humidity[7], hHumidity9: humidity[8], hHumidity10: humidity[9], 
                                                                    aLat1: data[i]["latitude"], aLat2: data[i-1]["latitude"], aLat3: data[i-2]["latitude"], aLat4: data[i-3]["latitude"], aLat5: data[i-4]["latitude"], aLat6: data[i-5]["latitude"], aLat7: data[i-6]["latitude"], aLat8: data[i-7]["latitude"], aLat9: data[i-8]["latitude"], aLat10: data[i-9]["latitude"], 
                                                                    aLong1: data[i]["longitude"], aLong2: data[i-1]["longitude"], aLong3: data[i-2]["longitude"], aLong4: data[i-3]["longitude"], aLong5: data[i-4]["longitude"], aLong6: data[i-5]["longitude"], aLong7: data[i-6]["longitude"], aLong8: data[i-7]["longitude"], aLong9: data[i-8]["longitude"], aLong10: data[i-9]["longitude"], 
                                                                    aTemp1: data[i]["temp_f"], aTemp2: data[i-1]["temp_f"], aTemp3: data[i-2]["temp_f"], aTemp4: data[i-3]["temp_f"], aTemp5: data[i-4]["temp_f"], aTemp6: data[i-5]["temp_f"], aTemp7: data[i-6]["temp_f"], aTemp8: data[i-7]["temp_f"], aTemp9: data[i-8]["temp_f"], aTemp10: data[i-9]["temp_f"],  
                                                                    aHeat_index1: data[i]["heat_index"], aHeat_index2: data[i-1]["heat_index"], aHeat_index3: data[i-2]["heat_index"], aHeat_index4: data[i-3]["heat_index"], aHeat_index5: data[i-4]["heat_index"], aHeat_index6: data[i-5]["heat_index"], aHeat_index7: data[i-6]["heat_index"], aHeat_index8: data[i-7]["heat_index"], aHeat_index9: data[i-8]["heat_index"], aHeat_index10: data[i-9]["heat_index"],   
                                                                    aDust1: data[i]["dust"], aDust2: data[i-1]["dust"], aDust3: data[i-2]["dust"], aDust4: data[i-3]["dust"], aDust5: data[i-4]["dust"], aDust6: data[i-5]["dust"], aDust7: data[i-6]["dust"], aDust8: data[i-7]["dust"], aDust9: data[i-8]["dust"], aDust10: data[i-9]["dust"], 
                                                                    aHumidity1: data[i]["humidity"], aHumidity2: data[i-1]["humidity"], aHumidity3: data[i-2]["humidity"], aHumidity4: data[i-3]["humidity"], aHumidity5: data[i-4]["humidity"], aHumidity6: data[i-5]["humidity"], aHumidity7: data[i-6]["humidity"], aHumidity8: data[i-7]["humidity"], aHumidity9: data[i-8]["humidity"], aHumidity10: data[i-9]["humidity"], 
                                                                    aDewpoint1: data[i]["dewpoint"], aDewpoint2: data[i-1]["dewpoint"], aDewpoint3: data[i-2]["dewpoint"], aDewpoint4: data[i-3]["dewpoint"], aDewpoint5: data[i-4]["dewpoint"], aDewpoint6: data[i-5]["dewpoint"], aDewpoint7: data[i-6]["dewpoint"], aDewpoint8: data[i-7]["dewpoint"], aDewpoint9: data[i-8]["dewpoint"], aDewpoint10: data[i-9]["dewpoint"], 
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