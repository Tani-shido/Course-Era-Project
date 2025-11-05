const express = require("express");
const { z } = require('zod');
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsMiddleware");
const uploadMiddleware = require("../Middlewares/UploadFileMiddleware");
const { courseModel } = require("../Models/CourseModel");


const router = express.Router();

// Post route to get upload content file  
router.post("/upload-file", authMiddleware , creatorMiddleware , uploadMiddleware , async (req, res) => {
    try{
        if(!req.file){
            return res.json({
                message: "No file found"
            });
        }
        console.log("it worked");
        console.log("Uploaded file URL: ", req.file.path);
        console.log("Instructor username", req.user.username);

        return res.json({
            message: "It's done. File uploaded successfully",
            url: req.file.path,
            public_id: req.file.filename
        });


    }
    catch(e){
        return res.json({
            message: "File upload failed"
        });
    }
});

// courseInfoSchema to validate json course data
const courseInfoSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(1),
    isPublished: z.boolean().default(false),
    thumbnailUrl: z.string().url(),
    thumbnailUrlId: z.string().min(1)
});

// Post route to upload course
router.post("/upload-course", authMiddleware, creatorMiddleware, async(req, res) => {
    try{
        const courseInfo = courseInfoSchema.safeParse(req.body);

        if(!courseInfo.success){
            return res.json({
                mesaage: "Details are either not received or in wrong format"
            });
        }

        console.log("Data parsed successfully");

        const { title, description, price, isPublished, thumbnailUrl, thumbnailUrlId } = courseInfo.data;

        

        const uploadCourse = await courseModel.create({
            title, description, price, isPublished, thumbnailUrl, thumbnailUrlId , instructor: req.user._id
        });

        res.json({
            message: "It is Done, Course is uploaded",
            course: uploadCourse
        },console.log("Course Uploaded successfully"));

    }
    catch(e){
        return res.json({
            message: "Course not uploaded",
            
        },console.error(e));
    }
});

// // Put Route to update the course
// router.put("/", async(req, res) => {

// });

// // Delete Route to delete the course
// router.delete("/", async(req, res) => {

// });

module.exports = router;


// https://res.cloudinary.com/dvtvxtya6/image/upload/v1762342050/course-era-project/trkei6k2xpzz0hpodb7x.png
// course-era-project/trkei6k2xpzz0hpodb7x