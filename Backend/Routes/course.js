const express = require("express");
const { z } = require('zod');
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsMiddleware");
const uploadMiddleware = require("../Middlewares/UploadFileMiddleware");
const { courseModel } = require("../Models/CourseModel");
const { cloudinary } = require("../cloudinary");


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

// uploadInfoSchema to validate course data
const uploadInfoSchema = z.object({
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
        const courseInfo = uploadInfoSchema.safeParse(req.body);

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
router.put("/update-file", async(req, res) => {
//  This is here too
});

// updateInfoSchema to validate updated course data
const updateInfoSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(1),
    isPublished: z.boolean().default(false),
    thumbnailUrl: z.string().url(),
    thumbnailUrlId: z.string().min(1)   
});

router.put("/update-course/:courseId", authMiddleware, creatorMiddleware, async(req, res) => {
    try{
        const updateInfo = updateInfoSchema.safeParse(req.body);
        const courseId = req.params.courseId;

        if(!updateInfo.success){
            return res.json({
                message: "Info is not available or in wrong format"
            });
        }else if(!courseId){
            console.log("course ID is: ", courseId);
            return res.json({
                message: "Course Id not received"
            });
        }

        const { title, description, price, isPublished, thumbnailUrl, thumbnailUrlId } = updateInfo.data;

        try{

            const updatedInfo = await courseModel.findByIdAndUpdate(courseId,
                {
                    $set: {
                        title,
                        description,
                        price,
                        isPublished,
                        thumbnailUrl,
                        thumbnailUrlId 
                    }
                }, { new: true }
            );
            
            return res.json({
                message: "Course Updated Successfully!",
                Course: updatedInfo
                
            }, console.log("It's Updated"));
        }
        catch(e){
            return res.json({
                message: "Course not found in DB"
            },console.log(e));
        }
    }
    catch(e){
        return res.json({
            message: "Course Not Update"
        });
    }

});

// Delete Route to delete the file
router.delete("/delete/file", authMiddleware, creatorMiddleware, async(req, res) => {
    try{

        const public_id = await courseModel.findById({
            instructor: req.user._id
        });

        const deleteFile = await cloudinary.uploader.destroy(public_id);
    }
    catch(e){
        return res.json({
            message: "File not Deleted"
        })
    }
});

// // Delete Route to delete the course
router.delete("/delete-course", authMiddleware, creatorMiddleware, async(req, res) => {
    try{
        const deleteCourse = await courseModel.findByIdAndDelete(req.user._id);
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

// add course_ids in creator schema
// then use it to find file's public_id
// delete course from mongo db
// delete cloudinary file too

// check if duplicate course is not uploaded (link should be different) *Debatable