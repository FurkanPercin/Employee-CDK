import { aws_autoscaling, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
aws_ec2,
aws_iam,
aws_elasticloadbalancingv2,
aws_certificatemanager,
aws_route53,
aws_route53_targets
 } from 'aws-cdk-lib';
import { getConfig } from '../config';
import { readFileSync } from 'fs';

export class EmployeeEC2Stack extends Stack {
    

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const config = getConfig(scope);
    const userDataScript=readFileSync('./lib/user-data.sh','utf-8');

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

      const albSG=new aws_ec2.SecurityGroup(this,'albSG',{
        securityGroupName:'load-balancer-sg',
        vpc,
        allowAllOutbound:true,//handle with the egress rule
      });
  
      albSG.addIngressRule(aws_ec2.Peer.anyIpv4(),aws_ec2.Port.tcp(80),'allow HTTP port to be accessible from anywhere');
      albSG.addIngressRule(aws_ec2.Peer.anyIpv4(),aws_ec2.Port.tcp(443),'allow HTTPs port to be accessible from anywhere');
  

      const appALB= new aws_elasticloadbalancingv2.ApplicationLoadBalancer(this,'BackendALB',{
        loadBalancerName:'app-alb',
        vpc,
        internetFacing:true,//load balancer publicly available
        deletionProtection:true,
        securityGroup:albSG,
   
      });

      


      const asg = new aws_autoscaling.AutoScalingGroup(this,'asg',{
          instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T2, aws_ec2.InstanceSize.MICRO),
          vpc,
          machineImage: new aws_ec2.AmazonLinuxImage({
            generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
          }),
          autoScalingGroupName:"app-asg",
          allowAllOutbound:true,
          keyName:'coursera-pem',
          securityGroup: machineSg,
          role:role,
          desiredCapacity:config.desiredCapacity,
          minCapacity:config.minCapacity,
          maxCapacity:config.maxCapacity,
          
          

         
          

      })
      asg.addUserData(userDataScript);
      

      const appTG = new aws_elasticloadbalancingv2.ApplicationTargetGroup(this,'BackendAlbTg',{
        healthCheck:{
          enabled:true,
          path:'/',
          healthyHttpCodes:'200',
          protocol : aws_elasticloadbalancingv2.Protocol.HTTP,
          interval:Duration.seconds(40),
          timeout:Duration.seconds(30),
          healthyThresholdCount:config.healthyThresholdCount,
          unhealthyThresholdCount:config.unhealthyThresholdCount,
        },
        targetGroupName:'app-target-group',
        port:80,
        targets:[asg],
        protocol:aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
        vpc,
       // targetType:aws_elasticloadbalancingv2.TargetType.INSTANCE,
      });
   
      



      const httpListenerAction = aws_elasticloadbalancingv2.ListenerAction.redirect({
        host: '#{host}',
        path: '/#{path}',
        port: '443',
        protocol: 'HTTPS',
        permanent: true,
      });
      
      appALB.addListener('httpListener',{
        port: 80,
        protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
        defaultAction: httpListenerAction //80 portuna istek geldiğinde ne yapılacak
      
      });
      const certificate = aws_certificatemanager.Certificate.fromCertificateArn(this, 'BackendCertificate', config.CertificateARN);
 
      appALB.addListener('httpsListener', {
        port: 443,
        protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
        defaultTargetGroups: [appTG],
        certificates: [certificate]
      });

      asg.scaleOnRequestCount('requests-per-minute', {
        targetRequestsPerMinute: 60,
      });
  
      asg.scaleOnCpuUtilization('cpu-util-scaling', {
        targetUtilizationPercent: 75,
      });


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
    
    myInstance.addUserData(userDataScript);
    const hostedZone = aws_route53.HostedZone.fromHostedZoneAttributes(this, 'PercinTechHostedZone', {
      hostedZoneId: config.HostedZoneId, //insert your hosted zone ID here.
      zoneName: config.zoneName,
    
    });

    const target = new aws_route53_targets.LoadBalancerTarget(appALB);

    new aws_route53.ARecord(this, 'ApiBackendARecord', { //ARecord ==>Alias Record
      target: aws_route53.RecordTarget.fromAlias(target),
      zone: hostedZone,
      recordName: config.recordName,
    });

  }
}
