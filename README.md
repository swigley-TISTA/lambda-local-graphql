# AWS Lambda Local API Development

A node.js example showing how to develop a GraphQL API locally for AWS Lambda and deploy with terraform.  Inspired by the AWS documentation [Step-through debugging Node.js functions locally](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-debugging-nodejs.html), but using Terraform for infrastructure configuration and deployment.

1. Install [AWS SAM CLI tool](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).

To build, run npm run-script build.

```
> npm run-script build                         
Debugger attached.

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

To perform a test invocation, run npm run-script invoke.

```

> npm run-script invoke                        

Debugger attached.

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

Start local instance of API Gateway for routing requests to the local Lambda function.

```

>npm run-script start-api

Debugger attached.

Mounting HelloWorldFunction at http://127.0.0.1:3000/hello [GET]
You can now browse to the above endpoints to invoke your functions. You do not need to restart/reload SAM CLI while working on your functions, changes will be reflected instantly/automatically. You only need to restart SAM CLI if you update your AWS SAM template
2020-10-29 12:05:32  * Running on http://127.0.0.1:3000/ (Press CTRL+C to quit)



> curl -s http://localhost:3000/hello | jq
{
  "message": "hello world"
}


```


To test, run npm run-script test.

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



Run npm run-script package

```

> npm run-script package

Debugger attached.


updating: app.js (deflated 53%)
updating: node_modules/ (stored 0%)
updating: node_modules/string.prototype.trimend/ (stored 0%)
updating: node_modules/string.prototype.trimend/LICENSE (deflated 41%)
updating: node_modules/string.prototype.trimend/test/ (stored 0%)
...
updating: package.json (deflated 42%)
Waiting for the debugger to disconnect...

```

Run terragrunt init and terragrunt plan from the component directory for the environment.

```
> cd terraform/prod/lambda
terraform/prod/lambda> terragrunt init
terraform/prod/lambda> terragrunt plan

[terragrunt] 2020/10/28 17:36:10 Running command: terraform plan
Acquiring state lock. This may take a few moments...
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.


------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_iam_role.iam_for_lambda will be created
  + resource "aws_iam_role" "iam_for_lambda" {
      + arn                   = (known after apply)
      + assume_role_policy    = jsonencode(
            {
              + Statement = [
                  + {
                      + Action    = "sts:AssumeRole"
                      + Effect    = "Allow"
                      + Principal = {
                          + Service = "lambda.amazonaws.com"
                        }
                      + Sid       = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + max_session_duration  = 3600
      + name                  = "HelloWorld-LambdaRole-prod"
      + path                  = "/"
      + unique_id             = (known after apply)
    }

  # aws_lambda_function.basic-lambda-function will be created
  + resource "aws_lambda_function" "basic-lambda-function" {
      + arn                            = (known after apply)
      + filename                       = "/Users/samwigley/Projects/github.com/swigley-TISTA/lambda-local-graphql/terraform/prod/lambda/../../../dist/graphql-api.zip"
      + function_name                  = "HelloWorld-prod"
      + handler                        = "exports.lambdaHandler"
      + id                             = (known after apply)
      + invoke_arn                     = (known after apply)
      + last_modified                  = (known after apply)
      + memory_size                    = 128
      + publish                        = false
      + qualified_arn                  = (known after apply)
      + reserved_concurrent_executions = -1
      + role                           = (known after apply)
      + runtime                        = "nodejs12.x"
      + source_code_hash               = "Jz3imRqooPhEXG5j0f9lGtYgNc5mjv4cM4RPxnyk0Vs="
      + source_code_size               = (known after apply)
      + timeout                        = 3
      + version                        = (known after apply)

      + environment {
          + variables = {
              + "foo" = "bar"
            }
        }

      + tracing_config {
          + mode = (known after apply)
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + this_lambda_arn = (known after apply)

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.

Releasing state lock. This may take a few moments...

```

Run terragrunt apply.

```
> terragrunt apply

Acquiring state lock. This may take a few moments...

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_iam_role.iam_for_lambda will be created
  + resource "aws_iam_role" "iam_for_lambda" {
      + arn                   = (known after apply)
      + assume_role_policy    = jsonencode(
            {
              + Statement = [
                  + {
                      + Action    = "sts:AssumeRole"
                      + Effect    = "Allow"
                      + Principal = {
                          + Service = "lambda.amazonaws.com"
                        }
                      + Sid       = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + max_session_duration  = 3600
      + name                  = "HelloWorld-LambdaRole-prod"
      + path                  = "/"
      + unique_id             = (known after apply)
    }

  # aws_lambda_function.basic-lambda-function will be created
  + resource "aws_lambda_function" "basic-lambda-function" {
      + arn                            = (known after apply)
      + filename                       = "/Users/samwigley/Projects/github.com/swigley-TISTA/lambda-local-graphql/terraform/prod/lambda/../../../dist/graphql-api.zip"
      + function_name                  = "HelloWorld-prod"
      + handler                        = "exports.lambdaHandler"
      + id                             = (known after apply)
      + invoke_arn                     = (known after apply)
      + last_modified                  = (known after apply)
      + memory_size                    = 128
      + publish                        = false
      + qualified_arn                  = (known after apply)
      + reserved_concurrent_executions = -1
      + role                           = (known after apply)
      + runtime                        = "nodejs12.x"
      + source_code_hash               = "Jz3imRqooPhEXG5j0f9lGtYgNc5mjv4cM4RPxnyk0Vs="
      + source_code_size               = (known after apply)
      + timeout                        = 3
      + version                        = (known after apply)

      + environment {
          + variables = {
              + "foo" = "bar"
            }
        }

      + tracing_config {
          + mode = (known after apply)
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + this_lambda_arn = (known after apply)

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

aws_iam_role.iam_for_lambda: Creating...
aws_iam_role.iam_for_lambda: Creation complete after 1s [id=HelloWorld-LambdaRole-prod]
aws_lambda_function.basic-lambda-function: Creating...
aws_lambda_function.basic-lambda-function: Still creating... [10s elapsed]
aws_lambda_function.basic-lambda-function: Creation complete after 16s [id=HelloWorld-prod]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
Releasing state lock. This may take a few moments...

Outputs:

this_lambda_arn = arn:aws:lambda:us-east-2:357771246612:function:HelloWorld-prod

```