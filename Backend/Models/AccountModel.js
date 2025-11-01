const mongoose = require("mongoose");
const { string } = require("zod");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Account = new Schema({
    userDetails: {
        email: {type: String, unique: true},
        password: {type: String},
        username: {type: String},
        dob: {type: String},
        firstname: {type: String},
        lastname: {type: String},
        country: {type: String},
        language: {type: String},
        role: {type: String, required: true, enum: ['user', 'creator']},
    },
    education: {
        institute: {type: String},
        status: {type: String, enum: ['user', "creator"]},
        education: {type: String},
        grade: {type: String}
    },
    FieldsOfInterest: {
        interests: {type: Array}
    }
}, {
    timestamps: true
});


const AccountModel = mongoose.model("Account-info", Account);

module.exports = { AccountModel }