const express = require("express")

const app = express()

app.get("/home", (req, res)=>{
    res.send("This is home page")
})

app.get("/contactus", (req, res) => {
    res.send("Contact us at contact@contact.com")
})

app.listen(3000,() => {
    console.log("Port 3000 listening")
})