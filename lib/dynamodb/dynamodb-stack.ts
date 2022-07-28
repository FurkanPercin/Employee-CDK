import {  RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
aws_dynamodb,
 } from 'aws-cdk-lib';
import { getConfig } from '../config';

export class DynamoDBStack extends Stack {
    
    get availabilityZones(): string[] {//To restrict AZ
        return ['eu-central-1b', 'eu-central-1c']
    }
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const config = getConfig(scope);

    const employeeDataTable = new aws_dynamodb.Table(this,"EmployeeDataTable",{
        tableName:"Employees",
        readCapacity:config.DynamoDBReadCapacity,
        writeCapacity:config.DynamoDBWriteCapacity,
        partitionKey:{name: 'id', type: aws_dynamodb.AttributeType.STRING},
        billingMode: aws_dynamodb.BillingMode.PROVISIONED,
        removalPolicy: RemovalPolicy.DESTROY,
        pointInTimeRecovery: true,
        sortKey: {name: 'createdAt', type: aws_dynamodb.AttributeType.NUMBER},

    })

   



  }
}
