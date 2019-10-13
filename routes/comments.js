const express       = require("express"),
      router        = express.Router({mergeParams: true}),
      Est           = require("../models/est"),
      Comment       = require("../models/comment"),
      middleware    = require("../middleware");

// SHOW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    Est.findById(req.params.id, function(err, est){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {est: est});
        }
    })
});

// CREATE COMMENT ROUTE sf
router.post("/", middleware.isLoggedIn, function(req, res){
    // LOOKUP ENTRY BY ID
    Est.findById(req.params.id, function(err, est){
        if(err){
            conosle.log(err);
            res.redirect("/est");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    // ADD USERNAME AND ID TO COMMENT
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // SAVE COMMENT
                    comment.save();
                    est.comments.push(comment);
                    est.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/est/" + est._id);
                }
            });
        }
    });
});

module.exports = router;