const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET;
const { AccountModel } = require("../Models/AccountModel");

const authMiddleware = async (req, res, next) => {
    try{

        console.log("auth middleware");
        
        const headerToken = req.headers.token;

        console.log("Header Token is: ", headerToken);
        
        if(!headerToken ){
            return res.json({
                message: "token missing"
            });
        }
            
            console.log("headerToken is correct");
            
            const token = headerToken.split(' ')[1];
            
            try{
                
                const decoded = jwt.verify(token, JWT_SECRET_KEY);
                
                console.log("Decoded thing: ", decoded);
                
                req.user = await AccountModel.findById(decoded.userId).select("-password");
                
                console.log("This is the user: ", req.user);
                
                if(!req.user){
                    return res.json({
                        message: "User not found"
                    },console.log("User nahi mil raha"));
                    
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
        console.log(e);
    }
    

}

module.exports = authMiddleware;