
import { Floor } from "./Floor";
import { Vehicle, VehicleType } from "./Vehicle";
import { Slot } from "./Slot";
import { ParkingStrategy } from "../patterns/strategies";
import { Observer } from "../patterns/observers";
import { State, OpenState, ClosedState, FullState, LotStatus } from "../patterns/states";

export class ParkingLot {
  floors: Floor[] = [];
  private tickets = new Map<string, { vehicle: Vehicle; slot: Slot }>();
  private observers: Observer[] = [];
  private state: State = new OpenState();
  private status = LotStatus.OPEN;

  constructor(
    public id: string,
    private strategy: ParkingStrategy
  ) {}

  addObserver(obs: Observer) {
    this.observers.push(obs);
  }

  private notifyObservers(msg: string, vehicle?: Vehicle) {
    this.observers.forEach(o => o.notify(msg, vehicle));
  }

  setState(status: LotStatus) {
    this.status = status;
    if (status === LotStatus.OPEN) this.state = new OpenState();
    else if (status === LotStatus.CLOSED) this.state = new ClosedState();
    else this.state = new FullState();
    
    console.log(this.state.getMessage());
  }

  createFloors(count: number, slotsPerFloor: number) {
    for (let i = 1; i <= count; i++) {
      const floor = new Floor(i);
      floor.addSlots(slotsPerFloor);
      this.floors.push(floor);
    }
  }

  park(vehicle: Vehicle): string | null {
    if (!this.state.canPark()) {
      this.notifyObservers("Cannot park - " + this.state.getMessage(), vehicle);
      return null;
    }

    const slot = this.strategy.findSlot(this.floors, vehicle.type);
    if (!slot) {
      this.notifyObservers("Parking full", vehicle);
      this.setState(LotStatus.FULL);
      return null;
    }

    slot.occupy();
    const ticketId = `${this.id}_${slot.floorId}_${slot.id}`;
    this.tickets.set(ticketId, { vehicle, slot });
    this.notifyObservers("Vehicle parked", vehicle);
    return ticketId;
  }

  unpark(ticketId: string): string | null {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return null;

    ticket.slot.free();
    this.tickets.delete(ticketId);
    
    if (this.status === LotStatus.FULL) {
      this.setState(LotStatus.OPEN);
    }

    return `Unparked ${ticket.vehicle.getDetails()}`;
  }

  getFreeCount(type: VehicleType): Map<number, number> {
    const counts = new Map<number, number>();
    this.floors.forEach(f => {
      counts.set(f.id, f.getFreeSlots(type).length);
    });
    return counts;
  }

  getOccupied(type: VehicleType): Map<number, number[]> {
    const result = new Map<number, number[]>();
    this.floors.forEach(f => {
      result.set(f.id, f.getOccupiedSlots(type).map(s => s.id));
    });
    return result;
  }
}