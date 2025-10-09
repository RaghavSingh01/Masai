interface State {
  change(light: TrafficLight): void;
}

class RedState implements State {
  change(light: TrafficLight): void {
    console.log("Red Light: Vehicles must stop.");
    light.setState(new GreenState());
  }
}

class GreenState implements State {
  change(light: TrafficLight): void {
    console.log("Green Light: Vehicles can move.");
    light.setState(new YellowState());
  }
}

class YellowState implements State {
  change(light: TrafficLight): void {
    console.log("Yellow Light: Vehicles should slow down.");
    light.setState(new RedState());
  }
}

class TrafficLight {
  private currentState: State;
  constructor() {
    this.currentState = new RedState();
    console.log("Traffic light starts with Red.");
  }
  setState(state: State): void {
    this.currentState = state;
  }
  change(): void {
    this.currentState.change(this);
  }
}

const light = new TrafficLight();
light.change();
light.change();
light.change();
light.change();