let tasks = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"];
console.log("Original Array: " + " " + tasks);

let tasks2 = [];

for(let i = 1; i < tasks.length; i++){
  tasks2[i - 1] = tasks[i];

}
console.log(tasks2);
let tasks3 = [];

for(let i= 0; i < (tasks2.length + 2); i++){
   
    for(let j = 0; j < tasks2.length; j++){
  if(i == 0){
    tasks3[i] = "Priority task 1";
    
  }
  else if( i == 1){
    tasks3[i] = "Priority task 2";
    
  }
  else{
    tasks3[i] = tasks2[j];
  }
}
}
console.log(tasks3);
