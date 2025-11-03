const multer = require("multer");
const { storage } = require("../cloudinary");

const upload = multer({ 
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

const uploadMiddleware = (req, res, next) => {

    console.log("=== UPLOAD MIDDLEWARE START ===");

    const SingleUpload = upload.single('file');

    SingleUpload(req, res, (err) => {

        if (err) {
            console.error("=== UPLOAD MIDDLEWARE ERROR ===");
            console.error("Error type:", err.constructor.name);
            console.error("Error message:", err.message);
            console.error("Full error:", err);
            
            if(err instanceof multer.MulterError){
                return res.json({
                    message: "File upload error:" + err.message,
                    code: err.code
                });
            }
            return res.json({
                message: "Upload error: " + err.message,
                error: err.toString()
            });

        }

        console.log("=== UPLOAD MIDDLEWARE SUCCESS ===");
        console.log("File received:", req.file ? "Yes" : "No");

        if(req.file){
            console.log("File details:", {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
        }
        next();
    });

}

module.exports = uploadMiddleware;