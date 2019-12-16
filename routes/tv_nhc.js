var express     = require("express"),
    router      = express.Router(),
    Est         = require("../models/est"),
    TakeOffFloorCarpet = require("../models/takeOffFloorCarpet"),
    TakeOffFloorTile = require("../models/takeOffFloorTile"),
    TakeOffFloorVinyl = require("../models/takeOffFloorVinyl"),
    TakeOffFloorLVP = require("../models/takeOffFloorLVP"),
    middleware  = require("../middleware"),
    fs          = require('fs'),
    currentDir  = './current/',
    rimraf      = require("rimraf");



// INDEX ROUTE
router.get('/', middleware.isLoggedIn, function(req, res){
    Est.find({}, function(err, ests){
        if(err){
            console.log(err);
        }else{
            res.render('tv_nhc/index', {ests: ests});
        }
    });
});

// SORT ROUTE

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('tv_nhc/new');
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res){
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
                res.redirect('/tv_nhc');
            } 
        });  
    }else{
        res.send('A Directory Named ' + dir + ' Already Exits');
    } 
}); 

// SHOW ROUTE
router.get('/:id', function(req, res){
    Est.findById(req.params.id).populate("comments").populate("takeOffFloorLVP").populate("takeOffFloorVinyl").populate("takeOffFloorTile").populate("takeOffFloorCarpet").exec(function(err, foundEst){
        if(err){
            console.log(err);
        }else{
            //console.log(foundEst.jobNumber);
            res.render('tv_nhc/show', {est: foundEst});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/edit", {est: foundEst});
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkEstOwnership, function(req, res){
    // FIND AND UPDATE CORRECT EST
    Est.findByIdAndUpdate(req.params.id, req.body.est, function(err, updatedEst){
        if(err){
            res.redirect("/tv_nhc");
        }else{
            res.redirect("/tv_nhc/" + req.params.id);
        }
    });
});

// DESTROY ROUTE

router.delete("/:id", function(req, res){
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
            res.redirect('/tv_nhc');
        }
    });
});

// TAKE OFF TYPE ROUTE

router.get("/:id/takeOff", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/takeOff", {est: foundEst});
    });
});

// TAKEOFF FLOORING ROUTES

// TAKEOFF FLOOR MATERIAL ROUTE
router.get("/:id/takeOff-floor", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/takeOff-floor", {est: foundEst});
    });
});

// TAKEOFF FLOOR CARPET ROUTES
// SHOW FORM
router.get("/:id/takeOff-floor-carpet", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/takeOff-floor-carpet", {est: foundEst});
    });
});
// CREATE
router.post("/:id/takeOff-floor-carpet", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, est){
        if(err){
            console.log(err);
            res.redirect("/tv_nhc");
        }else{
            var location = req.body.location,
                material = req.body.material,
                style = req.body.style,
                color = req.body.color,
                width = req.body.width,
                length = req.body.length,
                padStyle = req.body.padStyle,
                padSY = req.body.padSY,
                estimate = req.body.estimate,
                net = req.body.net,
                gross = req.body.gross,
                waste = req.body.waste,
                installerNotes = req.body.installerNotes;
            var author = {
                id: req.user._id,
                username: req.user.username
            };

            var newTakeOff = {
                location: location,
                material: material,
                style: style,
                color: color,
                width: width,
                length: length,
                padStyle: padStyle,
                padSY: padSY,
                estimate: estimate,
                net: net,
                gross: gross,
                waste: waste,
                installerNotes: installerNotes,
                author: author
            };

            TakeOffFloorCarpet.create(newTakeOff, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }else{
                    newlyCreated.save();
                    est.takeOffFloorCarpet.push(newlyCreated);
                    est.save();
                    console.log(est);
                    res.redirect("/tv_nhc/" + est._id);
                }
            });
        }
    });
});

