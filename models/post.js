var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    body: String,
    comments: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

PostSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Post", PostSchema);