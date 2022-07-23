#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EmployeeEC2Stack } from '../lib/ec2';
import { getConfig } from '../lib/config';



const app = new cdk.App();
const conf = getConfig(app);
const env = {
  account: conf.account,
  region: conf.region,
};


new EmployeeEC2Stack(app, 'EmployeeServerStack', { env });