interface ATMState {
  name: string;
  insertCard(atm: ATM): void;
  enterPin(atm: ATM, pin: string): void;
  requestCash(atm: ATM, amount: number): void;
  dispenseComplete(atm: ATM): void;
  cancel(atm: ATM): void;
}

class ATM {
  private _state: ATMState;
  balance: number;

  constructor(initialBalance: number = 10000) {
    this.balance = initialBalance;
    this._state = new IdleState();
  }

  get state(): ATMState {
    return this._state;
  }

  set state(s: ATMState) {
    this._state = s;
  }

  insertCard() {
    this._state.insertCard(this);
  }

  enterPin(pin: string) {
    this._state.enterPin(this, pin);
  }

  requestCash(amount: number) {
    this._state.requestCash(this, amount);
  }

  dispenseComplete() {
    this._state.dispenseComplete(this);
  }

  cancel() {
    this._state.cancel(this);
  }
}

class IdleState implements ATMState {
  name = "Idle";
  insertCard(atm: ATM): void {
    atm.state = new CardInsertedState();
  }
  enterPin(): void {
    throw new Error("Insert card first.");
  }
  requestCash(): void {
    throw new Error("Insert card and enter PIN first.");
  }
  dispenseComplete(): void {}
  cancel(): void {}
}

class CardInsertedState implements ATMState {
  name = "CardInserted";
  insertCard(): void {
    throw new Error("Card already inserted.");
  }
  enterPin(atm: ATM, pin: string): void {
    const ok = /^d{4,6}$/.test(pin);
    if (!ok) throw new Error("Invalid PIN format.");
    atm.state = new AuthenticatedState();
  }
  requestCash(): void {
    throw new Error("Enter PIN before requesting cash.");
  }
  dispenseComplete(): void {}
  cancel(atm: ATM): void {
    atm.state = new IdleState();
  }
}

class AuthenticatedState implements ATMState {
  name = "Authenticated";
  insertCard(): void {
    throw new Error("Card already inserted.");
  }
  enterPin(): void {
    throw new Error("PIN already verified.");
  }
  requestCash(atm: ATM, amount: number): void {
    if (amount <= 0) throw new Error("Enter a valid amount.");
    if (amount > atm.balance) throw new Error("Insufficient funds in ATM.");
    atm.balance -= amount;
    atm.state = new DispensingCashState(amount);
  }
  dispenseComplete(): void {}
  cancel(atm: ATM): void {
    atm.state = new IdleState();
  }
}

class DispensingCashState implements ATMState {
  name = "DispensingCash";
  private amount: number;
  constructor(amount: number) {
    this.amount = amount;
  }
  insertCard(): void {
    throw new Error("Currently dispensing cash.");
  }
  enterPin(): void {
    throw new Error("Currently dispensing cash.");
  }
  requestCash(): void {
    throw new Error("Currently dispensing cash.");
  }
  dispenseComplete(atm: ATM): void {
    atm.state = new IdleState();
  }
  cancel(): void {}
}

/*
Fixes:
1) Enforced flow Idle -> CardInserted -> Authenticated (can no longer jump Idle -> Authenticated), aligning with proper State Pattern sequencing. [web:2][web:4]
2) After dispensing, machine transitions DispensingCash -> Idle via dispenseComplete, ensuring it always returns to the starting state. [web:2][web:4][web:3]
*/