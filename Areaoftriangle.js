let base = 10;
let height = 5;
let area = (base * height)/2;

if(base < 0 || height < 0){
  console.log("Invalid number, base and height must be positive numbers.")
}
else if(base == 0 || height == 0){
  console.log("The area of the triangle is: 0.0");
}
else{
  console.log(`The area of the triangle is ${area}`);
}