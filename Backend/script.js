const express = require("express");
const app = express();
app.use = (express.json());

app.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstname;
    const lastName = req.body.lastName;

    
    
});

app.listen(3000);
console.log("Server is running");
