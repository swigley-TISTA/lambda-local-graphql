output "this_lambda_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.basic-lambda-function.arn
}