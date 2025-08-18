const express = require('express');

const app = express();

const homeRoute = require('./Routes/homeRoute');
const contactusRoute = require('./Routes/contactRoute');
const aboutusRoute = require('./Routes/aboutusRoute');

app.use('/home', homeRoute);
app.use('/aboutus', aboutusRoute);
app.use('/contactus', contactusRoute);

app.use((req,res)=>{
    res.status(404).send('404 not found');
});

app.listen(3000, ()=>{
    console.log('DB listening');
});