// TAKEOFF FLOOR TILE ROUTE
// SHOW FORM
router.get("/:id/takeOff-floor-tile", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/takeOff-floor-tile", {est: foundEst});
    });
});
// CREATE
router.post("/:id/takeOff-floor-tile", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, est){
        if(err){
            console.log(err);
            res.redirect("/tv_nhc");
        }else{
            var location = req.body.location,
                material = req.body.material,
                style = req.body.style,
                color = req.body.color,
                width = req.body.width,
                length = req.body.length,
                direction = req.body.direction,
                pattern = req.body.pattern,
                groutStyle = req.body.groutStyle,
                groutColor = req.body.groutColor,
                estimate = req.body.estimate,
                net = req.body.net,
                gross = req.body.gross,
                tileCount = req.body.tileCount,
                waste = req.body.waste,
                installerNotes = req.body.installerNotes;
            var author = {
                id: req.user._id,
                username: req.user.username
            };

            var newTakeOff = {
                location: location,
                material: material,
                style: style,
                color: color,
                width: width,
                length: length,
                direction: direction,
                pattern: pattern,
                groutStyle: groutStyle,
                groutColor: groutColor,
                estimate: estimate,
                net: net,
                gross: gross,
                tileCount: tileCount,
                waste: waste,
                installerNotes: installerNotes,
                author: author
            };

            TakeOffFloorTile.create(newTakeOff, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }else{
                    newlyCreated.save();
                    est.takeOffFloorTile.push(newlyCreated);
                    est.save();
                    //console.log(newlyCreated);
                    console.log(est.takeOffFloorTile);
                    res.redirect("/tv_nhc/" + est._id);
                }
            });
        }
    });
});

// TAKEOFF FLOOR VINYL ROUTES
// SHOW FORM
router.get("/:id/takeOff-floor-vinyl", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/takeOff-floor-vinyl", {est: foundEst});
    });
});
// CREATE
router.post("/:id/takeOff-floor-vinyl", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, est){
        if(err){
            console.log(err);
            res.redirect("/tv_nhc");
        }else{
            var location = req.body.location,
                material = req.body.material,
                style = req.body.style,
                color = req.body.color,
                patternRepeat = req.body.patternRepeat,
                patternMatches = req.body.patternMatches,
                width = req.body.width,
                length = req.body.length,
                estimate = req.body.estimate,
                net = req.body.net,
                gross = req.body.gross,
                waste = req.body.waste,
                installerNotes = req.body.installerNotes;
            var author = {
                id: req.user._id,
                username: req.user.username
            };

            var newTakeOff = {
                location: location,
                material: material,
                style: style,
                color: color,
                patternRepeat: patternRepeat,
                patternMatches: patternMatches,
                width: width,
                length: length,
                estimate: estimate,
                net: net,
                gross: gross,
                waste: waste,
                installerNotes: installerNotes,
                author: author
            };

            TakeOffFloorVinyl.create(newTakeOff, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }else{
                    newlyCreated.save();
                    est.takeOffFloorVinyl.push(newlyCreated);
                    est.save();
                    console.log(est);
                    res.redirect("/tv_nhc/" + est._id);
                }
            });
        }
    });
});

// TAKEOFF FLOOR LVP ROUTES
// SHOW FORM
router.get("/:id/takeOff-floor-lvp", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/takeOff-floor-lvp", {est: foundEst});
    });
});
// CREATE
router.post("/:id/takeOff-floor-lvp", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, est){
        if(err){
            console.log(err);
            res.redirect("/tv_nhc");
        }else{
            var location = req.body.location,
                material = req.body.material,
                style = req.body.style,
                color = req.body.color,
                width = req.body.width,
                length = req.body.length,
                direction = req.body.direction,
                pattern = req.body.pattern,
                estimate = req.body.estimate,
                net = req.body.net,
                gross = req.body.gross,
                waste = req.body.waste,
                installerNotes = req.body.installerNotes;
            var author = {
                id: req.user._id,
                username: req.user.username
            };

            var newTakeOff = {
                location: location,
                material: material,
                style: style,
                color: color,
                width: width,
                length: length,
                direction: direction,
                pattern: pattern,
                estimate: estimate,
                net: net,
                gross: gross,
                waste: waste,
                installerNotes: installerNotes,
                author: author
            };

            TakeOffFloorLVP.create(newTakeOff, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }else{
                    newlyCreated.save();
                    est.takeOffFloorLVP.push(newlyCreated);
                    est.save();
                    console.log(est);
                    res.redirect("/tv_nhc/" + est._id);
                }
            });
        }
    });
});

// TAKEOFF FLOOR OTHER ROUTE
router.get("/:id/takeOff-floor-other", middleware.checkEstOwnership, function(req, res){
    Est.findById(req.params.id, function(err, foundEst){
        res.render("tv_nhc/takeOff-floor-other", {est: foundEst});
    });
});

// SOON TO BE ARCHIVE ROUTE

module.exports = router;