// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());

// To validate data
const { z } = require("zod");

// To incrypt data
const bcrypt = require("bcrypt");

// To save the data in DB
const mongoose = require("mongoose");
const { userDetailsModel } = require("./db");
const MONGO_URL = "mongodb+srv://shikaridota777:ZClPvfWjJINgzaFN@cluster0.12wqhve.mongodb.net/Course-Era-Project";
// To connect to DB
mongoose.connect(MONGO_URL).then(()=>console.log("DB connected sucessfully")).catch(err => console.error("DB connection error", err));

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

// Post route: to take form inputs, validate it, and saves it.
app.post("/signup", async (req, res) => {
    try{

    console.log("Before safe parsing");
        const result = formSchema.safeParse(req.body);
    console.log("After safe parsing");
        if(!result.success){
            res.json({
                message: "Enter correct details",
                errors: result.error.issues
        });
        }
        else{
        console.log("Before result.data", result.data);
            const { email, password, username, dob, firstname, lastname, country, language } = result.data;

        console.log("After result.data and before saving it in DB");

            const savingDetails =  await userDetailsModel.create({
                email,
                password,
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
    }catch(e){
        console.error(e);
        res.json({
            message: "Details not recieved"
        });
        console.log("Validation error");
    }
});


app.listen(3000);
console.log("Server is running");
