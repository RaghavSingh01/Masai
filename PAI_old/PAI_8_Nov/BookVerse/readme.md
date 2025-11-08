# BookVerse

Online bookstore system demonstrating design patterns and SOLID principles in TypeScript.

## Design Patterns

1. *Decorator* - Dynamic discounts on books
2. *State* - Order lifecycle (Placed â†’ Packed â†’ Shipped â†’ Delivered)
3. *Strategy* - Shipping providers (FedEx, BlueDart)
4. *Observer* - Notifications (Customer, Delivery team)
5. *Singleton* - Centralized store manager

## SOLID Principles

- *S*: Single Responsibility - Each class has one purpose
- *O*: Open/Closed - Open for extension, closed for modification
- *L*: Liskov Substitution - Subtypes are interchangeable
- *I*: Interface Segregation - Small, focused interfaces
- *D*: Dependency Inversion - Depend on abstractions, not concrete implementations

## Setup & Run

```
npm install
npm run build
npm start
```