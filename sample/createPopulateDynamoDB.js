// import os
// import boto3
// import botocore
// import handler from "../libs/handler-lib";
//
// .session
//
//
// export const main = handler(async (event, context) => {
//
// region = os.environ.get('AWS_DEFAULT_REGION', 'us-east-2')
// session = botocore.session.get_session()
// dynamo = session.create_client('dynamodb', region_name=region)
//
//
// s3 = boto3.client('s3')
// dynamodb = boto3.resource('dynamodb')
//
// def lambda_handler(event, context):
//
// bucket = event['Records'][0]['s3']['bucket']['name']
// key = event['Records'][0]['s3']['object']['key']
//
// obj = s3.get_object(Bucket=bucket, Key=key)
//
// rows = obj['Body'].read().decode("utf-8"). split ('\n')
//
// table = dynamodb.Table(key)
// dynamodb.create_table(
//     TableName=key,
//     KeySchema=[
//         {
//             'AttributeName': 'first',
//             'KeyType': 'HASH'  #Partition key
// },
// {
//     'AttributeName': 'last',
//     'KeyType': 'RANGE'  #Sort key
// }
// ],
// AttributeDefinitions=[
//     {
//         'AttributeName': 'first',
//         'AttributeType': 'S'
//     },
//     {
//         'AttributeName': 'last',
//         'AttributeType': 'S'
//     },
//
// ],
//     ProvisionedThroughput={
//         'ReadCapacityUnits': 5,
//         'WriteCapacityUnits': 5
//     }
// )
// // Wait for the table to exist before exiting
// print('Waiting for', key, '...')
// waiter = dynamo.get_waiter('table_exists')
// waiter.wait(TableName=key)
// with table.batch_writer() as batch:
// for row in rows:
//
// batch.put_item(Item={
//
//     'first':row.split(',')[0],
//     'last':row.split(',')[1],
//     'age':row.split(',')[2],
//     'date':row.split(',')[3]
//
// })
// });
//
// `You could set the delay time of the waiter to a lower number, such as 1 second, like this: waiter.wait(TableName=key, WaiterConfig={'Delay': 1})
// You can increase the timeout of your lambda function. The combination of creating the table, reading the S3 file, and writing it all to DynamoDB could take more than 3 seconds.
//     Pick a number that gives your lambda function time to recover if a request needs to be retried. If your function works for a file with only 1-2 rows, but fails for larger files,
//     I'd suggest trying 5 seconds, and if that doesn't reliably succeed, increase to 10 seconds. If the files could be very large, you should consider using something other than Lambda.
//     Assuming you're not concerned about overwriting data in a pre-existing table, then you should check if the table already exists
//     before you try to create it (or try to create it and ignore the ResourceAlreadyInUseException that is raised if it already exists).
//     See this other SO Answer for How to check if a DynamoDB table exists, which explains multiple ways to check if the table exists, including code samples for each one.`
