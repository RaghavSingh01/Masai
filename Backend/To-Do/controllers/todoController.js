const { readTodo, writeTodo } = require('../model/todoModel');

exports.getTodos = (req, res) => {
    const { query } = req.query;
    let todos = readTodo();
    if(query){
        const q = query.toLowerCase();
        todos = todos.filter(td => td.title.toLowerCase().includes(q));
    }
    res.json(todos);

}

exports.addTodods = (req, res) =>{
    const { title, completed = false } = req.body;
    if(!title) {
        return res.status(400).json({message: 'Title Required!'});
    }
    const todos = readTodo();
    const newTodo = { id: Date.now().toString(), title, completed: Boolean(completed)};
    todos.push(newTodo);
    writeTodo(todos);

    res.status(201).json(newTodo);
}


exports.updateTodo = (req, res) =>{
    const { id } = req.params;
    const { title, completed } = req.body;
    const todos = readTodo();
    const idx = todos.findIndex(td => td.id === id);

    if(idx === -1){
        return res.status(404).json({message: 'Task not found!'});
    }

    if(title !== undefined){
        todos[idx].title = title;
    }

    if(completed !== undefined){
        todos[idx].completed = Boolean(completed);
    }

    writeTodo(todos);
    res.json(todos[idx]);
}


exports.deleteTodo = (req, res) =>{
    const { id } = req.params;
    const todos = readTodo();
    const idx = todos.findIndex(td => td.id === id);

    if(idx === -1){
        return res.status(404).json({message: 'Task not found!'});
    }

    const removed = todos.splice(idx , 1);
    writeTodo(todos);
    res.json({message: 'Task removed'});
}