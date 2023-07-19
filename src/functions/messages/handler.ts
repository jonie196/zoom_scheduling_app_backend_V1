import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { messagesService } from '../../service'
import { contactsService } from "../../service";
import { zoomGetAccessToken } from "@libs/zoom-api";

export const getMessageById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const conversation = await messagesService.getMessageById(parseInt(event.pathParameters.id));
        const contacts = await contactsService.getAllContacts();
        const message = conversation.messages.find(message => message.id === parseInt(event.pathParameters.messageId));
        const data = {
            content: message?.content,
            senderName: contacts.find((item) => item.id === message.senderId)?.name,
            senderId: message?.senderId,
            createdAt: message?.createdAt,
            type: message?.type,
        }
        return formatJSONResponse(200, {
            message: data,
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
        const contacts = await contactsService.getAllContacts();
        const messages = conversation.messages
        const messagesData = messages.map((message) => {
            const senderName = contacts.find((item) => item.id === message.senderId)?.name;
            // const lastMessage = conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1] : null;
            // const senderName = lastMessage ? contacts.find((item) => item.id === lastMessage.senderId)?.name : null;
            return {
                content: message.content,
                senderName: senderName,
                senderId: message.senderId,
                createdAt: message.createdAt,
                type: message.type,
            };
        });
        return formatJSONResponse(200, {
            messages: messagesData,
        });
    } catch (error) {
        console.error("Error occurred:", error);
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

        if (message && message.type === 'Meeting') {
            try {
                const accessToken = await zoomGetAccessToken();
                console.log('accessToken', accessToken);
                return formatJSONResponse(200, {
                    accessToken,
                });

            } catch (error) {
                console.error("Error occurred:", error);
                return formatJSONResponse(500, {
                    message: "Error occurred:", error
                });
            }
        }
        return formatJSONResponse(200, {
            message,
        });
    } catch (error) {
        console.error("Error occurred", error);
        return formatJSONResponse(500, {
            message: error,
        });
    }
});

