const mongoose = require("mongoose");
const { courseModel } = require("./CourseModel")
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Account = new Schema({
    email: {type: String, unique: true},
    password: {type: String},
    username: {type: String},
    dob: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    country: {type: String},
    language: {type: String},
    role: {type: String, required: true, enum: ['user', 'creator']},
    
    fieldsOfInterest: {
        interests: [{type: String}]
    },

    education: {
        institute: {type: String, require: true},
        education: {type: String, require: true},
        status: {type: String, enum: ['Pursuing', 'Dropped-Out', 'Completed', 'Others']},
        grade: {type: String, require: true},
        occupation: {type: String, require: true}
    },
    courses: {
        course_ids: {
            type: Schema.Types.ObjectId,
            ref: "CourseModel",
            required: true
        }
    }
}, {
    timestamps: true
});


const AccountModel = mongoose.model("Account-info", Account);

module.exports = { AccountModel }

