#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CourseraVpcStack } from '../lib/vpc';
import { getConfig } from '../lib/config';



const app = new cdk.App();
const conf = getConfig(app);
const env = {
  account: conf.account,
  region: conf.region,
};


new CourseraVpcStack(app, 'EmployeeVpcStack', { env });