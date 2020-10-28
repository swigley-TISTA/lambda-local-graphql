variable "env" {
  type = string
  description = "The name of the environment for the Lambda function (prod, dev, qa, etc.)."
}

variable "aws_region" {
  type = string
  description = "The name of the aws_region for the Lambda function."
}

variable "function_name" {
  type = string
  description = "The name of the Lambda function."
}

variable "handler" {
  type = string
  description = "The name of the Lambda function handler."
}

variable "dist_package" {
  type = string
  description = "The path zip dist package for the Lambda function handler."
}

provider "aws" {
  region = var.aws_region
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "basic-lambda-function" {
  filename      = var.dist_package
  function_name = var.function_name
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = var.handler

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  #source_code_hash = "${base64sha256(file("../../../dist/graphql-api.zip"))}"
  source_code_hash = filebase64sha256(var.dist_package)

  runtime = "nodejs12.x"

  environment {
    variables = {
      foo = "bar"
    }
  }
}