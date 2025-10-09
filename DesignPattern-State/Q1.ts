interface State {
  insertCoin(machine: VendingMachine): void;
  selectItem(machine: VendingMachine): void;
  dispense(machine: VendingMachine): void;
}

class IdleState implements State {
  insertCoin(machine: VendingMachine): void {
    console.log("Coin inserted. Moving to Processing state.");
    machine.setState(new ProcessingState());
  }
  selectItem(): void {
    console.log("You need to insert a coin first.");
  }
  dispense(): void {
    console.log("No item to dispense.");
  }
}

class ProcessingState implements State {
  insertCoin(): void {
    console.log("Coin already inserted. Please select an item.");
  }
  selectItem(machine: VendingMachine): void {
    console.log("Item selected. Moving to Dispensing state.");
    machine.setState(new DispensingState());
  }
  dispense(): void {
    console.log("Select an item first.");
  }
}

class DispensingState implements State {
  insertCoin(): void {
    console.log("Currently dispensing. Please wait.");
  }
  selectItem(): void {
    console.log("Already dispensing an item.");
  }
  dispense(machine: VendingMachine): void {
    console.log("Dispensing item... Returning to Idle state.");
    machine.setState(new IdleState());
  }
}

class VendingMachine {
  private currentState: State;
  constructor() {
    this.currentState = new IdleState();
    console.log("Machine is in Idle state.");
  }
  setState(state: State): void {
    this.currentState = state;
  }
  insertCoin(): void {
    this.currentState.insertCoin(this);
  }
  selectItem(): void {
    this.currentState.selectItem(this);
  }
  dispense(): void {
    this.currentState.dispense(this);
  }
}

const machine = new VendingMachine();
machine.insertCoin();
machine.selectItem();
machine.dispense();