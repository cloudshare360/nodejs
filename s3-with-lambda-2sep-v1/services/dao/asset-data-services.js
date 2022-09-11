const AWS = require("aws-sdk");
const { stringify } = require("../helper");

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

module.exports.getObject = ({ Bucket, Key }) => {
  console.log(`s3.getObject Bucket=${Bucket} Key=${Key}`);
  return s3.getObject({ Bucket, Key }).promise();
};

module.exports.putObject = (params = {}) => {
  console.log(`s3.putObject params=${stringify(params)}`);
  const { Bucket, Key, Body, ...RestProps } = params;
  return s3.putObject({ Bucket, Key, Body, ...RestProps }).promise();
};
