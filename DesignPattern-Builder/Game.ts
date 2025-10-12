interface Cloneable<T> { clone(): T; }

class GameCharacter implements Cloneable<GameCharacter> {
  constructor(public name: string, public level: number, public weapon: string) {}
  clone(): GameCharacter { return new GameCharacter(this.name, this.level, this.weapon); }
  toString(): string { return `GameCharacter(name=${this.name}, level=${this.level}, weapon=${this.weapon})`; }
}

(function main() {
  const warrior = new GameCharacter("Warrior", 10, "sword");
  const warriorClone = warrior.clone();
  warriorClone.name = "Warrior Clone";
  console.log(warrior.toString());
  console.log(warriorClone.toString());
})();