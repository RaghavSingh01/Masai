let book = {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937
};

for(let keys in book){
    console.log(`${keys} : ${book[keys]}`);
}