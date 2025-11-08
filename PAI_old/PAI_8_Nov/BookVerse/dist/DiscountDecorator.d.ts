import type { Book } from './Book.js';
declare abstract class BookDecorator implements Book {
    protected book: Book;
    constructor(book: Book);
    get title(): string;
    get author(): string;
    get price(): number;
    get category(): string;
    get isDigital(): boolean;
    abstract getPrice(): number;
    abstract getDescription(): string;
}
declare class PhysicalBook implements Book {
    title: string;
    author: string;
    price: number;
    category: string;
    isDigital: boolean;
    constructor(title: string, author: string, price: number, category: string, isDigital?: boolean);
    getPrice(): number;
    getDescription(): string;
}
declare class EBook implements Book {
    title: string;
    author: string;
    price: number;
    category: string;
    isDigital: boolean;
    constructor(title: string, author: string, price: number, category: string, isDigital?: boolean);
    getPrice(): number;
    getDescription(): string;
}
declare class FestiveDiscount extends BookDecorator {
    getPrice(): number;
    getDescription(): string;
}
declare class DigitalDiscount extends BookDecorator {
    getPrice(): number;
    getDescription(): string;
}
export { BookDecorator, PhysicalBook, EBook, FestiveDiscount, DigitalDiscount };
//# sourceMappingURL=DiscountDecorator.d.ts.map