const Est       = require("../models/est");
const Comment   = require("../models/comment");

// ALL MIDDLEWARE
var middlewareObj = {};

middlewareObj.checkEstOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Est.findById(req.params.id, function(err, foundEst){
            if(err){
                req.flash("error", "Job not found");
                res.redirect("back");
            }else{
                // CHECK IF USER OWNS ENTRY
                if(foundEst.author.id.equals(req.user._id)) {
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect('/login');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                // CHECK IF USER OWNS COMMENT
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect('/login');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect('/login');
}

module.exports = middlewareObj;