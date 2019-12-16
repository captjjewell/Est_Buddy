const mongoose = require("mongoose");

var takeOffSchemaFloorVinyl = mongoose.Schema({
    location: String,
    material: {
        style: String,
        color: String,
        width: String,
        length: String,
        patternRepeat: String,
        patternMatches: String
    },
    estimate: {
        net: String,
        gross: String,
        waste: String
    },
    installerNotes: String,
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("TakeOffFloorVinyl", takeOffSchemaFloorVinyl);