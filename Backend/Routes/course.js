const express = require("express");
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsMiddleware");
const uploadMiddleware = require("../Middlewares/UploadMiddleware")


const router = express.Router();

// Post route to get upload course  
router.post("/upload/course", authMiddleware , creatorMiddleware , uploadMiddleware , async (req, res) => {
    try{
        if(!req.file){
            return res.json({
                message: "No file found"
            });
        }
        console.log("it worked");

        console.log("route req.file: ", req.file.path);
        
        return res.json({
            message: "It's done. File uploaded successfully",
            url: req.file.path,
            public_id: req.file.filename
        });
    }
    catch(e){
        return res.json({
            message: "File upload failed"
        })
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
