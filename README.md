# AWS Lambda Local API Development

A node.js example showing how to develop a GraphQL API locally for AWS Lambda and deploy with terraform.

1. Install [AWS SAM CLI tool](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).

npm run-script build

```
> npm run-script build                         
Debugger attached.

> lambda-local-graphql@1.0.0 build /Users/samwigley/Projects/github.com/swigley-TISTA/lambda-local-graphql
> cd graphql-api && sam build

Building codeuri: hello-world/ runtime: nodejs12.x metadata: {} functions: ['HelloWorldFunction']
Running NodejsNpmBuilder:NpmPack
Running NodejsNpmBuilder:CopyNpmrc
Running NodejsNpmBuilder:CopySource
Running NodejsNpmBuilder:NpmInstall
Running NodejsNpmBuilder:CleanUpNpmrc

Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml

Commands you can use next
=========================
[*] Invoke Function: sam local invoke
[*] Deploy: sam deploy --guided
    
Waiting for the debugger to disconnect...

```

npm run-script invoke

```

> npm run-script invoke                        

Debugger attached.

lambda-local-graphql@1.0.0 invoke /Users/samwigley/Projects/github.com/swigley-TISTA/lambda-local-graphql
cd graphql-api && sam local invoke

Invoking app.lambdaHandler (nodejs12.x)
Skip pulling image and use local one: amazon/aws-sam-cli-emulation-image-nodejs12.x:rapid-1.6.2.

Mounting /Users/samwigley/Projects/github.com/swigley-TISTA/lambda-local-graphql/graphql-api/.aws-sam/build/HelloWorldFunction as /var/task:ro,delegated inside runtime container
2020-10-28T22:09:00.074Z        undefined       INFO    Loading node envoronment: undefined
START RequestId: 721a7d06-e667-1a2f-e566-2a32f0c1b51e Version: $LATEST
END RequestId: 721a7d06-e667-1a2f-e566-2a32f0c1b51e
REPORT RequestId: 721a7d06-e667-1a2f-e566-2a32f0c1b51e  Init Duration: 169.10 ms        Duration: 5.12 ms       Billed Duration: 100 ms Memory Size: 128 MB     Max Memory Used: 40 MB

{"statusCode":200,"body":"{\"message\":\"hello world\"}"}
Waiting for the debugger to disconnect...

```

npm run-script test

```

> npm run-script test  

Debugger attached.

lambda-local-graphql@1.0.0 test /Users/samwigley/Projects/github.com/swigley-TISTA/lambda-local-graphql
mocha graphql-api/hello-world/tests/unit/test-handler.js

Debugger attached.
Loading node envoronment: "development"
Loading node envoronment: "development"


  Tests index
    ✓ verifies successful response


  1 passing (4ms)


```

npm run-script package

```

> npm run-script package

Debugger attached.

lambda-local-graphql@1.0.0 package /Users/samwigley/Projects/github.com/swigley-TISTA/lambda-local-graphql
cd graphql-api/.aws-sam/build/HelloWorldFunction && zip -r ../../../../graphql-api.zip *

updating: app.js (deflated 53%)
updating: node_modules/ (stored 0%)
updating: node_modules/string.prototype.trimend/ (stored 0%)
updating: node_modules/string.prototype.trimend/LICENSE (deflated 41%)
updating: node_modules/string.prototype.trimend/test/ (stored 0%)
...
updating: package.json (deflated 42%)
Waiting for the debugger to disconnect...

```
