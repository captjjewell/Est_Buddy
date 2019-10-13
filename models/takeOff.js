const mongoose = require("mongoose");

var takeOffSchema = mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // VINYL ROLL 
    vinyl: [
        {
            style: String,
            color: String,
            width: String,
            length: String,
            patternMatches: String,
            direction: String,
            sqYards: String,
            adhesive: String,
            sealer: String,
            laborRate: String,
            totalLabor: String,
            note: String,
        }
    ],
    
    // VINYL PLANK
    lvp: [
        {
            style: String,
            color: String,
            width: String,
            length: String,
            netSqFt: String,
            wasteFactor: String,
            grossSqFt: String,
            direction: String,
            adhesive: String,
            endCap: String,
            reducer: String,
            tMold: String,
            laborRate: String,
            totalLabor: String,
            note: String,
        }
    ],
    // FLOOR TILE
    tile: [
        {
            style: String,
            color: String,
            width: String,
            length: String,
            netSqFt: String,
            wasteFactor: String,
            grossSqFt: String,
            pattern: String,
            direction: String,
            groutColor: String,
            caulkColor: String,
            laborRate: String,
            totalLabor: String,
            note: String,
        }
    ],
    // CARPET ROLL
    carpet: [
        {
            style: String,
            color: String,
            width: String,
            length: String,
            sqYards: String,
            laborRate: String,
            totalLabor: String,
            note: String,
        }
    ]
    // SHOWER MATERIALS
});

module.exports = mongoose.model("TakeOff", takeOffSchema);