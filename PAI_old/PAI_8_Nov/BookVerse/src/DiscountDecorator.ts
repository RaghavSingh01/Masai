import type { Book } from './Book.js';

abstract class BookDecorator implements Book {
  protected book: Book;

  constructor(book: Book) {
    this.book = book;
  }

  get title(): string {
    return this.book.title;
  }

  get author(): string {
    return this.book.author;
  }

  get price(): number {
    return this.book.price;
  }

  get category(): string {
    return this.book.category;
  }

  get isDigital(): boolean {
    return this.book.isDigital;
  }

  abstract getPrice(): number;
  abstract getDescription(): string;
}

class PhysicalBook implements Book {
  constructor(
    public title: string,
    public author: string,
    public price: number,
    public category: string,
    public isDigital: boolean = false
  ) {}

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `${this.title} by ${this.author}`;
  }
}

class EBook implements Book {
  constructor(
    public title: string,
    public author: string,
    public price: number,
    public category: string,
    public isDigital: boolean = true
  ) {}

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `${this.title} (eBook) by ${this.author}`;
  }
}

class FestiveDiscount extends BookDecorator {
  getPrice(): number {
    return this.book.price * 0.9;
  }

  getDescription(): string {
    return `${this.book.title} - Festive Discount Applied`;
  }
}

class DigitalDiscount extends BookDecorator {
  getPrice(): number {
    return this.book.price * 0.85;
  }

  getDescription(): string {
    return `${this.book.title} - Digital Discount Applied`;
  }
}

export { BookDecorator, PhysicalBook, EBook, FestiveDiscount, DigitalDiscount };