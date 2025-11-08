import type Order from './Order.js';
export type State = {
    next(): void;
    cancel(): void;
    getStatus(): string;
};
declare class PlacedState implements State {
    private order;
    constructor(order: Order);
    next(): void;
    cancel(): void;
    getStatus(): string;
}
declare class PackedState implements State {
    private order;
    constructor(order: Order);
    next(): void;
    cancel(): void;
    getStatus(): string;
}
declare class ShippedState implements State {
    private order;
    constructor(order: Order);
    next(): void;
    cancel(): void;
    getStatus(): string;
}
declare class DeliveredState implements State {
    private order;
    constructor(order: Order);
    next(): void;
    cancel(): void;
    getStatus(): string;
}
export { PlacedState, PackedState, ShippedState, DeliveredState };
//# sourceMappingURL=State.d.ts.map