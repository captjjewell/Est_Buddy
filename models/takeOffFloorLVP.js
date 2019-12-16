const mongoose = require("mongoose");

var takeOffSchemaFloorLVP = mongoose.Schema({
    location: String,
    material: {
        style: String,
        color: String,
        width: String,
        length: String,
        direction: String,
        pattern: String
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

module.exports = mongoose.model("TakeOffFloorLVP", takeOffSchemaFloorLVP);