import { PlacedState } from './State.js';
class Order {
    constructor(books) {
        this.books = books;
        this.observers = [];
        this.shippingStrategy = null;
        this.state = new PlacedState(this);
    }
    setState(state) {
        this.state = state;
        this.notifyObservers();
    }
    next() {
        this.state.next();
    }
    cancel() {
        this.state.cancel();
    }
    getStatus() {
        return this.state.getStatus();
    }
    setShippingStrategy(strategy) {
        this.shippingStrategy = strategy;
    }
    ship() {
        if (this.shippingStrategy) {
            this.shippingStrategy.ship(this);
        }
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers() {
        this.observers.forEach(observer => observer.update(this));
    }
    getBooks() {
        return this.books;
    }
}
export default Order;
//# sourceMappingURL=Order.js.map