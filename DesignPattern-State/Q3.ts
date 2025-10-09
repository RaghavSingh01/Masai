interface PlayerState {
  name: string;
  play(player: MediaPlayer): void;
  pause(player: MediaPlayer): void;
  stop(player: MediaPlayer): void;
}

class MediaPlayer {
  private _state: PlayerState;
  currentTime: number;

  constructor() {
    this._state = new StopState();
    this.currentTime = 0;
  }

  get state(): PlayerState {
    return this._state;
  }

  set state(s: PlayerState) {
    this._state = s;
  }

  play() {
    this._state.play(this);
  }

  pause() {
    this._state.pause(this);
  }

  stop() {
    this._state.stop(this);
  }
}

class PlayState implements PlayerState {
  name = "Play";
  play(): void {
  }
  pause(player: MediaPlayer): void {
    player.state = new PauseState();
  }
  stop(player: MediaPlayer): void {
    player.currentTime = 0;
    player.state = new StopState();
  }
}

class PauseState implements PlayerState {
  name = "Pause";
  play(player: MediaPlayer): void {
    player.state = new PlayState();
  }
  pause(): void {
  }
  stop(player: MediaPlayer): void {
    player.currentTime = 0;
    player.state = new StopState();
  }
}

class StopState implements PlayerState {
  name = "Stop";
  play(player: MediaPlayer): void {
    player.currentTime = 0;
    player.state = new PlayState();
  }
  pause(): void {
  }
  stop(): void {
  }
}

