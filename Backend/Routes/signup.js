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
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in signup")).catch(err => console.error("DB connection error", err));

// To get and validate Form data
const formSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, { message: "Must be 8 characters long" }).max(16, { message: "Maximum 16 characters" }),
    username: z.string().min(1, { message: "Username is required" }),
    dob: z.string().min(1, { message: "Date of birth is required" }),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    country: z.string().min(1),
    language: z.string().min(1),
    role: z.enum(['user', 'creator'])
});

// form-details Post route: to take form inputs, validate it, and saves it.
router.post("/signup", async (req, res) => {
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
        console.log("result.data parsed sucessfully", result.data);
            const { email, password, username, dob, firstname, lastname, country, language, role } = result.data;

            const existingUser = await AccountModel.findOne({ email });
            //  console.log("existing user: ", existingUser.username);
            if(existingUser){
                if(existingUser.email === email){
                    res.json({
                        message: "User with this email already exits..."
                    });
                }
                else if(existingUser.username === username){
                    res.json({
                        message: "User with this user-name already exits..."
                    });
                }
            }
            else{
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                console.log("Before saving it in DB");
                
                try{
                    const savingDetails =  await AccountModel.create({
                        email,
                        password: hashedPassword,
                        username,
                        dob,
                        firstname,
                        lastname,
                        country,
                        language,
                        role
                    });
                    
                    console.log("After saving it in DB");

                    const token = jwt.sign({ userId: savingDetails._id }, JWT_SECRET_KEY, { expiresIn: '1d' })
                    
                    res.json({
                        message: "Details recieved",
                        token,
                        AccountModel:{
                            ObjectId: savingDetails._id, 
                            username: savingDetails.username,
                            email: savingDetails.email,
                            role: savingDetails.role
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
        }
    }catch(e){
        console.error(e);
        res.json({
            message: "Details not recieved"
        });
        console.log("Validation error");
    }
});

module.exports = router;