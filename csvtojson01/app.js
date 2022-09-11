const csv = require('csvtojson')
const fs = require('fs')



const inputcsvfile = 'SampleViolations.csv'

const executeCSVToJSON = async() => {
const jsonArray= await csv().fromFile(inputcsvfile);

console.log("jsonArray", jsonArray);
for(let i=0; i<jsonArray.length; i++)
{
     let item = jsonArray[i];
     console.log("item", i, item['IP Address, Port, Instance'])
}

     fs.writeFile('SampleViolations.json', JSON.stringify(jsonArray, null, 2), err => {
          if (err) {
               console.error(err)
               return
          }
          //file written successfully
          console.log("File has written successfully")
     })
}

const executeMain = ()=> {
     executeCSVToJSON();
}
executeMain();