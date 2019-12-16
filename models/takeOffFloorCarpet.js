const mongoose = require("mongoose");

var takeOffSchemaFloorCarpet = mongoose.Schema({
    location: String,
    material: {
        style: String,
        color: String,
        width: String,
        length: String,
        padStyle: String,
        padSY: String
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

module.exports = mongoose.model("TakeOffFloorCarpet", takeOffSchemaFloorCarpet);