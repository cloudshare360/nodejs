const AWS = require('aws-sdk');
const assert = require('assert');
const {executeCsvToJson} = require('../functions/AssetIngestion/assetingestionv3');
const AWSMock = require('mock-aws-s3');
AWSMock.config.basePath = './tmp/buckets/'
const S3 = AWSMock.S3({
    params: { Bucket: 'asset-injection-bucket-v3' }
    , region: 'us-west-2'});

describe("unit cases for getBucketAndKey", () => {

    describe( "unit cases for getting Bucket name And Key", () => {

        it("Test 1 :conversion csv to json success", async () => {
            let resp;
            const event = {
                "Records": [
                    {
                        "eventVersion": "2.1",
                        "eventSource": "aws:s3",
                        "awsRegion": "us-east-1",
                        "eventTime": "2022-07-25T19:37:23.676Z",
                        "eventName": "ObjectCreated:Put",
                        "userIdentity": {
                            "principalId": "AWS:AIDAVPIY6DNHC5AMMLPQI"
                        },
                        "requestParameters": {
                            "sourceIPAddress": "183.87.68.148"
                        },
                        "responseElements": {
                            "x-amz-request-id": "B7D0AX4WMVP6EFKN",
                            "x-amz-id-2": "iWDsqAjMxNBbcRfybX6u0DQUAxll48RlckELEZazWmCDH3AqjYY2N1lF42UFNG9OMLhECxtey8aYYFuQ5/eR6QyxfX45qiXOPpSAZOo2wA4="
                        },
                        "s3": {
                            "s3SchemaVersion": "1.0",
                            "configurationId": "s3-with-lambda-dev-assetingestion-60af9c4c9230acd8c32e15324d0f5384",
                            "bucket": {
                                "name": "asset-injection-bucket-v3",
                                "ownerIdentity": {
                                    "principalId": "A3MBNU7JJK7MBD"
                                },
                                "arn": "arn:aws:s3:::asset-injection-bucket-v3"
                            },
                            "object": {
                                "key": "oracle-assetId.csv",
                                "size": 3491,
                                "eTag": "e4286f04522072299636a38232bf6aed",
                                "sequencer": "0062DEF0F363504A59"
                            }
                        }
                    }
                ]
            }

            try {
                resp = await executeCsvToJson(event);
                assert.strictEqual(resp.message, 'The given CSV file was successfully converted to Json array.');
            }
            catch (e) {
                console.log("error received is"+e);
            }

        });

    });

});

