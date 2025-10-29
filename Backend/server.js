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

const userInfoRoute = require("./Routes/userInfo.js");
app.use("/auth", userInfoRoute);

const creatorInfoRoute = require("./Routes/userInfo.js");
app.use("/auth", creatorInfoRoute);




app.listen(3000);
console.log("Server is running");
