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
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in education")).catch(err => console.error("DB connection error: ", err));

// To get and validate, user ed-data
const foiSchema = z.object({

});

// Post route to get creator ed-info
router.put("/foi", authMiddleware , async (req, res) => {
    
});

module.exports = router;