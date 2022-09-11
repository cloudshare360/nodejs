const AWS = require('aws-sdk');
const assert = require('assert');
const {writeJsonFileInS3, csvToJsonConverter} = require('../functions/AssetIngestion/assetingestionv3');
const AWSMock = require('mock-aws-s3');
AWSMock.config.basePath = './tmp/buckets/'
 // Can configure a basePath for your local buckets
const S3 = AWSMock.S3({
    params: { Bucket: 'asset-injection-bucket-v3' }
, region: 'us-west-2'});


describe("unit cases for removing Duplicates in jsonArray", () => {

    describe( "unit cases for  removing Duplicates in jsonArray ", () => {

        it("Test 1 :removing Duplicates in jsonArray success", async () => {
            let resp;
            const csvData ="db_type,db_name,db_unique_name,db_port,host_name,ip_address,os_type,ba_name,ba_number,as_name,as_number,ba_owner,ba_director,ba_vp,as_usedfor,as_hostnamecode,as_supportgroup,as_supportgroupowner,as_director,as_vp,ba_pci,ba_sox,ba_cpni,ba_tier\n" +
                "Oracle,A01APP1,A01APP1,1526,tstpet14.unix.gsm1900.org,0.0.0.0,HP-UX,Samson_CSM,APM0100260,Samson_CSM - Testing,APP0006238,Damion Rowe (DRowe7),Damion Rowe (DRowe7),Meg Knauth (MKnauth1),Testing,XSAM,Amdocs Infra Production,Suryam Musham (SMusham),Suryam Musham (SMusham),Meg Knauth (MKnauth1),N,N,Y,TIER_1\n"


            try {
                const jsonData = await csvToJsonConverter('asset-injection-bucket-v3','key', csvData);
                resp = await writeJsonFileInS3('asset-injection-bucket-v3',"test_file", jsonData);
                assert.strictEqual(resp.message, 'The given Json array was successfully written to s3 Bucket.');
            }
            catch (e) {
                console.log("error received is"+e);
            }

        });


    });

});


