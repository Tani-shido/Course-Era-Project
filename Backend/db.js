const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// const ObjectId = mongoose.Types.ObjectId;

const UserDetails = new Schema({
    email: {type: String},
    password: {type: String},
    username: {
        type: String,
        unique: true
    },
    dob: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    country: {type: String},
    language: {type: String}
}, {
    timestamps: true
});

const userDetailsModel = mongoose.model("UserDetails", UserDetails);

module.exports = { userDetailsModel }