import type Order from './Order.js';

export type ShippingStrategy = {
  ship(order: Order): void;
};

class FedExShipping implements ShippingStrategy {
  ship(order: Order): void {
    console.log('Shipping order via FedEx');
  }
}

class BlueDartShipping implements ShippingStrategy {
  ship(order: Order): void {
    console.log('Shipping order via BlueDart');
  }
}

export { FedExShipping, BlueDartShipping };