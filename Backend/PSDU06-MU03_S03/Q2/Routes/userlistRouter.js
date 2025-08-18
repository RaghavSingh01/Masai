const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.json([
  { "id": 1, "name": "John Doe", "email": "john@example.com" },
  { "id": 2, "name": "Jane Doe", "email": "jane@example.com" },
  { "id": 3, "name": "Bob Smith", "email": "bob@example.com" }
]

)
})

module.exports = router;