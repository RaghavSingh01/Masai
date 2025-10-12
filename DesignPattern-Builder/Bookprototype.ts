interface Cloneable<T> { clone(): T; }

class Book implements Cloneable<Book> {
  constructor(public title: string, public author: string, public reviews: string[]) {}
  clone(): Book {
    const reviewsCopy = typeof structuredClone === "function"
      ? structuredClone(this.reviews)
      : this.reviews.slice();
    return new Book(this.title, this.author, reviewsCopy);
  }
  toString(): string {
    return `Book(title=${this.title}, author=${this.author}, reviews=[${this.reviews.join("; ")}])`;
  }
}

(function main() {
  const original = new Book("Clean Code", "Robert C. Martin", ["Great read", "Must-have"]);
  const copy = original.clone();
  copy.reviews.push("Only in clone");
  copy.title = "Clean Code (Clone)";
  console.log(original.toString());
  console.log(copy.toString());
})();