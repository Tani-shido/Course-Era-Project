// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());

// To validate data
const { z } = require("zod");

// To return jwt as response
const jsonwebtoken = require("jsonwebtoken");

// To incrypt data
const bcrypt = require("bcrypt");

// To store confidential info
require("dotenv").config();

// To save the data in DB
const mongoose = require("mongoose");
const { userDetailsModel } = require("./db");
const { error } = require("console");
// const MONGO_URL = process.env.MONGO_URL;

// To connect to DB
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully")).catch(err => console.error("DB connection error", err));

// To get and validate data
    const formSchema = z.object({
        email: z.string().email({message: "Invalid email address"}),
        password: z.string().min(8, { message: "Must be 8 characters long" }).max(16, { message: "Maximum 16 characters" }),
        username: z.string().min(1, { message: "Username is required" }),
        dob: z.string().min(1, { message: "Date of birth is required" }),
        firstname: z.string().min(1),
        lastname: z.string().min(1),
        country: z.string().min(1),
        language: z.string().min(1)
    });

// signup Post route: to take form inputs, validate it, and saves it.
app.post("/signup", async (req, res) => {
    try{

    console.log("Before safe parsing");

        const result = formSchema.safeParse(req.body);
        
    console.log("After safe parsing");

        if(!result.success){
            res.json({
                message: "Enter correct details.....result.data not safe parsed sucessfully",
                errors: result.error.issues
        });
        }
        else{
        console.log("result.data safe parsed sucessfully", result.data);
            const { email, password, username, dob, firstname, lastname, country, language } = result.data;

            const existingUser = await userDetailsModel.findOne({ username });
            if(existingUser){
                res.json({
                    message: "User with this name already exits..."
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Before saving it in DB");

            try{
                const savingDetails =  await userDetailsModel.create({
                    email,
                    password: hashedPassword,
                    username,
                    dob,
                    firstname,
                    lastname,
                    country,
                    language
                });
                
                console.log("After saving it in DB");
                
                res.json({
                    message: "Details recieved",
                    userDetailsModel:{
                        email: savingDetails.username
                    }
                });
                console.log(email);
            }
            catch(e){
                res.json({
                    message: "Duplicate details are not allowed"
                });
                console.error(e);
            }        
        }
    }catch(e){
        console.error(e);
        res.json({
            message: "Details not recieved"
        });
        console.log("Validation error");
    }
});

const loginSchema = z.object({
    emailName: z.string().min(1),
    password: z.string().min(1)
});

// login Post route: to take inputs, validate, generate jwt token, logs-in
app.post("/login", async(req, res) => {
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

                const findUser = await userDetailsModel.findOne({
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
                        res.json({
                            message: "Congratulations! You are logged in"
                        });
                        console.log("Congratulations! You are logged in")
                    }

                    // Sign a token: AUTH begins tomorrow
                    
                }
            }

    }catch(e){
        res.json({
            message: "Parsing error"
        });
        console.error("Parsing error", error);
    }
});

app.listen(3000);
console.log("Server is running");
