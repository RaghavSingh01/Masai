const express = require('express');
const app = express();
const todoRoutes = require('./routes/todoRoutes');

app.use(express.json());

app.use('/todos', todoRoutes);

app.use((req, res) => {
    res.status(404).json({message: '404 Page Not Found'});
});

app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).json({
        message: 'Server error'
    });
});

app.listen(3000, ()=>{
    console.log("DB Listening");
})
