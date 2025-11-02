const express = require("express");
const router = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");   
const JWT_SECRET_KEY = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const { AccountModel } = require("../Models/AccountModel");

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
                        { "email": emailName },
                        { "username": emailName }
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
        console.log("Parsing error", e);
    }
});

module.exports = router;