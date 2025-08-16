// const express = require(express);
const isPrime = require('./isPrime');

// const app = express();

const nums = [2,10,17,21,29]

nums.forEach(num => {
    if(isPrime(num)){
        console.log('Is Prime');
    }
    else{
        console.log('Not Prime')
    }

})