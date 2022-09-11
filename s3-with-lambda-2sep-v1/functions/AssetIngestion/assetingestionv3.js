const AWS = require("aws-sdk");
const S3 = new AWS.S3({ apiVersion: "2006-03-01" });
const csv = require("csvtojson");
const { CONSTANT } = require("../../services/constant");
const { stringify, responseMessage } = require("../../services/helper");
const { DATA_SENSITIVITY, RISK_TYPES, DS_ITEMS, BOC_ITEMS, DOE_ITEMS } =
CONSTANT || {};

async function handler(event, context) {
    console.log(`EVENT ${stringify(event, true)}`);

    if (!event.Records[0]) {
        console.log("Record not found");
        return;
    }

    //Get the object from the event and show its content type
    const recordsItem = event.Records[0];
    const s3Bucket = recordsItem.s3.bucket.name;
    console.log(`S3 bucket name = ${s3Bucket}`);

    const s3Key = getS3Key(recordsItem.s3.object.key);
    console.log(`S3 key = ${s3Key}`);

    const s3Params = {
        Bucket: s3Bucket,
        Key: s3Key,
    };

    console.log(`Input S3 params : ${stringify(s3Params)}`);
    //const s3_object = await assetDataServices.getObject(s3Params);
    const s3_object = await S3.getObject(s3Params).promise();
    console.log("s3_object with inline s3 call",JSON.stringify(s3_object));
    console.log("s3_object type of csvData", typeof s3_object);
      console.log("s3_object.Body type with inline s3 call",typeof s3_object);
    console.log("s3_object.Body with inline s3 call",JSON.stringify(s3_object.Body));
    const csvData = s3_object.Body.toString("utf-8");
    console.log("csvData ", JSON.stringify(csvData, null, 2));
    console.log("csvData with stringify", JSON.stringify(csvData, null, 2));

    const jsonData = await csvToJsonConverter(s3Bucket, s3Key, csvData);
    console.log(`jsonData: ${stringify(jsonData, true)}`);

    const writeResponse = await writeJsonFileInS3(s3Bucket, s3Key, jsonData);
    console.log(`Final Response: ${stringify(writeResponse, true)}`);
    return writeResponse;
}


async function writeJsonFileInS3(s3Bucket, s3Key, jsonData) {
    console.log("-------start of writing of JsonFile into S3-------");
    try {
        const s3Params = {
            Bucket: s3Bucket,
            Key: s3Key.replace(".csv", ".json"),
            Body: stringify(jsonData),
        };

        console.log(`OutPut S3 params : ${stringify(s3Params)}`);
        const response = await S3.putObject(s3Params);
        responseMessage({ statusCode: 200, data: response });
    } catch (error) {
        console.log(error);
        throw new Error(
            `Error writing object to ${s3Key} from bucket ${s3Bucket}.`
        );
    }
}

async function csvToJsonConverter(s3Bucket, s3Key, csvData) {
    console.log("-------start csvToJsonConverter-------");

    const map = new Map();
    let response;

    try {
        const dataPromise = new Promise(function (resolve) {
            console.log("-------start of dataPromise-------");
            csv()
                .fromString(csvData)
                .then((assets) => {
                    console.log(`assets : ${assets}`);

                    const namesAndRoles = getNameAndRoles(assets);
                    console.log(`namesAndRoles: ${namesAndRoles}`);

                    console.log("-------start of execution of removeDuplicates-------");
                    if (namesAndRoles.length) {
                        for (let i = 0; i < namesAndRoles.length; i++) {
                            const databases = [];
                            const dataSensitivity = [];
                            if (map.has(namesAndRoles[i].assetId)) {
                                const assetIdValue = map.get(namesAndRoles[i].assetId);
                                assetIdValue.databases.push(namesAndRoles[i].databases[0]);
                                if (namesAndRoles[i].tags.dataSensitivity[0]) {
                                    assetIdValue.tags.dataSensitivity.push(
                                        namesAndRoles[i].tags.dataSensitivity[0]
                                    );
                                }
                                map.set(namesAndRoles[i].assetId, assetIdValue);
                            } else {
                                map.set(namesAndRoles[i].assetId, namesAndRoles[i]);
                            }
                        }

                        const uniqueValues = Array.from(map.values());
                        const values = getFinalJsonWithTags(uniqueValues);
                        console.log(`Final JSON Data before upload: ${stringify(values)}`);

                        response = responseMessage({
                            statusCode: 200,
                            data: values,
                            message:
                                "The given CSV file was successfully converted to Json array.",
                        });
                    } else {
                        response = responseMessage({
                            statusCode: 404,
                            message: "Invalid array or Empty Array",
                        });
                        resolve(response);
                    }
                    console.log("-------end of execution of removeDuplicates-------");
                    resolve(response);
                })
                .catch((error) => {
                    console.log(
                        err +
                        " was encountered while converting our csv file to json format"
                    );
                });

            console.log("-------end of dataPromise-------");
        });

        console.log(`-------end csvToJsonConverter-------`);
        return await dataPromise;
    } catch (error) {
        console.log(error);
        throw new Error(
            `Error getting object ${s3Key} from bucket ${s3Bucket}. Make sure they exist and your bucket is in the same region as this function.`
        );
    }
}

