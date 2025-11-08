class BookDecorator {
    constructor(book) {
        this.book = book;
    }
    get title() {
        return this.book.title;
    }
    get author() {
        return this.book.author;
    }
    get price() {
        return this.book.price;
    }
    get category() {
        return this.book.category;
    }
    get isDigital() {
        return this.book.isDigital;
    }
}
class PhysicalBook {
    constructor(title, author, price, category, isDigital = false) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.category = category;
        this.isDigital = isDigital;
    }
    getPrice() {
        return this.price;
    }
    getDescription() {
        return `${this.title} by ${this.author}`;
    }
}
class EBook {
    constructor(title, author, price, category, isDigital = true) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.category = category;
        this.isDigital = isDigital;
    }
    getPrice() {
        return this.price;
    }
    getDescription() {
        return `${this.title} (eBook) by ${this.author}`;
    }
}
class FestiveDiscount extends BookDecorator {
    getPrice() {
        return this.book.price * 0.9;
    }
    getDescription() {
        return `${this.book.title} - Festive Discount Applied`;
    }
}
class DigitalDiscount extends BookDecorator {
    getPrice() {
        return this.book.price * 0.85;
    }
    getDescription() {
        return `${this.book.title} - Digital Discount Applied`;
    }
}
export { BookDecorator, PhysicalBook, EBook, FestiveDiscount, DigitalDiscount };
//# sourceMappingURL=DiscountDecorator.js.map