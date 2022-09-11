const inputFile = require('./oracle_delta.json')
const fs = require('fs');

//console.log(inputFile.length);

let map = new Map();
for(let i=0; i< inputFile.length; i++)
{
    console.log("**********Start of Index", i);
    let databases = [];
    if (map.has(inputFile[i].assetId))
    {

        let assetIdValue = map.get(inputFile[i].assetId);
        //console.log("assetIdValue", assetIdValue);
        //console.log("assetIdValue Current", assetIdValue.databases.length);
        //assetIdValue.databases[assetIdValue.databases.length] = inputFile[i].databases[0];
        assetIdValue.databases.push(inputFile[i].databases[0]);
        console.log('Second DataBase Check', assetIdValue.databases);
        //console.log("assetIdValue New", assetIdValue.databases.length);
        //assetIdValue.databases = JSON.stringify(assetIdValue.databases);
        map.set(inputFile[i].assetId, assetIdValue);

    }
    else
    {
     map.set(inputFile[i].assetId, inputFile[i]);
    }
    console.log("**********End of Index", i);
}
console.log("map ********",map);
console.log("map ********1",...map.values());

const values = Array.from(map.values());
console.log("values"+ JSON.stringify(values, null, 2))
fs.writeFileSync("fileWithUniqueRecords.json", JSON.stringify(values, null, 2));
