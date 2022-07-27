import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
aws_ec2,
aws_iam,

 } from 'aws-cdk-lib';
import { getConfig } from '../config';
import { readFileSync } from 'fs';

export class EmployeeEC2Stack extends Stack {
    

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const config = getConfig(scope);

    const role= new aws_iam.Role(this,'EmployeeServerRole',{
        roleName:'EmployeeServerIAMRole',
        assumedBy:new aws_iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    role.addToPolicy(new aws_iam.PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        resources: [ '*' ],
        actions: [
          's3:*',
          'dynamodb:*',
        ]

    }));

    const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'EmployeeVPC', {
        availabilityZones: config.availabilityZones,
        vpcId: config.vpcId,
        publicSubnetIds: config.publicSubnetIds, 


      });

      const machineSg = new aws_ec2.SecurityGroup(this, 'EmployeeServerSG', {
        vpc,
        allowAllOutbound: true,
        securityGroupName: 'employee-server-sg',
        description:'Enable HTTP access',
        

      });

      //incoming traffic
      machineSg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(22), 'allow access to ssh port anywhere')
      machineSg.addIngressRule(aws_ec2.Peer.anyIpv4(),aws_ec2.Port.tcp(80),'allow HTTP port to be accessible from anywhere');
      machineSg.addIngressRule(aws_ec2.Peer.anyIpv4(),aws_ec2.Port.tcp(443),'allow HTTPs port to be accessible from anywhere');

      
       

      const myInstance = new aws_ec2.Instance(this, 'EmployeeServer', {
        instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T2, aws_ec2.InstanceSize.MICRO),
        vpc,
        machineImage: new aws_ec2.AmazonLinuxImage({
          generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
        keyName: 'coursera-pem', // instance'a bağlanmak için key-pair
        securityGroup: machineSg,
        role:role,
        
   
      

        
    });
    const userDataScript=readFileSync('./lib/user-data.sh','utf-8');
    myInstance.addUserData(userDataScript);

  }
}
