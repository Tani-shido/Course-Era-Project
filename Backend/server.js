// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// To store confidential info
require("dotenv").config();

// To save the data in DB
const mongoose = require("mongoose");
// To connect to DB
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected sucessfully in main server")).catch(err => console.error("DB connection error", err));

const signupRoute = require("./Routes/signup.js");
app.use("/auth", signupRoute);

const loginRoute = require("./Routes/login.js");
app.use("/auth", loginRoute);

const userInfoRoute = require("./Routes/userInfo.js");
app.use("/profile", userInfoRoute);

const creatorInfoRoute = require("./Routes/creatorInfo.js");
app.use("/profile", creatorInfoRoute);

const foiRoute = require("./Routes/foi.js");
app.use("/profile",  foiRoute);

const courseRoute = require("./Routes/course.js");
app.use("/course", courseRoute);

const uploadCourseRoute = require("./Routes/uploadCourse.js");
app.use("/course", uploadCourseRoute);

const updateCourseRoute = require("./Routes/updateCourse.js");
app.use("/course", updateCourseRoute);

const deleteCourseRoute = require("./Routes/deleteCourse.js");
app.use("/course", deleteCourseRoute);



app.listen(3000);
console.log("Server is running");
