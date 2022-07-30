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
  CertificateARN:string;
  HostedZoneId:string;
  zoneName:string;
  recordName:string;
  healthyThresholdCount:number;
  unhealthyThresholdCount:number;
  desiredCapacity:number;
  minCapacity:number;
  maxCapacity:number;
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
    CertificateARN:context.CertificateARN,
    HostedZoneId:context.HostedZoneId,
    zoneName:context.zoneName,
    recordName:context.recordName,
    healthyThresholdCount:context.healthyThresholdCount,
    unhealthyThresholdCount:context.unhealthyThresholdCount,
    desiredCapacity:context.desiredCapacity,
    minCapacity:context.minCapacity,
    maxCapacity:context.maxCapacity,
  };
  
  
  return conf;
  }

  


export {
  getConfig,
}