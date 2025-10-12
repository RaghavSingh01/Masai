
type EngineType = "electric" | "petrol" | "diesel" | "hybrid";

class Car {
  readonly brand: string;
  readonly engine: EngineType;
  readonly color: string;
  readonly sunroof: boolean;
  readonly automaticTransmission: boolean;

  constructor(b: CarBuilder) {
    this.brand = b["_brand"];
    this.engine = b["_engine"];
    this.color = b["_color"];
    this.sunroof = b["_sunroof"];
    this.automaticTransmission = b["_automaticTransmission"];
  }

  toString(): string {
    return `Car(brand=${this.brand}, engine=${this.engine}, color=${this.color}, sunroof=${this.sunroof}, automatic=${this.automaticTransmission})`;
  }
}

class CarBuilder {
  _brand: string = "Generic";
  _engine: EngineType = "petrol";
  _color: string = "white";
  _sunroof: boolean = false;
  _automaticTransmission: boolean = false;

  brand(v: string): this { this._brand = v; return this; }
  engine(v: EngineType): this { this._engine = v; return this; }
  color(v: string): this { this._color = v; return this; }
  sunroof(v: boolean = true): this { this._sunroof = v; return this; }
  automatic(v: boolean = true): this { this._automaticTransmission = v; return this; }
  build(): Car { return new Car(this); }
}

(function main() {
  const car = new CarBuilder()
    .brand("Tesla Model S")
    .engine("electric")
    .color("black")
    .sunroof(true)
    .automatic(true)
    .build();

  console.log(car.toString());
})();