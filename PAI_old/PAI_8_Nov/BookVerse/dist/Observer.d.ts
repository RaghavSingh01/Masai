import type Order from './Order.js';
export type Observer = {
    update(order: Order): void;
};
declare class CustomerNotifier implements Observer {
    update(order: Order): void;
}
declare class DeliveryNotifier implements Observer {
    update(order: Order): void;
}
export { CustomerNotifier, DeliveryNotifier };
//# sourceMappingURL=Observer.d.ts.map