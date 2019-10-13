const   express             = require('express'),
        app                 = express(),
        bodyParser          = require('body-parser'),
        mongoose            = require('mongoose'),
        flash               = require('connect-flash'),
        passport            = require('passport'),
        LocalStrategy       = require('passport-local'),
        methodOverride      = require('method-override'),
        fs                  = require('fs'),
        currentDir          = 'current/',
        Est                 = require("./models/est"),
        User                = require("./models/user"),
        Comment             = require("./models/comment"),
        middleware          = require("./middleware"),
        rimraf              = require("rimraf");

// REQUIRING ROUTES
var commentRoutes   = require("./routes/comments");

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

app.use("/est/:id/comments", commentRoutes);

// ROUTES
app.get('/est', function(req, res){
    res.redirect('/');
});

// SHOW REGISTER FORM
app.get("/register", function(req, res){
    res.render("register");
});

// HANDLE SIGH UP LOGIC
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});

// HANDLE LOGIN LOGIC
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/est",
        failureRedirect: "/login"
    }), function(req, res){
    });

// LOGOUT ROUTE
app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/est");
});

// INDEX ROUTE
app.get('/', function(req, res){
    Est.find({}, function(err, ests){
        if(err){
            console.log(err);
        }else{
            res.render('index', {ests: ests});
        }
    });
});

// NEW ROUTE
app.get('/est/new', middleware.isLoggedIn, function(req, res){
    res.render('new');
});

// CREATE ROUTE
app.post('/est', middleware.isLoggedIn, function(req, res){
    var firstName   = req.body.firstName,
        lastName    = req.body.lastName,
        unit        = req.body.unit,
        lot         = req.body.lot,
        series      = req.body.series,
        model       = req.body.model,
        houseNumber = req.body.houseNumber,
        street      = req.body.street,
        redFile     = req.body.redFile,
        issue       = req.body.issue,
        poTotal     = req.body.poTotal,
        margin      = req.body.margin,
        description = req.body.description;
    var tempJobNumber = firstName[0] + lastName[0] + unit + "-" + lot;
    if(tempJobNumber.length <= 8){
        var jobNumber = tempJobNumber;
    }else{
        var jobNumber = firstName[0] + lastName[0] + unit + lot;
    }
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var dir = currentDir + jobNumber;
    // CREATE DIRECTORY AND SUB DIRECTORIES
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        fs.mkdirSync(dir + "/Emails");
        fs.mkdirSync(dir + "/RedFile");
        fs.mkdirSync(dir + "/Materials");
        fs.mkdirSync(dir + "/Pos");
        fs.mkdirSync(dir + "/Drawings");
        fs.mkdirSync(dir + "/Plans");
        fs.mkdirSync(dir + "/TakeOff");
        fs.mkdirSync(dir + "/FS");
        fs.mkdirSync(dir + "/Pics");

        // GET DATA FROM FORM AND ADD TO EST ARRAY
        
        var newEst = {
            jobNumber: jobNumber,
            firstName: firstName,
            lastName: lastName,
            unit: unit,
            lot: lot,
            series: series,
            model: model,
            houseNumber: houseNumber,
            street: street,
            redFile: redFile,
            issue: issue,
            poTotal: poTotal,
            margin: margin,
            description: description,
            author: author
        };
        // CREATE NEW EST AND SAVE TO DB
        Est.create(newEst, function(err, newlyCreated){
            if(err){
                console.log(err);
            }else{
                console.log(newlyCreated);
                res.redirect('/est');
            } 
        });  
    }else{
        res.send('A Directory Named ' + dir + ' Already Exits');
    } 
}); 

// SHOW ROUTE
app.get('/est/:id', function(req, res){
    Est.findById(req.params.id).populate("comments").exec(function(err, foundEst){
        if(err){
            console.log(err);
        }else{
            //console.log(foundEst.jobNumber);
            res.render('show', {est: foundEst});
        }
    });
});

// EDIT ROUTE
app.get("/est/:id/edit", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("edit", {est: foundEst});
    });
});

// UPDATE ROUTE
app.put("/est/:id", middleware.checkEstOwnership, function(req, res){
    // FIND AND UPDATE CORRECT EST
    Est.findByIdAndUpdate(req.params.id, req.body.est, function(err, updatedEst){
        if(err){
            res.redirect("/est");
        }else{
            res.redirect("/est/" + req.params.id);
        }
    });
});

// DESTROY ROUTE

app.delete("/est/:id", function(req, res){
    // REMOVE DIRECTORIES
    Est.findById(req.params.id, function(err, foundEst){
        rimraf(currentDir + foundEst.jobNumber, function(){
            console.log("removed " + foundEst.jobNumber);
        });
    });
    // REMOVE FROM DB
    Est.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/est');
        }
    });
});

// SOON TO BE ARCHIVE ROUTE

app.listen(process.env.PORT || '3000', process.env.IP, function(){
    console.log('Server Is Live');
});