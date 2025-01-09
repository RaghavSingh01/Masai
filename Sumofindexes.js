let arr = [
    [1,2],
    [3,4],
    [5,6]];

let bag = "";
    
for(let i = 0; i < arr.length; i++){
for(let j = 0; j < arr[i].length; j++){
if(j == arr[i].length - 1){
bag = bag + (i + j) +  "\n" ;
}
else{
bag = bag + (i + j) + " ";
}
}
}

console.log(bag);