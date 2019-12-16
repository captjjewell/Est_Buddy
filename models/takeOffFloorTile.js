const mongoose = require("mongoose");

var takeOffSchemaFloorTile = mongoose.Schema({
    location: String,
    material: {
        style: String,
        color: String,
        width: String,
        length: String,
        direction: String,
        pattern: String,
        groutStyle: String, 
        groutColor: String
    },
    estimate: {
        tileCount: String,
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

module.exports = mongoose.model("TakeOffFloorTile", takeOffSchemaFloorTile);