// Requiring module
// const assert = require("assert");
// const aws = require("aws-sdk");
// const fs = require('fs');

const AWSMock = require("aws-sdk-mock");
const sinon = require("sinon");
const assetDataServices= require("../services/dao/asset-data-services");
// const resp = require("./app.js");
const assetIngestionLambda = require("../functions/AssetIngestion/assetingestionv3");

// const {
//   getRasScore,
//   csvToJsonConverter,
//   checkDataSensitivity,
//   getFinalJsonWithTags,
//   getRiskType,
//   writeJsonFileInS3,
//   handler
// } = require("../functions/AssetIngestion/assetingestionv3");

console.log("here");
//const s3GetObjectMockEvent = fs.readFileSync("./data/getObjectMockResponse2.json");

const sampleEvent = require('./data/sampleEvent.json');
let s3GetObjectMockObject = require('./data/getObjectMockResponse2.json');

//const s3PutObjectMockEvent = require("./s3-putObject-params.json");
describe("unit cases for conversion csv to json ", () => {
  it("Test 1.1 :conversion csv to json success", async () => {
    console.log("before parse", s3GetObjectMockObject)
    //s3GetObjectMockObject = JSON.parse(s3GetObjectMockObject);
    console.log("after parse", s3GetObjectMockObject)
   // sinon.stub(assetDataServices, "getObject").returns(s3GetObjectMockObject);
    AWSMock.mock('S3', 'getObject',s3GetObjectMockObject);
        let getObjectLambdaResponse =  await assetIngestionLambda.handler(sampleEvent, "");
      console.log("it is working!!!!", getObjectLambdaResponse);
      //const jsonArray = await csvtojson().fromString(getObjectLambdaResponse);
      // console.log("jsonArray", jsonArray.length);
      //assert.equal(10, jsonArray.length);
    AWSMock.restore();
  });

  // it("Test 1.2 :conversion csv to json success", async () => {
  //   console.log("after parse")
  //
  //   console.log("after parse")
  //   AWSMock.mock("S3", "putObject", s3GetObjectMockObject);
  //   let getObjectLambdaResponse = await assetIngestionLambda.handler(sampleEvent, "");
  //     console.log("it is working!!!!", getObjectLambdaResponse);
  //     const jsonArray = await csvtojson().fromString(getObjectLambdaResponse);
  //     // console.log("jsonArray", jsonArray.length);
  //     // assert.equal(10, jsonArray.length);
  // });

  /*it("Test1.3 Conversion csv to json success", async () => {
    AWSMock.setSDKInstance(aws);
    AWSMock.mock("S3", "getObject", (params, callback) => {
      const result = {
        Bucket: params.Bucket,
        Key: params.Key,
        StatusCode: 200,
        ETag: "SASJDHGJHGUYYEQ231HJGJH12",
      };
      console.log(`Object mock written to S3`);
      callback(undefined, result);
    });
    const csvData =
      "db_type,db_name,db_unique_name,db_port,host_name,ip_address,os_type,ba_name,ba_number,as_name,as_number,ba_owner,ba_director,ba_vp,as_usedfor,as_hostnamecode,as_supportgroup,as_supportgroupowner,as_director,as_vp,ba_pci,ba_sox,ba_cpni,ba_tier\n" +
      "Oracle,A01APP1,A01APP1,1526,tstpet14.unix.gsm1900.org,0.0.0.0,HP-UX,Samson_CSM,APM0100260,Samson_CSM - Testing,APP0006238,Damion Rowe (DRowe7),Damion Rowe (DRowe7),Meg Knauth (MKnauth1),Testing,XSAM,Amdocs Infra Production,Suryam Musham (SMusham),Suryam Musham (SMusham),Meg Knauth (MKnauth1),N,N,Y,TIER_1\n";
    let resp;
    try {
      resp = await csvToJsonConverter("s3Bucket", "s3key", csvData);
      const expectedResult = [
        {
          assetId: "tstpet14.unix.gsm1900.org_1526",
          assetType: "Oracle",
          hostName: "tstpet14.unix.gsm1900.org",
          port: "1526",
          databases: [
            {
              csdmId: "APM0100260",
              dbBundle: "A01APP1",
              application: "Samson_CSM",
              tier: "TIER_1",
            },
          ],
          tags: {
            Environment: "Testing",
            dataSensitivity: "Restricted",
            dangerOfExploitation: "LDC",
            breadthOfConsumption: "MANY",
            RasScore: 14,
            RiskType: "Medium Risk",
          },
          os_type: "HP-UX",
        },
      ];
      assert.deepStrictEqual(resp.data, expectedResult);
    } catch (e) {
      console.log("error received is" + e);
    }
    AWSMock.restore();
  });

  it("Test2 Ras Score", async () => {
    try {
      resp = getRasScore({ ds: "Internal", boc: "MANY", doe: "LDC" });
      assert.strictEqual(resp, 9);
    } catch (e) {
      console.log("error received is" + e);
    }
  });

  it("Test3 Check Data Sensitivity", async () => {
    try {
      const dsList1 = [
        {
          item: "N",
          item2: "N",
          item3: "N",
        },
        {
          item: "N",
          item2: "Y",
          item3: "N",
        },
      ];

      const dsList2 = [
        {
          item: "N",
          item2: "N",
          item3: "N",
        },
      ];

      const dsList3 = [];

      resp1 = checkDataSensitivity(dsList1);
      console.log(resp1);

      assert.strictEqual(resp1, "Restricted");
      resp2 = checkDataSensitivity(dsList2);
      console.log(resp2);
      assert.strictEqual(resp2, "Internal");
      resp3 = checkDataSensitivity(dsList3);
      console.log(resp3);
      assert.strictEqual(resp3, "Restricted");
    } catch (e) {
      console.log("error received is" + e);
    }
  });

  it("Test4 Check getFinalJsonWithTags mapping function", async () => {
    try {
      const inputJsonData = [
        {
          assetId: "tstpet12.unix.gsm1900.org_1526",
          assetType: "Oracle",
          hostName: "tstpet12.unix.gsm1900.org",
          port: "1526",
          databases: [
            {
              csdmId: "APM0100253",
              dbBundle: "A01AR1",
              application: "Samson_Accounts_Receivable",
              tier: "TIER_1",
            },
            {
              csdmId: "APM0100257",
              dbBundle: "A01BL1",
              application: "Samson_Billing",
              tier: "TIER_1",
            },
            {
              csdmId: "APM0100253",
              dbBundle: "A01AR1",
              application: "Samson_Accounts_Receivable",
              tier: "TIER_1",
            },
            {
              csdmId: "APM0100257",
              dbBundle: "A01BL1",
              application: "Samson_Billing",
              tier: "TIER_1",
            },
          ],
          tags: {
            Environment: "Testing",
            dataSensitivity: [
              {
                item: "N",
                item2: "N",
                item3: "N",
              },
              {
                item: "N",
                item2: "Y",
                item3: "N",
              },
              {
                item: "N",
                item2: "Y",
                item3: "N",
              },
              {
                item: "N",
                item2: "Y",
                item3: "Y",
              },
            ],
            dangerOfExploitation: "LDC",
            breadthOfConsumption: "MANY",
          },
          os_type: "HP-UX",
        },
        {
          assetId: "tstpet11.unix.gsm1900.org_1522",
          assetType: "Oracle",
          hostName: "tstpet11.unix.gsm1900.org",
          port: "1522",
          databases: [
            {
              csdmId: "APM0101287",
              dbBundle: "A01HIST",
              application: "Samson_Customer_Database",
              tier: "TIER_1",
            },
          ],
          tags: {
            Environment: "Testing",
            dataSensitivity: [
              {
                item: "N",
                item2: "N",
                item3: "N",
              },
            ],
            dangerOfExploitation: "LDC",
            breadthOfConsumption: "MANY",
          },
          os_type: "HP-UX",
        },
      ];
      const expectedJsonData = [
        {
          assetId: "tstpet12.unix.gsm1900.org_1526",
          assetType: "Oracle",
          hostName: "tstpet12.unix.gsm1900.org",
          port: "1526",
          databases: [
            {
              csdmId: "APM0100253",
              dbBundle: "A01AR1",
              application: "Samson_Accounts_Receivable",
              tier: "TIER_1",
            },
            {
              csdmId: "APM0100257",
              dbBundle: "A01BL1",
              application: "Samson_Billing",
              tier: "TIER_1",
            },
            {
              csdmId: "APM0100253",
              dbBundle: "A01AR1",
              application: "Samson_Accounts_Receivable",
              tier: "TIER_1",
            },
            {
              csdmId: "APM0100257",
              dbBundle: "A01BL1",
              application: "Samson_Billing",
              tier: "TIER_1",
            },
          ],
          tags: {
            Environment: "Testing",
            dataSensitivity: "Restricted",
            dangerOfExploitation: "LDC",
            breadthOfConsumption: "MANY",
            RasScore: 14,
            RiskType: "Medium Risk",
          },
          os_type: "HP-UX",
        },
        {
          assetId: "tstpet11.unix.gsm1900.org_1522",
          assetType: "Oracle",
          hostName: "tstpet11.unix.gsm1900.org",
          port: "1522",
          databases: [
            {
              csdmId: "APM0101287",
              dbBundle: "A01HIST",
              application: "Samson_Customer_Database",
              tier: "TIER_1",
            },
          ],
          tags: {
            Environment: "Testing",
            dataSensitivity: "Internal",
            dangerOfExploitation: "LDC",
            breadthOfConsumption: "MANY",
            RasScore: 9,
            RiskType: "Low Risk",
          },
          os_type: "HP-UX",
        },
      ];
      resp = getFinalJsonWithTags(inputJsonData);
      assert.deepStrictEqual(resp, expectedJsonData);
    } catch (e) {
      console.log("error received is" + e);
    }
  });

  it("Test5 Check Risk Type", async () => {
    try {
      resp1 = getRiskType(9);
      assert.strictEqual(resp1, "Low Risk");
      resp2 = getRiskType(14);
      assert.strictEqual(resp2, "Medium Risk");
      resp3 = getRiskType(15);
      assert.strictEqual(resp3, "High Risk");
    } catch (e) {
      console.log("error received is" + e);
    }
  });*/
});
