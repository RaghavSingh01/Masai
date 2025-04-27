function personInfo(){
    console.log("Name:", this.name)
    console.log("Age:", this.age)
  }
  
  const person1 = {
    name: "Raghav",
    age: 21
  }
  
  personInfo.call(person1)