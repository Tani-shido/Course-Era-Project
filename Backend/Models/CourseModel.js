const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { AccountModel } = require("./AccountModel");

const lessonSchema = new Schema({
    title:{type: String, required: true},
    contentType:{type: String, enum: ["video", "audio", "text"], required: true},
    contentUrl:{type: String, required: true},
    textcontent:{type: String, required: true}
});

const courseSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    thumbnailUrl: {type: String},
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "Account-info",
        required: true
    },
    isPublished:{type: Boolean, default: false},
    lessons:[lessonSchema]

}, { timestamps:true });

const courseModel = mongoose.model("CourseModel", courseSchema);

module.exports = { courseModel }

