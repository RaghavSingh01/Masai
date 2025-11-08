import type Order from './Order.js';

// I - Interface Segregation: Separate, focused interface for state behavior
export type State = {
  next(): void;
  cancel(): void;
  getStatus(): string;
};

// S - Single Responsibility: PlacedState handles only Placed state logic
class PlacedState implements State {
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next(): void {
    this.order.setState(new PackedState(this.order));
  }

  cancel(): void {
    console.log('Order cancelled from Placed state');
  }

  getStatus(): string {
    return 'Placed';
  }
}

// S - Single Responsibility: PackedState handles only Packed state logic
class PackedState implements State {
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next(): void {
    this.order.setState(new ShippedState(this.order));
  }

  cancel(): void {
    console.log('Cannot cancel, order already packed');
  }

  getStatus(): string {
    return 'Packed';
  }
}

// S - Single Responsibility: ShippedState handles only Shipped state logic
class ShippedState implements State {
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next(): void {
    this.order.setState(new DeliveredState(this.order));
  }

  cancel(): void {
    console.log('Cannot cancel, order already shipped');
  }

  getStatus(): string {
    return 'Shipped';
  }
}

// S - Single Responsibility: DeliveredState handles only Delivered state logic
class DeliveredState implements State {
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next(): void {
    console.log('Order already delivered');
  }

  cancel(): void {
    console.log('Cannot cancel, order already delivered');
  }

  getStatus(): string {
    return 'Delivered';
  }
}

export { PlacedState, PackedState, ShippedState, DeliveredState };