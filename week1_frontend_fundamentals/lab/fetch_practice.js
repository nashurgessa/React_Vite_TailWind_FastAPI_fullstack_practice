// const maxTwoNumber = (a, b) => {
//     if (a > b) {
//         return a;
//     }
//     return b;
// }

// const maxThreeNumber = (a, b, c) => {
//     return maxTwoNumber(maxTwoNumber(a, b), c);
// }

// let result = maxthreeNumber(10, 20, 30);
// console.log(result); // This will log undefined because the function does not return a value

// const user = {
//     id: 1,
//     name: 'Nashu',
//     age: 25,
//     isActive: true,
//     greet: function() {
//         console.log(`Hello, my name is ${this.name}`);
//     }
// }

// user.greet();

// const {id, name, age, isActive} = user;
// console.log(id, name, age, isActive); // 1 Nashu 25 true


// const oldArr = [1, 2, 3, 4, 5];

// const newArr = [ ...oldArr, 6, 7, 8, 9, 10 ];

// console.log(newArr); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// const {isActive, ...rest} = user; // This creates a new object without isActive property
// console.log(rest); // { id: 1, name: 'Nashu', age

// function cube(a) {
//     return a * a * a;
// }

// console.log(oldArr.map(num => cube(num))); // 27

// number1 = [1, 3, 5, 7, 10];

// function hiEvenHiFive(num) {

// }

// const hiEvenHiFive = number1.map(num => hiEvenHiFive(num));
// console.log(hiEvenHiFive); // This will log an array of results from the hiEvenHiFive function


// const user = {
//     id: 1,
//     name: 'Nashu',
//     age: 25,
//     isActive: true,
// }

// for (const key in user) {
//     console.log(`${key}: ${user[key]}`);
// }

// const users = [{
//     id: 1,
//     name: 'Nashu',
//     age: 25,
//     isActive: true,
// }, {
//     id: 2,
//     name: 'John',
//     age: 30,
//     isActive: false,
// }, {
//     id: 3,
//     name: 'Jane',
//     age: 28,
//     isActive: true,
// }];

// for (const user of users) {
//     console.log(`ID: ${user.id}, Name: ${user.name}, Age: ${user.age}, Active: ${user.isActive}`);
// }

// for (const [key, value] of Object.entries(users[0])) {
//     console.log(`${key}: ${value}`);
// }

// // map.entries example
// const map = new Map();
// map.set('name', 'Nashu');
// map.set('age', 25);
// map.set('isActive', true);
// for (const [key, value] of map.entries()) {
//     console.log(`${key}: ${value}`);
// }

// let arr = [1, 2, 3, 4, 5];

// function addTwoToArray(arr, multiplier) {
//     return arr.map(num => num + 2 * multiplier(num));
// }

// function multiplier(num){
//     return num * 2;
// }

// console.log(addTwoToArray(arr, multiplier));


async function listOfCountires() {
    try{
        const res = await fetch('https://restcountries.com/v3.1/independent?status=true');
        const data = await res.json();
        for(let i =0; i < data.length; i++) {
            const country = data[i];
            const countryName = country.name.common;
            console.log(`Country Name: ${countryName}`);
            
        }

    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

listOfCountires();
