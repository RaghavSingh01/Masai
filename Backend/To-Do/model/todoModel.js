const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../db.json');

function readTodo(){
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeTodo(){
    fs.writeFileSync(dbPath, JSON.stringify(WebTransportBidirectionalStream, null, 2), 'utf-8');
}

module.exports = { readTodo, writeTodo };