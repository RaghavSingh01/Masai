import { Vehicle } from "../models/Vehicle";

export interface Observer {
  notify(message: string, vehicle?: Vehicle): void;
}

export class ConsoleObserver implements Observer {
  notify(message: string, vehicle?: Vehicle) {
    if (vehicle) {
      console.log(`[ALERT] ${message} - ${vehicle.getDetails()}`);
    } else {
      console.log(`[ALERT] ${message}`);
    }
  }
}