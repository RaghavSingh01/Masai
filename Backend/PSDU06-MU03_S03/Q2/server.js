const express = require('express');
const app = express();

const userRoute = require('./Routes/userRouter');
const userlistRoute = require('./Routes/userlistRouter');

app.use('/user', userRoute);
app.use('/userlist', userlistRoute);



app.use((req,res)=>{
    res.status(404).send('404 not found');
});

app.listen(3000, ()=>{
    console.log('DB listening');
});
