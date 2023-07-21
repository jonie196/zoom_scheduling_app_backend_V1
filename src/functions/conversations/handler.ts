import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { conversationsService } from '../../service'
import { contactsService } from "../../service";


export const getAllConversations = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const page: number = event.queryStringParameters?.page ? parseInt(event.queryStringParameters.page, 10) : 1;
        const conversationsData = await conversationsService.getAllConversations(page);
        const data = await contactsService.getAllContacts(0);
        // Extract the title, last message, and sender name information for each conversation
        const conversationData = conversationsData.conversations.map((conversation) => {
            const lastMessage = conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1] : null;
            const senderName = lastMessage ? data.contacts.find((item) => item.id === lastMessage.senderId)?.name : null;
            return {
                id: conversation.id,
                title: conversation.title,
                lastMessage: lastMessage ? lastMessage.content : null,
                senderName: senderName || null,
                currentPage: conversationsData.currentPage,
                totalPages: conversationsData.totalPages,
            };
        });
        return formatJSONResponse(200, {
            conversations: conversationData,
        });
    } catch (error) {
        console.error("Error occurred while fetching conversations:", error);
        return formatJSONResponse(500, {
            message: error,
        });
    }
});



export const createConversation = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = event.body;

        if (!Array.isArray(requestBody.participants)) {
            return formatJSONResponse(403, {
                status: "error",
                message: "Participants should be an array.",
            });
        }

        if (typeof requestBody.title !== "string") {
            return formatJSONResponse(403, {
                status: "error",
                message: "Title should be a string.",
            });
        }

        const conversation = await conversationsService.createConversation({
            id: Math.floor(Math.random() * 1000000),
            title: requestBody.title,
            participants: requestBody.participants,
            messages: [],
            createdAt: new Date().toISOString()
        })
        return formatJSONResponse(200, {
            status: "success",
            conversation
        });
    } catch (error) {
        return formatJSONResponse(500, {
            status: "error",
            message: error
        });
    }
})

export const getConversationById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const conversation = await conversationsService.getConversationById(parseInt(event.pathParameters.id));
        return formatJSONResponse(200, {
            status: "success",
            conversation,
        });
    } catch (error) {
        console.error("Error occurred while fetching conversation:", error);
        return formatJSONResponse(500,
            {
                status: "error",
                message: error,
            }
        );
    }
});