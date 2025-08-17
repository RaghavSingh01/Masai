const boxen = require('boxen');

const msg = 'I am using my first external module!';
const title = 'Hurray!!!';

console.log(boxen(msg, {title: title}));

console.log(boxen(msg, {title: title, borderStyle: 'singleDouble'}));

console.log(boxen(msg, {title: title, borderStyle: 'round'}));

