import { App } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface Config {
  account: string;
  env: string;
  region: string;
  vpcId: string;
  availabilityZones: string[];
  publicSubnetIds: string[];
  DynamoDBReadCapacity:number;
  DynamoDBWriteCapacity:number;
  
}

function getConfig(scope: App | Construct) {
  const context = scope.node.tryGetContext("infra");

  const conf: Config = {
    account: context.account,
    env: context.env,
    region: context.region,
    vpcId: context.vpcId,
    availabilityZones: context.availabilityZones,
    publicSubnetIds: context.publicSubnetIds,
    DynamoDBReadCapacity:context.DynamoDBReadCapacity,
    DynamoDBWriteCapacity:context.DynamoDBWriteCapacity,
 
  };

  return conf;
}

export {
  getConfig,
}