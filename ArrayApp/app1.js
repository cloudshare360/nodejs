const inputFile = require('./oracle_delta.json')

let masterItem = {
    databases: []
};
console.log("inputFile", inputFile);
let count = 0;
for(let item of inputFile)
{
    if(count == 0) {
        masterItem = item;
    }
    else {
        //masterItem.databases[masterItem.databases.length] = item.databases[0];
        masterItem.databases.push(item.databases[0]);
        console.log('item****', item);
    }
    count++;

}

console.log("masterItem", masterItem);




