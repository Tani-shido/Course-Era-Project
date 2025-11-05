const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// console.log("--- DEBUGGING CLOUDINARY VARS ---");
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret Exists:", !!process.env.CLOUDINARY_API_SECRET);
console.log("-----Cloudinary-----");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "course-era-project",
        allowed_formats: ["jpeg", "png", "jpg", "mp4", "mp3"],
        resource_type: "auto"
    }
});

module.exports = {
    cloudinary,
    storage
}