function getFinalJsonWithTags(uniqueValues) {
    const result = uniqueValues.map((item, i) => {
        const { tags } = item || {};
        const {
            dataSensitivity: dataSensitivityList,
            dangerOfExploitation,
            breadthOfConsumption,
        } = tags || {};
        const dataSensitivity = checkDataSensitivity(dataSensitivityList);
        const rasScore = getRasScore({
            ds: dataSensitivity,
            doe: dangerOfExploitation,
            boc: breadthOfConsumption,
        });
        uniqueValues[i].tags.dataSensitivity = dataSensitivity;
        uniqueValues[i].tags.RasScore = rasScore;
        uniqueValues[i].tags.RiskType = getRiskType(rasScore);
        return item;
    });
    return result;
}

function checkDataSensitivity(dsList) {
    if (!dsList.length) {
        return DATA_SENSITIVITY.RESTRICTED;
    }
    const isYExist = dsList.find((val) => Object.values(val).includes("Y"));
    return isYExist ? DATA_SENSITIVITY.RESTRICTED : DATA_SENSITIVITY.INTERNAL;
}

function getRasScore({ ds, boc, doe }) {
    const finalScore =
        (DS_ITEMS[ds] ? DS_ITEMS[ds] : 0) +
        (BOC_ITEMS[boc] ? BOC_ITEMS[boc] : 0) +
        (DOE_ITEMS[doe] ? DOE_ITEMS[doe] : 0);
    return finalScore;
}

function getRiskType(rasScore) {
    if (rasScore >= 15) {
        return RISK_TYPES.HIGH;
    }

    if (rasScore >= 10 && rasScore <= 14) {
        return RISK_TYPES.MEDIUM;
    }

    return RISK_TYPES.LOW;
}

function getS3Key(key) {
    if (!key) {
        return undefined;
    }
    return decodeURIComponent(key.replace(/\+/g, " "));
}

function getNameAndRoles(assets) {
    return assets.map((p) => ({
        assetId: p.host_name + "_" + p.db_port,
        assetType: p.db_type,
        hostName: p.host_name,
        port: p.db_port,
        databases: [
            {
                csdmId: p.ba_number,
                dbBundle: p.db_name,
                application: p.ba_name,
                tier: p.ba_tier,
            },
        ],
        tags: {
            Environment: p.as_usedfor,
            dataSensitivity: (p.ba_pci || p.ba_sox || p.ba_cpni) ? [{ 'item': p.ba_pci, 'item2': p.ba_sox, 'item3': p.ba_cpni }] : [],
            dangerOfExploitation: "LDC",
            breadthOfConsumption: "MANY",
        },

        os_type: p.os_type,
    }));
}

module.exports = {
    handler,
    getRiskType,
    csvToJsonConverter,
    writeJsonFileInS3,
    getRasScore,
    checkDataSensitivity,
    getFinalJsonWithTags,
};
