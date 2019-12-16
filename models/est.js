var mongoose = require('mongoose');

const estSchema = new mongoose.Schema({
    jobNumber: String,
    firstName: String,
    lastName: String,
    unit: String,
    lot: String,
    series: String,
    model: String,
    houseNumber: String,
    street: String,
    poTotal: String,
    margin: String,
    description: String,
    redFile: String,
    issue: String,
    created: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    takeOffFloorCarpet: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TakeOffFloorCarpet"
        }
    ],
    takeOffFloorTile: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TakeOffFloorTile"
        }
    ],
    takeOffFloorVinyl: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TakeOffFloorVinyl"
        }
    ],
    takeOffFloorLVP: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TakeOffFloorLVP"
        }
    ]
});

module.exports = mongoose.model("Est", estSchema);