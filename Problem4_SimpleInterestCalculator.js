let P = 1000;
let R = -1;
let T = 3;
let SI = (P*R*T)/100;

if(P > 0 && R > 0 && T > 0){
console.log(`The simple interest is: ${SI}`);
}
else if(P == 0 || R == 0 || T == 0){
  console.log(`The simple interest is: 0.0`);
}
else{
  console.log("Invalid input, all values must be non-negative.")
}