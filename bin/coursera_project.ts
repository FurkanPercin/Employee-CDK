#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CourseraVpcStack } from '../lib/vpc';
import { getConfig } from '../lib/config';
import { EmployeePhotosStack } from '../lib/s3';
import { DynamoDBStack } from '../lib/dynamodb';
import { CloudWatchAlarm } from '../lib/cloudwatch';

const app = new cdk.App();
const conf = getConfig(app);
const env = {
  account: conf.account,
  region: conf.region,
};


new CourseraVpcStack(app, 'EmployeeVpcStack', { env });

new EmployeePhotosStack(app, 'EmployeePhotosStack', { env });
new DynamoDBStack(app, 'DynamoDBStack', { env });
new CloudWatchAlarm(app, 'CloudWatchAlarm', { env });