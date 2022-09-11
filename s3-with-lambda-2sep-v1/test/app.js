const fs = require('fs');

const getresp=async()=>
{
    console.log("what");
    let rawdata = await fs.readFile("test.json", function(err,data){
        console.log(rawdata);
    });
//let student = JSON.parse(rawdata);
    console.log(rawdata);
    return rawdata;
}


module.exports = getresp();