const inputFile = require('./oracle_delta.json')

let newElement1 = inputFile[0];
let newElement2 = inputFile[1];
let newElement3 = inputFile[2];

let newElement4 = newElement1

console.log('newElement4-1', newElement4);
newElement4.databases.push(newElement2.databases[0]);
newElement4.databases.push(newElement3.databases[0]);
console.log('newElement4-2', newElement4);




