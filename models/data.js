var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var DataSchema = new mongoose.Schema({
    title: String,
    description: String,
});

DataSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Data", DataSchema);