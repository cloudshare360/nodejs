const assert = require('assert');
const {writeJsonFileInS3} = require('../functions/AssetIngestion/assetingestionv3');
const AWS = require('aws-sdk');
const {S3} = require("aws-sdk");
const AWSMock = require('aws-sdk-mock');
const {ImportMock} = require("ts-mock-imports");
const sinon = require("sinon");

describe("unit cases for removing Duplicates in jsonArray", () => {

    describe( "unit cases for  removing Duplicates in jsonArray ", () => {

        it("Test 1 :removing Duplicates in jsonArray success", async () => {
            let resp;
            AWSMock.setSDKInstance(AWS)
            AWSMock.mock('S3', 'putObject', (params, callback) => {
                console.log(`Object mock written to S3Bucket`);
                callback(null, new Promise(function(resolve,reject){
                    setTimeout(function(){
                        resolve({"status": "success"});
                    },500)
                }));
            });
            // sinon.stub('S3', 'putObject').resolves({
            //     Credentials: {
            //         AccessKeyId: "assesskey",
            //         SecretAccessKey: "",
            //         SessionToken: ""
            //     }
            // });
            // AWSMock.mock('S3', 'putObject', (params, callback) => {
            //     const result = {
            //         Bucket: params.Bucket,
            //         Key: params.Key,
            //         StatusCode: 200,
            //         ETag: 'SASJDHGJHGUYYEQ231HJGJH12',
            //     };
            //     console.log(`Object mock written to S3`);
            //     callback(null, result);
            // });

            try {
                const putObjectParams ={
                    Bucket : 's3Bucket',
                    Key : 'key',
                    Body: JSON.stringify({test: "test"},null,2)
                };

                // AWSMock.setSDKInstance(aws);
                // AWSMock.mock('S3', 'putObject', (putObjectParams, callback) => {
                //     // const result = {
                //     //     "data": {
                //     //         "ETag": "\"40607d494708d8442c9bd37dba67856a\""
                //     //     },
                //     //     "message": "The given Json array was successfully written to s3 Bucket.",
                //     //     "error": null,
                //     //     "statusCode": "200"
                //     // };
                //     console.log(`Object mock written to S3`);
                //     callback(undefined, result);
                // });

                //const jsonArrayWithDuplicates = fs.readFileSync(path.join(__dirname, '..', 'data', 'input', 'oracle-assetId.json'));
                resp = await writeJsonFileInS3('s3Bucket','key', JSON.stringify({test: "test"}));

                assert.strictEqual(resp.message, 'The given CSV file was successfully converted to Json file.');
            }
            catch (e) {
                console.log("error received is"+e);
            }
            AWSMock.restore();
            AWSMock.restore("S3");
            sinon.restore();

        });

        it("Test 2: removing Duplicates in jsonArray fail", async () => {
            let resp;
            try {
                resp = await removeDuplicates([]);
            }
            catch (e) {
                console.log("error received is"+e);
            }
            assert.strictEqual(resp.error, 'Invalid array or Empty Array');
        });

    });

});


