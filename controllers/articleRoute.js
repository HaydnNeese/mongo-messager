
const db = require('../models');

module.exports = function (app) {
    //save articles
    app.post("/api/save", (req, res) => {
        db.Article.updateOne({ _id: req.body.id }, { $set: { saved: req.body.saved } }, {}, data => {
            res.json(data);
        });
    });
    //unsave articles
    app.post("/api/unsave", (req, res) => {
        db.Article.updateOne({ _id: req.body.id }, { $set: { saved: false } }, {}, data => {
            res.json(data);
        });
    });
    //delete articles
    app.delete("/api/delete", (req, res) => {
        db.Article.remove({ saved: false }, data => {
            res.json(data);
        });
    });

    app.post("/api/findcomment", (req, res) => {
        db.Article.findOne({ _id: req.body.id })
            .populate("comment")
            .then(dbArticle => {
                console.log("dbArticle response with note hopefully" + dbArticle)
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/api/comment/:id", (req, res) => {
        console.log(req.body)
        db.Comment.create(req.body).then(dbComment => {
            console.log(`
            -----------
            dbComment id: ${dbComment._id}
            -----------`)
            db.Article.updateOne({ _id: req.params.id }, { comments: dbComment._id }).then(response => {
                console.log("Response from article update: " + response);
            })
        }).catch(err => {
            console.log(err);
        });
    });

    app.post("/api/deletecomment/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(dbArticle => {
                console.log(dbArticle);
                const commentId = dbArticle.comment._id;
                return db.Note.findByIdAndRemove(commentId);
            })
            .then(() => {
                res.json({ "message": "success" });
            })
            .catch(err => {
                res.json(err);
            });
    });
};