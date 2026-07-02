var Rectanlge = /** @class */ (function () {
    function Rectanlge(width, height) {
        this.width = width;
        this.height = height;
    }
    Rectanlge.prototype.area = function () {
        return this.width * this.height;
    };
    Rectanlge.prototype.perimeter = function () {
        return 2 * (this.width + this.height);
    };
    return Rectanlge;
}());

var rectangle = new Rectanlge(5, 10);

console.log("Area: ".concat(rectangle.area())); // Output: Area: 50
console.log("Perimeter: ".concat(rectangle.perimeter())); // Output: Perimeter: 30
