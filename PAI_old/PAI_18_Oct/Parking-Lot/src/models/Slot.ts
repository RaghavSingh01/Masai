import { VehicleType } from "./Vehicle";

export class Slot {
  isOccupied = false;

  constructor(
    public id: number,
    public type: VehicleType,
    public floorId: number
  ) {}

  occupy() {
    this.isOccupied = true;
  }

  free() {
    this.isOccupied = false;
  }
}