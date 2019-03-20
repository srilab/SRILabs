var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var LabSchema = new mongoose.Schema({
    title: String,
    description: String,
    body: String
});

LabSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Labs", LabSchema);