if (true) {
    let a = 1;
    const b = 2;
    var c = 3;
}

console.log(c); // ReferenceError: a is not defined

const name = "Admin";

/*
    Arrow function

    Arrow functions are a concise way to write function expressions in JavaScript.
    They do not have their own `this` context, which makes them useful for certain situations.
    Arrow functions are defined using the `=>` syntax.
    They can be used to create anonymous functions or to simplify function expressions.
*/
const greet = (name) => {
    console.log(`Hello, ${name}!`);
}

greet(name); // Output: Hello, Admin!

const add = (a, b) => a + b;
console.log(add(5, 3)); // Output: 8


// Template Literals
const title = `Welcome ${name}`;
console.log(title); // Output: Welcome Admin
// Using arrow functions with default parameters
const greetUser = (user = "Guest") => {
    console.log(`Hello, ${user}!`);
}
greetUser(); // Output: Hello, Guest!


// Destructuring Assignment
const userMap = {
    firstName: "Abdi",
    lastName: "Ali",
    age: 20
};
const { firstName, lastName, age } = user;
console.log(`User: ${firstName} ${lastName}, Age: ${age}`); // Output: User: John Doe, Age: 30


// Spread Operator
const numbersArray = [1, 2, 3, 4, 5];
const newNumbersArray = [...numbersArray, 6, 7, 8];
console.log(newNumbersArray); // Output: [1, 2, 3, 4, 5, 6, 7, 8]
// Using arrow functions with default parameters
const greetWithDefault = (name = "Guest") => {
    console.log(`Hello, ${name}!`);
}
greetWithDefault(); // Output: Hello, Guest!
// Using arrow functions with default parameters and destructuring
const userDetails = ({ name = "Guest", age = 18 } = {}) => {
    console.log(`Name: ${name}, Age: ${age}`);
}
userDetails({ name: "Alice", age: 25 }); // Output: Name: Alice, Age: 25
userDetails(); // Output: Name: Guest, Age: 18

// Using arrow functions with rest parameters
const addNumbers = (...numbers) => {
    return numbers.reduce((sum, num) => sum + num, 0);
}
console.log(addNumbers(1, 2, 3, 4, 5)); // Output: 15


const addMultiple = (...args) => {
    return args.reduce((sum, current) => sum + current, 0);
}
console.log(addMultiple(1, 2, 3, 4, 5)); // Output: 15
// Using arrow functions with array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // Output: [2, 4, 6, 8, 10]
// Using arrow functions with `this` context
const person = {
    name: "John",
    greet: function() {
        setTimeout(() => {
            console.log(`Hello, ${this.name}!`);
        }, 1000);
    }
};
person.greet(); // Output: Hello, John! (after 1 second)
// Using arrow functions with `this` context in a class
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        setTimeout(() => {
            console.log(`Hello, ${this.name}!`);
        }, 1000);
    }
}
const user = new User("Alice");
user.greet(); // Output: Hello, Alice! (after 1 second)
// Using arrow functions with array methods and `this` context
const team = {
    name: "Developers",
    members: ["Alice", "Bob", "Charlie"],
    greetMembers: function() {
        this.members.forEach(member => {
            console.log(`Hello, ${member} from ${this.name}!`);
        });
    }
};
team.greetMembers();
// Output:
// Hello, Alice from Developers!
// Hello, Bob from Developers!
// Hello, Charlie from Developers!
// Using arrow functions with array methods and `this` context in a class   