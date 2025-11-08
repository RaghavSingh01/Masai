import type { Book } from './Book.js';
import { type State } from './State.js';
import type { ShippingStrategy } from './ShippingStrategy.js';
import type { Observer } from './Observer.js';
declare class Order {
    private books;
    private state;
    private observers;
    private shippingStrategy;
    constructor(books: Book[]);
    setState(state: State): void;
    next(): void;
    cancel(): void;
    getStatus(): string;
    setShippingStrategy(strategy: ShippingStrategy): void;
    ship(): void;
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(): void;
    getBooks(): Book[];
}
export default Order;
//# sourceMappingURL=Order.d.ts.map