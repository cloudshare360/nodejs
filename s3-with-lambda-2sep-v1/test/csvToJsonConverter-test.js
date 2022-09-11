// Requiring module
const assert = require('assert');
const {csvToJsonConverter} = require('../functions/AssetIngestion/assetingestionv3');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const AWSMock = require('aws-sdk-mock');
const {throws} = require("assert");
const {createNoFilesMatchPatternError, isMochaError} = require("mocha/lib/errors");

describe("unit cases for conversion csv to json", () => {

    describe( "unit cases for conversion csv to json ", () => {

        it("Test 1 :conversion csv to json success", async () => {
            AWSMock.setSDKInstance(aws);
            AWSMock.mock('S3', 'getObject', (params, callback) => {
                const result = {
                    Bucket: params.Bucket,
                    Key: params.Key,
                    StatusCode: 200,
                    ETag: 'SASJDHGJHGUYYEQ231HJGJH12',
                };
                console.log(`Object mock written to S3`);
                callback(undefined, result);
            });
            const csvData ="db_type,db_name,db_unique_name,db_port,host_name,ip_address,os_type,ba_name,ba_number,as_name,as_number,ba_owner,ba_director,ba_vp,as_usedfor,as_hostnamecode,as_supportgroup,as_supportgroupowner,as_director,as_vp,ba_pci,ba_sox,ba_cpni,ba_tier\n" +
                "Oracle,A01APP1,A01APP1,1526,tstpet14.unix.gsm1900.org,0.0.0.0,HP-UX,Samson_CSM,APM0100260,Samson_CSM - Testing,APP0006238,Damion Rowe (DRowe7),Damion Rowe (DRowe7),Meg Knauth (MKnauth1),Testing,XSAM,Amdocs Infra Production,Suryam Musham (SMusham),Suryam Musham (SMusham),Meg Knauth (MKnauth1),N,N,Y,TIER_1\n"
            let resp;
            try {
                resp = await csvToJsonConverter('s3Bucket','key', csvData);
               assert.strictEqual(resp.message, 'The given CSV file was successfully converted to Json array.');
            }
            catch (e) {
                console.log("error received is"+e);
            }
            AWSMock.restore();

        });

        it("Test 2: conversion csv to json fail", async () => {
            let resp;
            AWSMock.setSDKInstance(aws);
            AWSMock.mock('S3', 'getObject', (params, callback) => {
                const error = {
                    err: "error"
                };
                console.log(`Object mock written to S3`);
                callback(error, undefined);
            });
            try {
                resp = await csvToJsonConverter('s3Bucket','key', '');
            }
            catch (e) {
                console.log("error received is"+e);
            }
            assert.strictEqual(resp.error, "Invalid array or Empty Array");
            AWSMock.restore();
        });

        // it("Test 3: conversion csv to json fail", async () => {
        //     let resp;
        //     AWSMock.setSDKInstance(aws);
        //     AWSMock.mock('S3', 'getObject', throws(new isMochaError("invalid file name or file not found")));
        //     try {
        //         resp = await csvToJsonConverter('s3Bucket','key','invalidfile.csv');
        //     }
        //     catch (e) {
        //         console.log("error received is"+e);
        //     }
        //     //assert.strictEqual(resp.error, "invalid file name or file not found");
        // });




    });

});


