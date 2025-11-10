const express = require("express");
const { z } = require('zod');
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsMiddleware");
const courseMiddleware = require("../Middlewares/CourseMiddleware");
const { CourseModel } = require("../Models/CourseModel");
const { cloudinary } = require("../cloudinary");


const router = express.Router();


// Delete Route to delete the file
router.delete("/delete/file", authMiddleware, creatorMiddleware, courseMiddleware, async(req, res) => {
    try{

        const publicId = publicId;

        console.log("Public Id to delete content file");

        const deleteFile = await cloudinary.uploader.destroy(publicId);

        res.json({
            message: "File Deleted",
            deleteFile
        })
    }
    catch(e){
        return res.json({
            message: "File not Deleted"
        }, console.log())
    }
});

// // Delete Route to delete the course
router.delete("/delete-course/:courseId", authMiddleware, creatorMiddleware, async(req, res) => {
    try{

        console.log("hi there");
        
        const courseId = req.params.courseId;
        
        console.log("Course Id is: ", courseId);

        const deleteCourse = await CourseModel.findByIdAndDelete(courseId);

        if(!deleteCourse){
            return res.json({
                message: "Course not found"
            });
        }
        return res.json({
            message: "Course Deleted"
        });
    }
    catch(e){
        return res.json({
            message: "Course Not Deleted"
        });
    }
});

module.exports = router;
