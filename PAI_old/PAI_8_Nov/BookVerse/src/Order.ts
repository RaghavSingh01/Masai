import type { Book } from './Book.js';
import { PlacedState, type State } from './State.js';
import type { ShippingStrategy } from './ShippingStrategy.js';
import type { Observer } from './Observer.js';

class Order {
  private state: State;
  private observers: Observer[] = [];
  private shippingStrategy: ShippingStrategy | null = null;

  constructor(private books: Book[]) {
    this.state = new PlacedState(this);
  }

  setState(state: State): void {
    this.state = state;
    this.notifyObservers();
  }

  next(): void {
    this.state.next();
  }

  cancel(): void {
    this.state.cancel();
  }

  getStatus(): string {
    return this.state.getStatus();
  }

  setShippingStrategy(strategy: ShippingStrategy): void {
    this.shippingStrategy = strategy;
  }

  ship(): void {
    if (this.shippingStrategy) {
      this.shippingStrategy.ship(this);
    }
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(): void {
    this.observers.forEach(observer => observer.update(this));
  }

  getBooks(): Book[] {
    return this.books;
  }
}

export default Order;