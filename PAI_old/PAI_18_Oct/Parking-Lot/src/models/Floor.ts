import { Slot } from "./Slot";
import { VehicleType } from "./Vehicle";

export class Floor {
  slots: Slot[] = [];

  constructor(public id: number) {}

  addSlots(count: number) {
    for (let i = 0; i < count; i++) {
      let type = VehicleType.CAR;
      if (i === 0) type = VehicleType.TRUCK;
      else if (i <= 2) type = VehicleType.BIKE;
      
      this.slots.push(new Slot(i + 1, type, this.id));
    }
  }

  getFreeSlots(type: VehicleType) {
    return this.slots.filter(s => !s.isOccupied && s.type === type);
  }

  getOccupiedSlots(type: VehicleType) {
    return this.slots.filter(s => s.isOccupied && s.type === type);
  }
}