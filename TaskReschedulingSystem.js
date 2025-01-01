let tasks = [ " Generate Idea ", " Study Idea ", " Gather Resources " , " Create Prototype ", " Publish Product "];
console.log("Original Array: "+ tasks);

tasks[4] = " Market the Product ";
tasks[0] = "";
tasks.unshift(" Find Good Opportunity ");
tasks[1] = " Generate solution idea ";

console.log("Updated Array: "+ tasks);
