const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET;
const { AccountModel } = require("../Models/AccountModel");

const creatorMiddleware = async (req, res, next) => {
    try{
        if(req.user){
            
            return res.json({
                message: "Creator Authentication Done"
            })
        }
    }
    catch(e){
        return res,json({
            message: "Creator Authentication Failed"
        })
    }
}

module.exports = creatorMiddleware;