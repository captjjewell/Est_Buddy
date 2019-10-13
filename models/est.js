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
    takeOff: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TakeOff"
        }
    ]
});

module.exports = mongoose.model("Est", estSchema);