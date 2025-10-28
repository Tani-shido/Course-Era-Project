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
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// To incrypt data
const bcrypt = require("bcrypt");

// To store confidential info
require("dotenv").config();

// To save the data in DB
const mongoose = require("mongoose");
const { AccountModel } = require("../Models/AccountModel");
const { error } = require("console");
// const MONGO_URL = process.env.MONGO_URL;

// To connect to DB
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in login")).catch(err => console.error("DB connection error", err));


// To get and validate, LOGIN DATA
const loginSchema = z.object({
    emailName: z.string().min(1),
    password: z.string().min(1)
});

// login Post route: to take inputs, validate, generate jwt token, logs-in
router.post("/login", async(req, res) => {
    try{
        
        console.log("Before safe parsing");

        const emailNamePass = loginSchema.safeParse(req.body);

        console.log("After safe parsing");

            if(!emailNamePass.success){
                res.json({
                    message: "Details either not recieved or in wrong format"
                });
                console.log("Details either not recieved or in wrong format");
            }else{

                console.log("Details recieved");

                const { emailName, password } = emailNamePass.data;

                console.log("Details: ", emailName, password);

                const findUser = await AccountModel.findOne({
                    $or: [
                        { email: emailName },
                        { username: emailName }
                    ]
                });

                console.log("User found");

                if(!findUser){
                    res.json({
                        message: "Wrong email address or username"
                    });
                    console.log("Wrong email address or username");
                }else{

                    console.log("Before password check");

                    const passCheck = await bcrypt.compare(password, findUser.password);

                    if(!passCheck){
                        res.json({
                            message: "Wrong email or username"
                        });
                        console.log("Wrong email or username");
                    }else{

                        const token = jwt.sign({ userId: findUser._id }, JWT_SECRET_KEY, { expiresIn: '1d' });

                        console.log("Token is : ", token);

                        res.json({
                            message: "Congratulations! You are logged in",
                            token,
                            user: {
                                id: findUser._id,
                                username: findUser.username,
                                role: findUser.role
                            }
                        });
                        console.log("Congratulations! You are logged in")
                    }                    
                }
            }

    }catch(e){
        res.json({
            message: "Parsing error"
        });
        console.error("Parsing error", error);
    }
});

module.exports = router;