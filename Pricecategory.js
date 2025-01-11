let price = +(prompt("Enter the price."));

let category = price >= 1000 ? "Expensive" :
    price >= 500 && price <= 999 ? "Moderate" :
        price < 500 && price > 0 ? "Affordable" :
            price == 0 ? "Free" : "Invalid Price";

console.log(category)