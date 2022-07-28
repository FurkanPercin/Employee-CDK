### CourseraVpcStack
cdk synth --app "npx ts-node bin/coursera_project.ts" EmployeeVpcStack
cdk deploy --app "npx ts-node bin/coursera_project.ts" EmployeeVpcStack
cdk diff --app "npx ts-node bin/coursera_project.ts" EmployeeVpcStack


### EmployeeServerStack
cdk synth --app "npx ts-node bin/computing.ts" EmployeeServerStack
cdk deploy --app "npx ts-node bin/computing.ts" EmployeeServerStack
cdk diff --app "npx ts-node bin/computing.ts" EmployeeServerStack

### EmployeePhotosStack
cdk synth --app "npx ts-node bin/coursera_project.ts" EmployeePhotosStack
cdk deploy --app "npx ts-node bin/coursera_project.ts" EmployeePhotosStack
cdk diff --app "npx ts-node bin/coursera_project.ts" EmployeePhotosStack

### DynamoDBStack
cdk synth --app "npx ts-node bin/coursera_project.ts" DynamoDBStack
cdk deploy --app "npx ts-node bin/coursera_project.ts" DynamoDBStack
cdk diff --app "npx ts-node bin/coursera_project.ts" DynamoDBStack
