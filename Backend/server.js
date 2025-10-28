// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());

// To validate data
const { z, safeParse } = require("zod");

// To return jwt as response
const jwt = require("jsonwebtoken");   
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// To incrypt data
const bcrypt = require("bcrypt");

// To store confidential info
require("dotenv").config();

// To save the data in DB
const mongoose = require("mongoose");
const { AccountModel } = require("./Models/AccountModel.js");
const { error } = require("console");
// const MONGO_URL = process.env.MONGO_URL;

// To connect to DB
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in main server")).catch(err => console.error("DB connection error", err));

const signupRoute = require("./Routes/signup.js");
app.use("/auth", signupRoute);

const loginRoute = require("./Routes/login.js");
app.use("/auth", loginRoute);

// To get and validate, user ed-data
const userEdDataSchema = z.object({
    role: z.enum(["user", "creator"]),
    nameOfInstitue: z.string().min(1),
    ifDroppedOrComplete: z.enum(["Pursuing", "Dropped-Out", "Completed", "Others"]),
    lastEducation: z.string().min(1),
    grade: z.string().min(1)
});

//Post route to get user ed-info 
app.post("/education-info", async (req, res) => {
    try{
        const userEducation = userEdDataSchema.safeParse(req.body);

        if(!userEducation.success){
            res.json({
                message: "Data not parsed sucessfully"
            });
        }
        else{
            console.log(userEducation.data);

            const userEducationUpdation = await AccountModel.insertOne({ 
                institute: userEducation.nameOfInstitue,
                status: userEducation.ifDroppedOrComplete,
                education: userEducation.lastEducation,
                grade: userEducation.grade
            });

            res.json({
                message: "Data parsed sucessfully",
                AccountModel: {
                    userEducationUpdation: userEducation._id
                }
            });
        }

    }catch(err){
        res.json({
            message: "Details not recieved"
        });
        console.error(err);
    }
});

// Post route to get creator ed-info
app.post("/creator-info", async (res, req) => {
    // hello there
});





app.listen(3000);
console.log("Server is running");
