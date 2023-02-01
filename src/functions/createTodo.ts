import { APIGatewayProxyHandler } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { document } from '../utils/dynamodbClient'

interface ITodo {
  id?: string;
  title: string;
  done?: boolean;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  //http://localhost:3000/dev/todos/{user_id}
  const { title, deadline } = JSON.parse(event.body) as ITodo
  const { user_id } = event.pathParameters;
  const id = uuidv4();

  await document
    .put({
      TableName: 'todos',
      Item: {
        id,
        user_id,
        title,
        done: false,
        deadline
      }
    })
    .promise()
  const response = await document.query({
    TableName: 'todos',
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise()
  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0])
  }
}