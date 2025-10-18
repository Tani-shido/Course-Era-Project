// To Run Srever
const express = require("express");
const app = express();
// To parse data from json 
app.use(express.json());

// To validate data
const { z } = require("zod");


// Post route: to take form inputs, validate it, and saves it.
app.post("/signup", (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const dob = req.body.dob;
        const firstname = req.body.firstname;
        const lastName = req.body.lastName;
        const country = req.body.country;
        const language = req.body.language;

        const formSchema = z.object({
           email: z.email(),
           password: z.string().min(8).max(16),
           username: z.string().min(1),
           dob: z.date(),
           firstname: z.string().min(1),
           lastName: z.string().min(1),
           country: z.string().min(1),
           language: z.string().min(1)
        });

        if(!formSchema){
            res.json({
                message: "Enter correct details"
        });    
        }
        res.json({
            message: "Details recieved",
            email
        });
        console.log(email);
    }catch(e){
        res.json({
            message: "Details not recieved",
        });

    }
});


app.listen(3000);
console.log("Server is running");
