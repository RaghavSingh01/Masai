
type Size = "small" | "medium" | "large";

class Pizza {
  readonly size: Size;
  readonly cheese: boolean;
  readonly pepperoni: boolean;
  readonly mushrooms: boolean;

  constructor(builder: PizzaBuilder) {
    this.size = builder["_size"];
    this.cheese = builder["_cheese"];
    this.pepperoni = builder["_pepperoni"];
    this.mushrooms = builder["_mushrooms"];
  }

  toString(): string {
    return `Pizza(size=${this.size}, cheese=${this.cheese}, pepperoni=${this.pepperoni}, mushrooms=${this.mushrooms})`;
  }
}

class PizzaBuilder {
  _size: Size = "medium";
  _cheese = false;
  _pepperoni = false;
  _mushrooms = false;

  size(size: Size): this {
    this._size = size;
    return this;
  }

  cheese(on: boolean = true): this {
    this._cheese = on;
    return this;
  }

  pepperoni(on: boolean = true): this {
    this._pepperoni = on;
    return this;
  }

  mushrooms(on: boolean = true): this {
    this._mushrooms = on;
    return this;
  }

  build(): Pizza {
    return new Pizza(this);
  }
}

(function main() {
  const pizza = new PizzaBuilder()
    .size("large")
    .cheese(true)
    .mushrooms(true)
    .build();

  console.log(pizza.toString());
})();