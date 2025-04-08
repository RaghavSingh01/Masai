let height  = +(prompt("Enter your height: "));
let weight = +(prompt("Enter your weight: "));
let BMI = weight/(height * height);

if(height > 0 && weight > 0){
console.log(BMI.toFixed(2))
}
else if(height == 0){
  console.log("Invalid input, height cannot be zero.");
}
else{
  console.log("Invalid input, height and weight must be positive numbers.");
}