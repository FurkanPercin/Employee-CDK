import {  aws_cloudwatch_actions, aws_sns, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
 import {
aws_cloudwatch, 
 } from 'aws-cdk-lib';
import { getConfig } from '../config';

export class CloudWatchAlarm extends Stack {
    
    
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const config = getConfig(scope);

    const cpuMetric=new aws_cloudwatch.Metric({
        metricName:'CPUUtilization',
        namespace:'AWS/EC2',
        statistic:"avg",
        period:Duration.minutes(5),
        account:config.account,
        region:config.region
        


    })

    const alarm=new aws_cloudwatch.Alarm(this,'employee-directory-app-CPU-alarm',{
        threshold:40,
        comparisonOperator: aws_cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods:1,
        alarmDescription:'Alarm if the CPU utilization of the EC2 instance exceeds 60',
        alarmName:`${config.account}-${config.region}-employee-app-CPU-util-alarm`,
        metric: cpuMetric,

    });
    const topic =new aws_sns.Topic(this,'Topic')
    alarm.addAlarmAction(new aws_cloudwatch_actions.SnsAction(topic));
    


   



  }
}
