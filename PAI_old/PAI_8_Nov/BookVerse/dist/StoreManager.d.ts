import type Order from './Order.js';
declare class StoreManager {
    private static instance;
    private orders;
    private constructor();
    static getInstance(): StoreManager;
    addOrder(order: Order): void;
    getActiveOrders(): Order[];
    getDeliveredOrders(): Order[];
    getAllOrders(): Order[];
}
export default StoreManager;
//# sourceMappingURL=StoreManager.d.ts.map