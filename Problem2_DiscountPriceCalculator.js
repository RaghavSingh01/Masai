let price = 25;


if(price > 20){
  let finalprice = price - ((10/100)*price);
  console.log(`The final price of the item is ${finalprice}`);
}
else if(price >= 20 && price > 0){
  console.log(`The final price of the item is ${price}`);
}
else{
  console.log("Invalid price, the price must be a non-negative number.")
}