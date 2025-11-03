const express = require("express");
const router = express.Router();
const { z } = require("zod");
const authMiddleware = require("../Middlewares/AuthMiddleware")
const { AccountModel } = require("../Models/AccountModel");

// To get and validate, user ed-data
const foiSchema = z.object({
    fields: z.array(z.string().min(1)).min(3)
});

// To parse data from json 
(express.json());
// Post route to get creator ed-info
router.put("/foi", authMiddleware , async (req, res) => {
    try{
        const fieldInfo = foiSchema.safeParse(req.body);

        if(!fieldInfo.success){
            res.json({
                message: "Fields of interest are not recieved"
            });
        }
        else{
            try{
                const field = fieldInfo.data.fields;

                console.log(field);

                const AddField = await AccountModel.findByIdAndUpdate(req.user._id, {
                    $set: {
                        "FieldsOfInterest.interests": field
                    }
                }, { new: true }).select("-password");

                res.json({
                    message: "Field of interests are saved in DB",
                    user: AddField
                }, console.log("FOI Added"));

            }catch(e){
                return res.json({
                    message: "Field of interests are not saved in DB"
                },console.log(e));
                
            }
        }
    }
    catch(e){
        res.json({
            message: "Some error in the parsing"
        });
        console.log("error is", e);
    }


});

module.exports = router;