class CustomerNotifier {
    update(order) {
        console.log(`Customer notified: Order status is ${order.getStatus()}`);
    }
}
class DeliveryNotifier {
    update(order) {
        console.log(`Delivery team notified: Order status is ${order.getStatus()}`);
    }
}
export { CustomerNotifier, DeliveryNotifier };
//# sourceMappingURL=Observer.js.map