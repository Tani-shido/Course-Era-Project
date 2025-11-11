const express = require("express");
const { z } = require('zod');
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsMiddleware");
const courseMiddleware = require("../Middlewares/CourseMiddleware");
const { CourseModel } = require("../Models/CourseModel");
const multer = require("multer");
const { storage } = require("../cloudinary");
const { cloudinary } = require("../cloudinary");

const router = express.Router();


// // Put Route to update the course
router.put("/update-file/:courseId", authMiddleware, creatorMiddleware, courseMiddleware , async(req, res) => {
    try{
        const public_id = publicId;


        res.json({
            message: "Passed"
        })
    }
    catch(e){
        res.json({
            message: "Failed"
        });
    }

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

router.put("/update-course", authMiddleware, creatorMiddleware, async(req, res) => {
    try{
        const updateInfo = updateInfoSchema.safeParse(req.body);
        const courseId = req.body.courseId;
        const creatorId = req.user._id;

        if(!updateInfo.success){
            return res.json({
                message: "Info is not available or in wrong format"
            });
        }else if(!courseId){
            return res.json({
                message: "Course Id not received"
            });
        }

        console.log("course ID is: ", courseId);


        const { title, description, price, isPublished, thumbnailUrl, thumbnailUrlId } = updateInfo.data;

        try{

            const updatedInfo = await CourseModel.findOneAndUpdate({ _id: courseId, instructor: creatorId } ,
                {
                    $set: {
                        title,
                        description,
                        price,
                        isPublished,
                        thumbnailUrl,
                        thumbnailUrlId
                    }
                }, { new: true, runValidators: true }
            );

            console.log("Updated course is: ", updatedInfo);


            if(!updatedInfo){
                res.json({
                    message: "Course not updated in DB"
                });
            }
            else{
   
                console.log("It's Updated");
                
                return res.json({
                    message: "Course Updated Successfully!",
                    course: updatedInfo
                });
            }
        }
        catch(e){
            return res.json({
                message: "Course not found in DB"
            },console.log(e));
        }
    }
    catch(e){
        return res.json({
            message: "Course Not Updated"
        });
    }

});

module.exports = router;
