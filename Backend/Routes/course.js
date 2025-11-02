const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/AuthMiddleware");
const creatorMiddleware = require("../Middlewares/CreatorsOnlyMiddleware");
const { AccountModel } = require("../Models/AccountModel");


// Post route to get upload course  
router.post("/upload/course", authMiddleware , creatorMiddleware , async (req, res) => {

    const searchResult = searchSchema.safeParse(req.body);

    if(!searchResult.success){
        return res.json({
            message: "Details are not recieved"
        });
    }

    
});

// Post route to add a lesson in course
router.post("/", async(req, res) => {

});

// Put Route to update the course
router.put("/", async(req, res) => {

});

// Delete Route to delete the course
router.delete("/", async(req, res) => {

});

module.exports = router;
