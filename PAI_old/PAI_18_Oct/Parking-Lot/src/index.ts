import { ParkingLot } from "./models/ParkingLot";
import { Car, Bike, Truck, VehicleType } from "./models/Vehicle";
import { FirstAvailableStrategy, HourlyPricing } from "./patterns/strategies";
import { ConsoleObserver } from "./patterns/observers";
import { LotStatus } from "./patterns/states";

const lot = new ParkingLot("PR1234", new FirstAvailableStrategy());
lot.addObserver(new ConsoleObserver());

lot.createFloors(2, 6);
console.log("Created parking lot with 2 floors and 6 slots per floor");

const car1 = new Car("KA-01-DB-1234", "black");
const bike1 = new Bike("KA-02-CB-1234", "red");
const truck1 = new Truck("KA-03-DB-1234", "white");

console.log("--- Parking vehicles ---");
const t1 = lot.park(car1);
console.log(`Ticket: ${t1}
`);

const t2 = lot.park(bike1);
console.log(`Ticket: ${t2}
`);

console.log("--- Free count for CAR ---");
lot.getFreeCount(VehicleType.CAR).forEach((count, floor) => {
  console.log(`Floor ${floor}: ${count} free slots`);
});

console.log("--- Occupied slots for CAR ---");
lot.getOccupied(VehicleType.CAR).forEach((slots, floor) => {
  console.log(`Floor ${floor}: ${slots.join(", ")}`);
});

console.log("--- Unparking ---");
if (t1) console.log(lot.unpark(t1));

console.log("--- Testing state ---");
lot.setState(LotStatus.CLOSED);
const car2 = new Car("DL-01-AB-1234", "blue");
lot.park(car2);

lot.setState(LotStatus.OPEN);
const t3 = lot.park(car2);
console.log(`Ticket: ${t3}`);

console.log("--- Pricing demo ---");
const pricing = new HourlyPricing();
console.log(`2 hours CAR parking: ₹${pricing.calculate(2, VehicleType.CAR)}`);