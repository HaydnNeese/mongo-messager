//initiate the scrape articles function
$("#article-scrape").on("click", function (event, err) {
    event.preventDefault();
    if (!err) {
        console.log("clicked");
        //scrape gamespot
        $.get("/scrape").then(data => {
            // clear #article-div or remove all with class 'article'
            window.location = "/articles";
        });
    } else {
        console.log(err);
    }
});


//empty the database of articles
$("#clear-scrape").on("click", function (event, err) {
    event.preventDefault();
    if (!err) {
        console.log("clicked");
        $.ajax({
            url: "/api/delete",
            type: "DELETE",
            success: function () {
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        })
    } else {
        console.log(err);
    }
});

//save article on click
$(document).on("click", ".save-article", function () {
    event.preventDefault();
    //use the data attribute stored on the button to identify which article the buttons is referencing
    var article = {};
    article.id = $(this).data("id");
    article.saved = true;
    $.ajax({
        method: "POST",
        url: "/api/save/",
        data: article
    }).then(function (data) {
        console.log(data);
        location.reload();
    });
});

//change the article to unsaved on click
$(".unsave-article").on("click", function () {
    event.preventDefault();
    var article = {};
    article.id = $(this).data("id");
    article.saved = true;
    $.ajax({
        method: "POST",
        url: "/api/unsave",
        data: article
    }).then(function (data) {
        location.reload();
    });
});

//add note to article
$(".comment-article").on("click", function() {
    event.preventDefault();
    let article = {};
    article.id = $(this).data("id");
    $.ajax({
        method: "PATCH",
        url: "/api/findcomment",
        data: article
    }).then(data => { 
        $(`#comment-box-${article.id}`).text("");
        $(`#comment-box-${article.id}`).append(data.note.body);
    });
})

//submit the note to article
$(".submit-comment").on("click", function() {
    event.preventDefault();
    let comment = {};
    comment.id = $(this).data("id");
    $.ajax({
        method: "POST",
        url: "/api/comment/" + comment.id,
        data: {
            body: $(`#comment-box`).val().trim()
        }
    }).then(data => {
        location.reload();
    });
});

//delete note from article
$(".delete-comment").on("click", function() {
    event.preventDefault();
    let article = {};
    article.id = $(this).data("id");
    $.ajax({
        method: "POST",
        url: "/api/deletecomment/" + article.id,
        data: article
    }).then(data => {
        $(`#note-title-${article.id}`).val('empty');
        $(`#note-title-${article.id}`).text('');
        $(`#note-body-${article.id}`).val('');
        console.log("note ajax return");
    });
});