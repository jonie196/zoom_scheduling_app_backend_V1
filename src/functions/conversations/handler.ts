import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { conversationsService } from '../../service'


export const getAllConversations = middyfy(async (): Promise<APIGatewayProxyResult> => {
    try {
        const conversations = await conversationsService.getAllConversations();
        return formatJSONResponse(200, {
            conversations,
        });
    } catch (error) {
        console.error("Error occurred while fetching conversations:", error);
        return formatJSONResponse(500,
            {
                message: error,
            }
        );
    }
});

export const createConversation = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = event.body;

        const conversation = await conversationsService.createConversation({
            id: Math.floor(Math.random() * 1000000),
            title: requestBody.title,
            participants: requestBody.participants,
            messages: [],
            createdAt: new Date().toISOString()
        })
        return formatJSONResponse(200, {
            conversation
        });
    } catch (error) {
        return formatJSONResponse(500, {
            message: error
        });
    }
})

export const getConversationById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const conversation = await conversationsService.getConversationById(parseInt(event.pathParameters.id));
        return formatJSONResponse(200, {
            conversation,
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