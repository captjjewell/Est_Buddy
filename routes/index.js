var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// ROOT ROUTE
router.get('/', function(req, res){
    res.render('landing');
});

// SHOW REGISTER FORM
router.get("/register", function(req, res){
    res.render("register");
});

// HANDLE SIGH UP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Account created successfully.. Welcome to Est Buddy, " + user.username + " !");
            res.redirect("/est");
        });
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/tv_nhc",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/");
});

module.exports = router;