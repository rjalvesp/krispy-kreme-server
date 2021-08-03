const AWS = require("aws-sdk");
const {
  accessKeyId,
  secretAccessKey,
  region,
  userPoolId: UserPoolId,
} = require("./settings");

const credentials = {
  accessKeyId,
  region,
  secretAccessKey,
};

AWS.config.update(credentials);

const cognitoClient = new AWS.CognitoIdentityServiceProvider();

module.exports = {
  UserPoolId,
  adminCreateUser: (params) => cognitoClient.adminCreateUser(params).promise(),
  adminSetUserPassword: (params) =>
    cognitoClient.adminSetUserPassword(params).promise(),
  getUser: (AccessToken) => cognitoClient.getUser({ AccessToken }).promise(),
};
