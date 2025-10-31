// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());

const router = express.Router();

// To validate data
const { z, safeParse, array } = require("zod");

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
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in FOI")).catch(err => console.error("DB connection error: ", err));

// To get and validate, user ed-data
const foiSchema = z.object({
    fields: z.array(z.string().min(1)).min(3)
});

// Post route to get creator ed-info
router.put("/foi", authMiddleware , async (req, res) => {
    try{
        const fieldInfo = foiSchema.safeParse(req.body);

        if(fieldInfo.success){
            res.json({
                message: "Fields of interest are not recieved"
            });
        }
        else{
            console.log(fieldInfo.data);

            try{
                const field = fieldInfo.data;

                const AddField = await AccountModel.updateOne(req.user._id, {
                    $set: {
                        "FieldOfInterest": field
                    }
                }, { new: true }).select("-password");

                res.json({
                    message: "Field of interests are saved in DB",
                    AddField
                });

            }catch(e){
                res.json({
                    message: "Field of interests are not saved in DB"
                });
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