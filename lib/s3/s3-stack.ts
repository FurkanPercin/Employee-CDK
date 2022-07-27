import { aws_iam, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
aws_s3,
 } from 'aws-cdk-lib';
import { getConfig } from '../config';

export class EmployeePhotosStack extends Stack {
    
    get availabilityZones(): string[] {//To restrict AZ
        return ['eu-central-1b', 'eu-central-1c']
    }
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const config = getConfig(scope);

    const employeePhotosBucket= new aws_s3.Bucket(this,'EmployeePhotosBucket',{
        bucketName:`${config.account}-${config.region}-employee-photos-bucket`,
        removalPolicy:RemovalPolicy.RETAIN,
        

    });
    const bucketPolicy = new aws_s3.BucketPolicy(this,'EmployeePhotosBucketPolicy',{
        bucket:employeePhotosBucket,
        removalPolicy:RemovalPolicy.RETAIN,
    });

    bucketPolicy.document.addStatements(
        new aws_iam.PolicyStatement({
            effect:aws_iam.Effect.ALLOW,
            principals:[new aws_iam.ServicePrincipal('ec2.amazonaws.com')],
            actions:['s3:*'],
            resources:[`${employeePhotosBucket.bucketArn}/*`],
        }),
        
    );
    

   



  }
}
