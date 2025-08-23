const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const taskRoutes = require('./routes/taskRouter');

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/taskDB")
  .then(() => console.log("taskDB connected"))
  .catch((err) => console.error(err));

app.use('/tasks', taskRoutes);

app.listen(3000, ()=>{
  console.log('Server running at 3000')
})