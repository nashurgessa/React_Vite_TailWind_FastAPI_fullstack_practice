interface Area {
    area(): number;
}

interface Perimeter {
    perimeter(): number;
}

class Rectanlge implements Area, Perimeter {

    private width: number;
    private height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    area(): number {
        return this.width * this.height;
    }

    perimeter(): number {
        return 2 * (this.width + this.height);
    }
}


const rectangle = new Rectanlge(5, 10);

console.log(`Area: ${rectangle.area()}`); // Output: Area: 50
console.log(`Perimeter: ${rectangle.perimeter()}`); // Output: Perimeter: 30