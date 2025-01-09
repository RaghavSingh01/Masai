let arr = [[1,2],
           [3,4],
           [5,6]];

let sum = "";
for(let i = 0 ; i < arr.length; i++){
    sum = "";
    for(let j = 0; j < arr[i].length; j++){
        sum = sum + " " +(i+j);
        console.log(sum)
    }
}
