// Requiring scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models")

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        axios.get("https://www.gamespot.com/")
            .then(function (response) {
                //get data loaded from the webpage and store inside of cheerio represented by $
                var $ = cheerio.load(response.data);
                var result = [];

                $("article.media-video").each(function (i, element) {

                    title = $(element).find("h3.media-title").text();
                    summary = $(element).find("p.media-deck").text();
                    link = $(element).find("a").attr("href");
                    image = $(element).find("img").attr("src");
                    time = $(element).find("time.media-date").text();

                    result.push({
                        title: title,
                        summary: summary,
                        link: link,
                        image: image,
                        time: time
                    });

                });
                if (title && summary && link) {
                    result.forEach(function (element, i) {
                        db.Article.find({ title: result[i].title }, function (err, data) {
                            if (data.length === 0) {
                                console.log("all required fields exist, and no duplicates, making new Article");
                                db.Article.create(result[i])
                                    .then(function (dbArticle) {
                                        db.Article.insertMany(dbArticle, function (err) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                                console.log("New Article Created and saved to DB");
                            }
                        })
                    })
                }


            })
            .catch(function (err) {
                console.log(err);
            });
        res.send(`Scrape Complete`);
    });
};