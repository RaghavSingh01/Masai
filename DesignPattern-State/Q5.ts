interface State {
  handle(light: SmartLight): void;
}

class OffState implements State {
  handle(light: SmartLight): void {
    console.log("Light is OFF. Turning it ON manually.");
    light.setState(new OnState());
  }
}

class OnState implements State {
  handle(light: SmartLight): void {
    console.log("Light is ON manually. Switching to Motion Detection mode.");
    light.setState(new MotionDetectionState());
  }
}

class MotionDetectionState implements State {
  handle(light: SmartLight): void {
    console.log("Motion detected. Adjusting brightness based on environment.");
    light.setState(new BrightnessAdjustmentState());
  }
}

class BrightnessAdjustmentState implements State {
  handle(light: SmartLight): void {
    const isDaytime = Math.random() > 0.5;
    if (isDaytime) {
      console.log("Daytime detected. Reducing brightness.");
    } else {
      console.log("Nighttime detected. Increasing brightness.");
    }
    console.log("Returning to Motion Detection mode.");
    light.setState(new MotionDetectionState());
  }
}

class SmartLight {
  private currentState: State;
  constructor() {
    this.currentState = new OffState();
    console.log("Smart Light initialized in OFF state.");
  }
  setState(state: State): void {
    this.currentState = state;
  }
  nextState(): void {
    this.currentState.handle(this);
  }
}

const light = new SmartLight();
light.nextState();
light.nextState();
light.nextState();
light.nextState();
light.nextState();