import type Order from './Order.js';

export type Observer = {
  update(order: Order): void;
};

class CustomerNotifier implements Observer {
  update(order: Order): void {
    console.log(`Customer notified: Order status is ${order.getStatus()}`);
  }
}

class DeliveryNotifier implements Observer {
  update(order: Order): void {
    console.log(`Delivery team notified: Order status is ${order.getStatus()}`);
  }
}

export { CustomerNotifier, DeliveryNotifier };