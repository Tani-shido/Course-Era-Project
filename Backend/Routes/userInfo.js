const express = require("express");
const router = express.Router();
const { z } = require("zod");
const authMiddleware = require("../Middlewares/AuthMiddleware")
const { AccountModel } = require("../Models/AccountModel");
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
                
                const updatedUser = await AccountModel.findByIdAndUpdate(req.user._id, {
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