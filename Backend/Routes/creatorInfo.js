const express = require("express");
const router = express.Router();
const { z,  } = require("zod");
const authMiddleware = require("../Middlewares/AuthMiddleware")
const { AccountModel } = require("../Models/AccountModel");

// To get and validate, user ed-data
const creatorEdDataSchema = z.object({
    nameOfInstitue: z.string().min(1),
    ifDroppedOrComplete: z.enum(["Pursuing", "Dropped-Out", "Completed", "Others"]),
    lastEducation: z.string().min(1),
    grade: z.string().min(1),
    currentOccupation: z.string().min(1)
});

// To parse data from json 
(express.json());
// Post route to get creator ed-info
router.put("/creator-info", authMiddleware , async (req, res) => {
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
                
                const updatedCreator = await AccountModel.findByIdAndUpdate(req.user._id, {
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