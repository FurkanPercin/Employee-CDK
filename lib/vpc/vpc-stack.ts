import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
aws_ec2,
 } from 'aws-cdk-lib';
import { getConfig } from '../config';

export class CourseraVpcStack extends Stack {
    
    get availabilityZones(): string[] {//To restrict AZ
        return ['eu-central-1b', 'eu-central-1c']
    }
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const config = getConfig(scope);



    new aws_ec2.Vpc(this,'EmployeeVPC',{
        vpcName: `${config.account}-${config.region}-employee-vpc-stack`,
        cidr: '10.1.0.0/16',
        maxAzs:2,
    
        subnetConfiguration:[
            {
                name:'public',
                subnetType:aws_ec2.SubnetType.PUBLIC,
                cidrMask:24,

            },
            {
                name:'private',
                subnetType:aws_ec2.SubnetType.PRIVATE_ISOLATED,
                cidrMask:24,


            },
            

        ],


    });




  }
}
