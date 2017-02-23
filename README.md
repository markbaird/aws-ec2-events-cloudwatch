# Expose AWS EC2 scheduled events as a CloudWatch Metric
An AWS Lambda function to expose AWS EC2 scheduled events as a CloudWatch Metric

## Prerequisites: 
- [Apex Framework](https://github.com/apex/apex) installed locally
- [NodeJS and NPM](https://nodejs.org) installed locally
- An [AWS IAM Lambda execution role](http://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-create-iam-role.html) 
    with the appropriate permissions ([see below](#example-iam-lambda-execution-role)). 
   
## Setup:
- Check out this project
- Modify the `role` setting in `function.json` to point to your AWS IAM Lambda execution role with the appropriate settings. The 
    value should be the IAM role's ARN.
- Deploy the Lambda function to your AWS account using the `apex` command line tool.
- In the AWS Lambda console, setup a scheduled event trigger for the deployed function
- Optional: After running the Lambda function at least once, configure a CloudWatch alert on the new metric
    
## Example IAM Lambda Execution Role:
```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
       "Effect": "Allow",
       "Action": [
         "ec2:DescribeInstanceStatus"
       ],
       "Resource":"*"
     },
     {
       "Sid": "Stmt1463486944000",
       "Effect": "Allow",
       "Action": [
         "cloudwatch:PutMetricData"
       ],
       "Resource": [
         "*"
       ]
     }
  ]
}    
```      