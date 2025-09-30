// Q4: Polymorphism — Duck Family
class PolyDuck {
  fly(): void {
    console.log("Duck flies");
  }
}

class DesiDuck extends PolyDuck {
  override fly(): void {
    console.log("DesiDuck flies at 10kmph");
  }
}

class VidesiDuck extends PolyDuck {
  override fly(): void {
    console.log("VidesiDuck flies at 20kmph");
  }
}

class SmartDuck extends PolyDuck {
  override fly(): void {
    console.log("SmartDuck flies at 50kmph");
  }
}

function makeDuckFly(duck: PolyDuck): void {
  duck.fly();
}

makeDuckFly(new DesiDuck());    
makeDuckFly(new VidesiDuck());  
makeDuckFly(new SmartDuck());   


// Q5: Access Modifiers Exploration
class User {
  public name: string;
  private orgCode: string = "DuckCorp";
  protected role: string;

  constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
  }

  introduce(): void {
    console.log(`I am ${this.name} from ${this.orgCode}`);
  }
}

class Manager extends User {
  getRole(): void {
    console.log(this.role);
  }
}


const u = new User("Daffy", "Employee");
u.introduce(); 

const m = new Manager("Daffy", "Manager");
m.getRole(); 