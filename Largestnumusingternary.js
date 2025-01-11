let num1 = +(prompt("Enter the first number: "));
let num2 = +(prompt("Enter the second number: "));
let num3 = +(prompt("Enter the third number: "));

let largestnum = num1 > num2  && num1 > num3? `Largest is num1 which is ${num1}`: num2 > num1 && num2 > num3 ? `Largest is num2 which is ${num2}` : `Largest is num3 which is ${num3}`;
console.log(largestnum);