const express = require("express");
const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET;

const mongoose = require("mongoose");
const { AccountModel } = require("../Models/AccountModel");

mongoose.connect(process.env.MONGO_URL).then((console.log("DB connected sucessfully in auth middleware"))).catch(err => console.error("DB connection error: ", err));

const authMiddleware = async (req, res, next) => {
    try{

        console.log("auth middleware");
        
        const headerToken = req.headers.token;
        
        if(!headerToken || !headerToken.startswith("Bearer ")){
            res.json({
                message: "token missing"
            })
            console.log("token missing");
        }

        const token = headerToken.split(' ')[1];

        try{

            const decoded = jwt.verify(token, JWT_SECRET_KEY);
            
            console.log("Decoded thing: ", decoded);
            
            req.user = AccountModel.findById(decoded.userId).select("-password");
            
            console.log("This is the user: ", req.user.model);

            if(!req.user){
                res.json({
                    message: "User not found"
                });
                console.log("User nahi mil raha");
            }
        }
        catch(e){
            res.json({
                message: "Token galat batara miya"
            });
        }

        next();
    }
    catch(e){
        res.json({
            message: "Authentication error ser"
        });
    }
    

}

module.exports = authMiddleware;