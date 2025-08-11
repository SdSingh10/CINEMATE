export type AmplifyDependentResourcesAttributes = {
  "api": {
    "mlapi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "nodeapi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "cinemate7e3a0402": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "cinematemodel2004": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "nodeBackend": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "s3ModelStorage": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}