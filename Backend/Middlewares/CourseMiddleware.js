const { AccountModel } = require("../Models/AccountModel");
const { CourseModel } = require("../Models/CourseModel");


const courseMiddleware = async (req, res, next) => {
    try{

        const creatorId = req.user._id;

        const courseId = req.params.courseId;

        if(!courseId){
            res.json({
                message: "Course Id not received"
            });
        }
        else{
            console.log(creatorId, courseId);
            
            const course = await CourseModel.findOne({ instructor: creatorId, _id: courseId }).select("thumbnailUrlId");
            
            if(!course){
                res.json({
                    message: "Public Id not found. either creator is wrong or the course is"
                })
            }
            
            const publicId = course.thumbnailUrlId;
            
            if(!publicId){
                res.json({
                    message: "Public Id not found in the course"
                });
            }
            
            console.log(publicId);
            
            next();
        }
    }
    catch(e){
        res.json({
            message: "it failed"
        });
    }
}

module.exports = courseMiddleware