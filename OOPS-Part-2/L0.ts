//Q1. Basic Inheritance

class Duck{
    swim(): void{
        console.log("I know swimming");
    }
}

class MallardDuck extends Duck{}

const d = new MallardDuck();
d.swim();


//Q2. Method Overriding Basics

class Bird{
    fly(): void{
        console.log("I can fly");
    }
}

class Penguin extends Bird{
    override fly(): void{
        console.log("I cannot fly");
    }
}

const b = new Bird();
b.fly();
const p = new Penguin();
p.fly();


//Q3. Interface Implementation

interface IDuck{
    swim(): void;
    fly(): void;
    sound(): void;
}

class ToyDuck implements IDuck{
    swim(): void {
        console.log("Can float on water");
    }

    fly(): void {
        console.log("Cannot fly");
    }

    sound(): void {
        console.log("Cannot make sound");
    }
}

const td = new ToyDuck();
td.fly();
td.sound();
td.swim();