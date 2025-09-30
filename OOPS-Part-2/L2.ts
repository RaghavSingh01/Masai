// Q6: Dynamic Duck Behavior Simulator (Strategy Pattern)

interface FlyStrategy {
  fly(): void;
}

class FastFly implements FlyStrategy {
  fly(): void {
    console.log("Flying fast like a rocket!");
  }
}

class NoFly implements FlyStrategy {
  fly(): void {
    console.log("I cannot fly");
  }
}


class Ducks {
  private strategy: FlyStrategy;

  constructor(strategy: FlyStrategy) {
    this.strategy = strategy;
  }

  performFly(): void {
    this.strategy.fly();
  }

  setFlyStrategy(strategy: FlyStrategy): void {
    this.strategy = strategy;
  }
}

const duck = new Ducks(new FastFly());
duck.performFly();              
duck.setFlyStrategy(new NoFly());
duck.performFly();              