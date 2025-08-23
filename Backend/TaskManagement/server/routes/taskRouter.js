const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');

router.post('/', async(req, res)=>{
    try{
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    }
    catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/', async(req, res)=>{
    try {
        const { title } = req.query;
        let filetr ={};

        if(title){
            filetr.title = {$regex: title, $options: 'i'};

            const tasks = await Task.find(filter);
        }
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
})


router.get('/:id', async (req, res)=>{
    try {
        const task = await Task.findById(req.params.id);
        if(!task){
            return status(404).json({
                message: 'Task not found'
            })
        }
        res.json(task);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


router.put('/:id', async(req, res)=>{
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body,{ new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


router.delete('/:id', async(req, res)=>{
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Task deleted'
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

module.exports = router;