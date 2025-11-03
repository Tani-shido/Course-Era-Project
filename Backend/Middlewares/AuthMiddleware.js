const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET;
const { AccountModel } = require("../Models/AccountModel");

const authMiddleware = async (req, res, next) => {
    try{

        console.log("auth middleware");
        
        const headerToken = req.headers.authorization;

        console.log("Header Token is: ", headerToken);
        
        if(!headerToken){
            if(!headerToken.startsWith('Bearer ')){
                return res.json({
                    message: "Token is wrong formated"
                });
            }
            return res.json({
                message: "Token missing"
            });
        }
            
            console.log("headerToken is correct");
            
            const token = headerToken.split(' ')[1];
            
            try{
                
                const decoded = jwt.verify(token, JWT_SECRET_KEY);
                
                console.log("Decoded thing: ", decoded);
                
                req.user = await AccountModel.findById(decoded.userId).select("-password");
                
                console.log("Authentication check Passed, User name is : ", req.user.username);
                
                if(!req.user){
                    return res.json({
                        message: "User not found"
                    },console.log("User nahi mil raha"));
                    
                }
                next();
            }
            catch(e){
                return res.json({
                    message: "Token galat batara miya"
                });
            }
            
    }
    catch(e){
        console.error(e);
        res.json({
            message: "Authentication error ser"
        });
    }
    

}

module.exports = authMiddleware;