import { APIGatewayProxyHandler } from 'aws-lambda'
import { document } from '../utils/dynamodbClient'


export const handler: APIGatewayProxyHandler = async (event) => {
  //http://localhost:3000/dev/todos/{user_id}
  const { user_id } = event.pathParameters;
  console.log('USER_ID =>', user_id)

  const response = await document
    .scan({
      TableName: 'todos',
      FilterExpression: ':user_id = user_id',
      ExpressionAttributeValues: {
        ':user_id': user_id,
      },
    })
    .promise();
  
  if (response.Items.length > 0) {
    return {
      statusCode: 201,
      body: JSON.stringify(response.Items)
    }
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "There is not TODOS fro this user"
    })
  }

  
}