// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());

// To validate data
const { z, safeParse } = require("zod");

// To return jwt as response
const jwt = require("jsonwebtoken");   
const JWT_SECRET_KEY = "secret";

// To incrypt data
const bcrypt = require("bcrypt");

// To store confidential info
require("dotenv").config();

// To save the data in DB
const mongoose = require("mongoose");
const { AccountModel } = require("./db");
const { error } = require("console");
// const MONGO_URL = process.env.MONGO_URL;

// To connect to DB
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully")).catch(err => console.error("DB connection error", err));

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




// To get and validate, LOGIN DATA
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

app.listen(3000);
console.log("Server is running");
