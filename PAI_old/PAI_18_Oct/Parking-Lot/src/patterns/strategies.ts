import { Floor } from "../models/Floor";
import { Slot } from "../models/Slot";
import { VehicleType } from "../models/Vehicle";

export interface ParkingStrategy {
  findSlot(floors: Floor[], type: VehicleType): Slot | null;
}

export class FirstAvailableStrategy implements ParkingStrategy {
  findSlot(floors: Floor[], type: VehicleType): Slot | null {
    for (let floor of floors) {
      const free = floor.getFreeSlots(type);
      if (free.length > 0) return free[0];
    }
    return null;
  }
}

export class RandomStrategy implements ParkingStrategy {
  findSlot(floors: Floor[], type: VehicleType): Slot | null {
    const allFree: Slot[] = [];
    floors.forEach(f => allFree.push(...f.getFreeSlots(type)));
    
    if (allFree.length === 0) return null;
    return allFree[Math.floor(Math.random() * allFree.length)];
  }
}

export class HourlyPricing {
  calculate(hours: number, type: VehicleType): number {
    const rates = { CAR: 20, BIKE: 10, TRUCK: 50 };
    return hours * rates[type];
  }
}

export class DailyPricing {
  calculate(hours: number, type: VehicleType): number {
    const rates = { CAR: 150, BIKE: 80, TRUCK: 400 };
    return Math.ceil(hours / 24) * rates[type];
  }
}