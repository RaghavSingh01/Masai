let arr = [[1,2,3],
           [4,5,6],
           [7,8,9]];


let n = arr.length;
let m = arr[0].length;
let result = " "
for(let i = n - 1; i >= 0; i--){
    result += arr[i][0] + " ";
}          
console.log(result); 

for(let j = 1; j < arr[0].length; j++){
    result += arr[0][j] + " ";
}
console.log(result);
for(let i = 1; i < n; i++ ){
    result += arr[i][n-1] + " ";
}
console.log(result);

for(let j = m - 1; j > n ; j--){
    result += arr[n-1][j] + " ";
}

console.log(result);