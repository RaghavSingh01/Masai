export enum LotStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  FULL = "FULL"
}

export interface State {
  canPark(): boolean;
  getMessage(): string;
}

export class OpenState implements State {
  canPark() { return true; }
  getMessage() { return "Parking lot is open"; }
}

export class ClosedState implements State {
  canPark() { return false; }
  getMessage() { return "Parking lot is closed"; }
}

export class FullState implements State {
  canPark() { return false; }
  getMessage() { return "Parking lot is full"; }
}