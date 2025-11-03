const creatorMiddleware = async (req, res, next) => {
    try{
        if(req.user && req.user.role === "creator"){
            console.log("Creator Authentication check Passed");
            next();
        }
        else{    
            return res.json({
                message: "Creator not found"
            });
        }
    }
    catch(e){
        return res.json({
            message: "You are not a Creator. Authentication Failed!"
        })
    }
}

module.exports = creatorMiddleware;