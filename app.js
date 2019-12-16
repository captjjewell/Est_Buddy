const   express             = require('express'),
        app                 = express(),
        bodyParser          = require('body-parser'),
        mongoose            = require('mongoose'),
        flash               = require('connect-flash'),
        passport            = require('passport'),
        LocalStrategy       = require('passport-local'),
        methodOverride      = require('method-override'),
        Est                 = require("./models/est"),
        User                = require("./models/user"),
        Comment             = require("./models/comment"),
        middleware          = require("./middleware"),
        TakeOffFloorCarpet  = require("./models/takeOffFloorCarpet"),
        TakeOffFloorTile    = require("./models/takeOffFloorTile"),
        TakeOffFloorVinyl  = require("./models/takeOffFloorVinyl"),
        TakeOffFloorLVP  = require("./models/takeOffFloorLVP");

// REQUIRING ROUTES
var commentRoutes   = require("./routes/comments"),
    tv_nhcRoutes    = require("./routes/tv_nhc"),
    indexRoutes     = require("./routes/index");
    //takeOffRoutes   = require("./routes/takeOff");


mongoose.connect('mongodb://localhost:27017/est_buddy', {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Zeba is the best dog ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH MESSAGE SETUP
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/tv_nhc", tv_nhcRoutes);
app.use("/tv_nhc/:id/comments", commentRoutes);
//app.use("/tv_nhc/:id/takeOff", takeOffRoutes);

// SORT ROUTE
app.post('/sort', function(req,res){
    var sortOrder = req.body.order;
    var sortParam = req.body.sortBy;
    var sort = {};
    sort[sortParam] = sortOrder;
    Est.find({}).sort(sort).exec(function(err,ests){
        if(err){
            console.log(err);
        } else {
            res.render('tv_nhc/index', {ests: ests});
        }
    });
});



app.listen(process.env.PORT || '3000', process.env.IP, function(){
    console.log('Server Is Live');
});