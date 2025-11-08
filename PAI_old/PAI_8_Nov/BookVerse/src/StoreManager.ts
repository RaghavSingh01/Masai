import type Order from './Order.js';

class StoreManager {
  private static instance: StoreManager;
  private orders: Order[] = [];

  private constructor() {}

  static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }
    return StoreManager.instance;
  }

  addOrder(order: Order): void {
    this.orders.push(order);
  }

  getActiveOrders(): Order[] {
    return this.orders.filter(order => order.getStatus() !== 'Delivered');
  }

  getDeliveredOrders(): Order[] {
    return this.orders.filter(order => order.getStatus() === 'Delivered');
  }

  getAllOrders(): Order[] {
    return this.orders;
  }
}

export default StoreManager;