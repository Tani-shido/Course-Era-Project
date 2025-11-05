const express = require("express");
const { z } = require('zod');
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsMiddleware");
const uploadMiddleware = require("../Middlewares/UploadMiddleware");
const { courseModel } = require("../Models/CourseModel");


const router = express.Router();

const courseInfoSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(1),
    isPublished: z.boolean().default(false)
});

// Post route to get upload course  
router.post("/upload", authMiddleware , creatorMiddleware , uploadMiddleware , async (req, res) => {
    try{
        if(!req.file){
            return res.json({
                message: "No file found"
            });
        }
        console.log("it worked");
        console.log("Uploaded file URL: ", req.file.path);
        console.log("Instructor username", req.user.username);

        const courseInfo = courseInfoSchema.safeParse(req.body);

        if(!courseInfo.success){
            return res.json({
                mesaage: "Details are in wrong format"
            });
        }

        console.log("Data parsed successfully");

        const { title, description, price, isPublished } = courseInfo.data;
        const thumbnailUrl = req.file.path;
        const instructor = req.user.username;

        const uploadCourse = await courseModel.create({
            title, description, price, isPublished, thumbnailUrl, instructor
        });




        return res.json({
            message: "It's done. Course uploaded successfully",
            uploadCourse,
            public_id: req.file.filename
        });


    }
    catch(e){
        return res.json({
            message: "File upload failed"
        });
    }
});

// Post route to add a lesson in course
// router.post("/", async(req, res) => {

// });

// // Put Route to update the course
// router.put("/", async(req, res) => {

// });

// // Delete Route to delete the course
// router.delete("/", async(req, res) => {

// });

module.exports = router;


