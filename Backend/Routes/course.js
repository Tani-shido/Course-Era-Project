const express = require("express");
const router = express.Router();
const { z } = require("zod");
const authMiddleware = require("../Middlewares/AuthMiddleware")
const { AccountModel } = require("../Models/AccountModel");


// To get and validate, user ed-data
const searchSchema = z.object({
    fields: z.array(z.string().min(1)).min(3)
});

// Post route to get creator ed-info
router.post("/upload/course", authMiddleware , async (req, res) => {

    const searchResult = searchSchema.safeParse(req.body);

    if(!searchResult.success){
        return res.json({
            message: "Details are not recieved"
        });
    }
    
    
});