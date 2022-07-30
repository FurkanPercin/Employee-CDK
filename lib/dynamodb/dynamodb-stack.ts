import {  RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
aws_dynamodb,
 } from 'aws-cdk-lib';
import { getConfig } from '../config';

export class DynamoDBStack extends Stack {
    
    
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
        pointInTimeRecovery: false,
        //sortKey: {name: 'createdAt', type: aws_dynamodb.AttributeType.NUMBER},
      
    })

   



  }
}
