// const csv = require("csvtojson");
// const {stringify, responseMessage} = require("../../services/helper");


// async function csvToJsonConverter(s3Bucket, s3Key, csvData) {
//     console.log("-------start csvToJsonConverter-------");
//
//     const map = new Map();
//     let response;
//
//     try {
//         const dataPromise = new Promise(function (resolve) {
//             console.log("-------start of dataPromise-------");
//             csv()
//                 .fromString(csvData)
//                 .then((assets) => {
//                     console.log(`assets : ${assets}`);
//
//                     const namesAndRoles = getNameAndRoles(assets);
//                     console.log(`namesAndRoles: ${namesAndRoles}`);
//
//                     console.log("-------start of execution of removeDuplicates-------");
//                     if (namesAndRoles.length) {
//                         for (let i = 0; i < namesAndRoles.length; i++) {
//                             const databases = [];
//                             const dataSensitivity = [];
//                             if (map.has(namesAndRoles[i].assetId)) {
//                                 const assetIdValue = map.get(namesAndRoles[i].assetId);
//                                 assetIdValue.databases.push(namesAndRoles[i].databases[0]);
//                                 if (namesAndRoles[i].tags.dataSensitivity[0]) {
//                                     assetIdValue.tags.dataSensitivity.push(
//                                         namesAndRoles[i].tags.dataSensitivity[0]
//                                     );
//                                 }
//                                 map.set(namesAndRoles[i].assetId, assetIdValue);
//                             } else {
//                                 map.set(namesAndRoles[i].assetId, namesAndRoles[i]);
//                             }
//                         }
//
//                         const uniqueValues = Array.from(map.values());
//                         const values = getFinalJsonWithTags(uniqueValues);
//                         console.log(`Final JSON Data before upload: ${stringify(values)}`);
//
//                         response = responseMessage({
//                             statusCode: 200,
//                             data: values,
//                             message:
//                                 "The given CSV file was successfully converted to Json array.",
//                         });
//                     } else {
//                         response = responseMessage({
//                             statusCode: 404,
//                             message: "Invalid array or Empty Array",
//                         });
//                         resolve(response);
//                     }
//                     console.log("-------end of execution of removeDuplicates-------");
//                     resolve(response);
//                 })
//                 .catch((error) => {
//                     console.log(
//                         err +
//                         " was encountered while converting our csv file to json format"
//                     );
//                 });
//
//             console.log("-------end of dataPromise-------");
//         });
//
//         console.log(`-------end csvToJsonConverter-------`);
//         return await dataPromise;
//     } catch (error) {
//         console.log(error);
//         throw new Error(
//             `Error getting object ${s3Key} from bucket ${s3Bucket}. Make sure they exist and your bucket is in the same region as this function.`
//         );
//     }
// }
//
// function getFinalJsonWithTags(uniqueValues) {
//     const result = uniqueValues.map((item, i) => {
//         const { tags } = item || {};
//         const {
//             dataSensitivity: dataSensitivityList,
//             dangerOfExploitation,
//             breadthOfConsumption,
//         } = tags || {};
//         const dataSensitivity = checkDataSensitivity(dataSensitivityList);
//         const rasScore = getRasScore({
//             ds: dataSensitivity,
//             doe: dangerOfExploitation,
//             boc: breadthOfConsumption,
//         });
//         uniqueValues[i].tags.dataSensitivity = dataSensitivity;
//         uniqueValues[i].tags.RasScore = rasScore;
//         uniqueValues[i].tags.RiskType = getRiskType(rasScore);
//         return item;
//     });
//     return result;
// }
