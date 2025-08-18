const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.json({
        name: 'Raghav',
        email: 'raghav.singh132@gmail.com',
        phone: '8672832654'
    });
});

module.exports = router;