import type Order from './Order.js';
export type ShippingStrategy = {
    ship(order: Order): void;
};
declare class FedExShipping implements ShippingStrategy {
    ship(order: Order): void;
}
declare class BlueDartShipping implements ShippingStrategy {
    ship(order: Order): void;
}
export { FedExShipping, BlueDartShipping };
//# sourceMappingURL=ShippingStrategy.d.ts.map