const numbers: number[] = [1, 2, 3, 4, 5]; // Declaring an array of numbers
const fruits: string[] = ["apple", "banana", "cherry"]; // Declaring an array of strings
const mixedArray: (number | string)[] = [1, "apple", 2, "banana"]; // Declaring an array with mixed types
console.log(numbers); // Output: [1, 2, 3, 4, 5]
console.log(fruits); // Output: ["apple", "banana", "cherry"]
console.log(mixedArray); // Output: [1, "apple", 2, "banana"]

numbers.push(6); // Adding a number to the numbers array. -- pop
fruits.push("date"); // Adding a string to the fruits array
mixedArray.push(3, "date"); // Adding more mixed types to the mixedArray
console.log(numbers); // Output: [1, 2, 3, 4, 5, 6]

numbers.indexOf(3); // Finding the index of the number 3 in the numbers array
console.log(fruits.indexOf("banana")); // Finding the index of "banana" in the fruits array

for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]); // Output each number in the numbers array
}
for (let fruit of fruits) {
    console.log(fruit); // Output each fruit in the fruits array
}
for (let item of mixedArray) {
    console.log(item); // Output each item in the mixedArray
}
console.log(`The first number is ${numbers[0]}`); // Accessing the first element of the numbers array
console.log(`The second fruit is ${fruits[1]}`); // Accessing the second element of the fruits array

const doubled = numbers.map(num => num * 2); // Doubling each number in the numbers array
const uppercasedFruits = fruits.map(fruit => fruit.toUpperCase()); // Uppercasing each fruit in the fruits array
console.log(doubled); // Output: [2, 4, 6, 8, 10, 12]

// Filter   
const evenNumbers = numbers.filter(num => num % 2 === 0); // Filtering even numbers from the numbers array


// spread operator
const newNumbers = [...numbers, 7, 8]; // Creating a new array with additional numbers using the spread operator
console.log(evenNumbers); // Output: [2, 4, 6]

