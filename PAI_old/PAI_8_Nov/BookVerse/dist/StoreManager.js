class StoreManager {
    constructor() {
        this.orders = [];
    }
    static getInstance() {
        if (!StoreManager.instance) {
            StoreManager.instance = new StoreManager();
        }
        return StoreManager.instance;
    }
    addOrder(order) {
        this.orders.push(order);
    }
    getActiveOrders() {
        return this.orders.filter(order => order.getStatus() !== 'Delivered');
    }
    getDeliveredOrders() {
        return this.orders.filter(order => order.getStatus() === 'Delivered');
    }
    getAllOrders() {
        return this.orders;
    }
}
export default StoreManager;
//# sourceMappingURL=StoreManager.js.map