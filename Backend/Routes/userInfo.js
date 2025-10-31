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
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in User")).catch(err => console.error("DB connection error: ", err));

// To get and validate, user ed-data
const userEdDataSchema = z.object({
    nameOfInstitue: z.string().min(1),
    ifDroppedOrComplete: z.enum(["Pursuing", "Dropped-Out", "Completed", "Others"]),
    lastEducation: z.string().min(1),
    grade: z.string().min(1)
});

//Post route to get user ed-info 
router.put("/User-Info", authMiddleware , async (req, res) => {
    const userEducation = userEdDataSchema.safeParse(req.body);
    
    if(!userEducation.success){
        res.json({
            message: "Data not parsed sucessfully"
        });
    }
    else{
        console.log(userEducation.data);
        
        try{
            
                const { nameOfInstitue, ifDroppedOrComplete, lastEducation, grade } = userEducation.data;
                
                const updatedUser = await AccountModel.updateOne(req.user._id, {
                    $set: { 
                        "education.institute": nameOfInstitue,
                        "education.status": ifDroppedOrComplete,
                        "education.education": lastEducation,
                        "education.grade": grade
                    }
            }, { new: true }).select("-password");

            res.json({
                message: "Data parsed sucessfully",
                user: updatedUser
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