const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsMiddleware");
const { AccountModel } = require("../Models/AccountModel");


// Post route to get upload course  
router.post("/upload/course", authMiddleware , creatorMiddleware , async (req, res) => {


    console.log("route req.user: ", req.user);

    return res.json({
        message: "it's done"
    });
    
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
