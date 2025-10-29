// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());

const router = express.Router();

// To validate data
const { z, safeParse } = require("zod");

// To return jwt as response
const jwt = require("jsonwebtoken");   
const JWT_SECRET_KEY = process.env.JWT_SECRET;

// To incrypt data
const bcrypt = require("bcrypt");

// To store confidential info
require("dotenv").config();

const authMiddleware = require("../Middlewares/AuthMiddleware")

// To save the data in DB
const mongoose = require("mongoose");
const { AccountModel } = require("../Models/AccountModel");
const { error } = require("console");

// To connect to DB
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in education")).catch(err => console.error("DB connection error: ", err));

// To get and validate, user ed-data
const creatorEdDataSchema = z.object({
    nameOfInstitue: z.string().min(1),
    ifDroppedOrComplete: z.enum(["Pursuing", "Dropped-Out", "Completed", "Others"]),
    lastEducation: z.string().min(1),
    grade: z.string().min(1),
    currentOccupation: z.string().min(1)
});

// Post route to get creator ed-info
router.put("/Creator-Info", authMiddleware , async (req, res) => {
    const creatorEducation = creatorEdDataSchema.safeParse(req.body);
    
    if(!creatorEducation.success){
        res.json({
            message: "Data not parsed sucessfully"
        });
    }
    else{
        console.log(creatorEducation.data);
        
        try{
            
                const { nameOfInstitue, ifDroppedOrComplete, lastEducation, grade, currentOccupation } = creatorEducation.data;
                
                const updatedCreator = await AccountModel.updateOne(req.user._id, {
                    $set: { 
                        "education.institute": nameOfInstitue,
                        "education.status": ifDroppedOrComplete,
                        "education.education": lastEducation,
                        "education.grade": grade,
                        "education.Occupation": currentOccupation
                    }
            }, { new: true }).select("-password");

            res.json({
                message: "Data parsed sucessfully",
                user: updatedCreator
            });
        }

        catch(err){
            res.json({
                message: "Details not recieved"
            });
            console.error(err);
        }
    }
});

module.exports = router;