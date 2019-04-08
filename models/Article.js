//create article model for mongoose
//require mongoose
var mongoose = require("mongoose");

//this is a schema object from mongoose
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String
    }, 
    time: {
        type: String
    },
    saved: {
        type: Boolean,
        default: false
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Comment"   
    }]
});


const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;