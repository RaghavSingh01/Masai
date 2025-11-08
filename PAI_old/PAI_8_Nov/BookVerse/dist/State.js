// S - Single Responsibility: PlacedState handles only Placed state logic
class PlacedState {
    constructor(order) {
        this.order = order;
    }
    next() {
        this.order.setState(new PackedState(this.order));
    }
    cancel() {
        console.log('Order cancelled from Placed state');
    }
    getStatus() {
        return 'Placed';
    }
}
// S - Single Responsibility: PackedState handles only Packed state logic
class PackedState {
    constructor(order) {
        this.order = order;
    }
    next() {
        this.order.setState(new ShippedState(this.order));
    }
    cancel() {
        console.log('Cannot cancel, order already packed');
    }
    getStatus() {
        return 'Packed';
    }
}
// S - Single Responsibility: ShippedState handles only Shipped state logic
class ShippedState {
    constructor(order) {
        this.order = order;
    }
    next() {
        this.order.setState(new DeliveredState(this.order));
    }
    cancel() {
        console.log('Cannot cancel, order already shipped');
    }
    getStatus() {
        return 'Shipped';
    }
}
// S - Single Responsibility: DeliveredState handles only Delivered state logic
class DeliveredState {
    constructor(order) {
        this.order = order;
    }
    next() {
        console.log('Order already delivered');
    }
    cancel() {
        console.log('Cannot cancel, order already delivered');
    }
    getStatus() {
        return 'Delivered';
    }
}
export { PlacedState, PackedState, ShippedState, DeliveredState };
//# sourceMappingURL=State.js.map