import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { messagesService } from '../../service'

export const getMessageById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const conversation = await messagesService.getMessageById(parseInt(event.pathParameters.id));
        const message = conversation.messages.find(message => message.id === parseInt(event.pathParameters.messageId));
        return formatJSONResponse(200, {
            message,
        });
    } catch (error) {
        console.error("Error occurred while fetching conversation:", error);
        return formatJSONResponse(500,
            {
                message: error,
            }
        );
    }
});

export const getMessages = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const conversation = await messagesService.getMessageById(parseInt(event.pathParameters.id));
        const message = conversation.messages
        return formatJSONResponse(200, {
            message,
        });
    } catch (error) {
        console.error("Error occurred while fetching conversation:", error);
        return formatJSONResponse(500,
            {
                message: error,
            }
        );
    }
});

export const createMessage = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        // Parse the request body as JSON
        const requestBody = event.body;

        const message = {
            id: Math.floor(Math.random() * 1000000),
            senderId: requestBody.senderId,
            content: requestBody.content,
            type: requestBody.type,
            createdAt: new Date().toISOString()
        };

        await messagesService.createMessage(parseInt(event.pathParameters.id), message);


        return formatJSONResponse(200, {
            message,
        });
    } catch (error) {
        console.error("Error occurred while fetching conversation:", error);
        return formatJSONResponse(500, {
            message: error,
        });
    }
});

