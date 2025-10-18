
export enum VehicleType {
  CAR = "CAR",
  BIKE = "BIKE", 
  TRUCK = "TRUCK"
}

export class Vehicle {
  constructor(
    public type: VehicleType,
    public regNo: string,
    public color: string
  ) {}

  getDetails() {
    return `${this.type} ${this.regNo} ${this.color}`;
  }
}

export class Car extends Vehicle {
  constructor(regNo: string, color: string) {
    super(VehicleType.CAR, regNo, color);
  }
}

export class Bike extends Vehicle {
  constructor(regNo: string, color: string) {
    super(VehicleType.BIKE, regNo, color);
  }
}

export class Truck extends Vehicle {
  constructor(regNo: string, color: string) {
    super(VehicleType.TRUCK, regNo, color);
  }
}