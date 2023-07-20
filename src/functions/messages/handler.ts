import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { messagesService } from '../../service'
import { contactsService } from "../../service";
import { messageActionHandler } from "@libs/zoom-api";

export const getMessageById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const conversation = await messagesService.getMessageById(parseInt(event.pathParameters.id));
        const contactsData = await contactsService.getAllContacts(0);
        const message = conversation.messages.find(message => message.id === parseInt(event.pathParameters.messageId));
        const data = {
            content: message?.content,
            senderName: contactsData.contacts.find((item) => item.id === message.senderId)?.name,
            senderId: message?.senderId,
            createdAt: message?.createdAt,
            type: message?.type,
        }
        return formatJSONResponse(200, {
            status: "success",
            message: data,
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

export const getMessages = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const page = event.queryStringParameters?.page ? parseInt(event.queryStringParameters.page, 10) : 1;
        const conversation = await messagesService.getMessages(parseInt(event.pathParameters.id),page);
        const contactsData = await contactsService.getAllContacts(0);
        const messages = conversation.messages
        const messagesData = messages.map((message) => {
            const senderName = contactsData.contacts.find((item) => item.id === message.senderId)?.name;
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
            status: "success",
            messages: messagesData,
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return formatJSONResponse(500,
            {
                status: "error",
                message: error,
            }
        );
    }
});

export const createMessage = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (
            typeof event.body.senderId !== "number" ||
            typeof event.body.content !== "string" ||
            typeof event.body.type !== "string"
        ) {
            return formatJSONResponse(403, {
                status: "error",
                message: "senderId should be a number, content and type should be strings.",
            });
        }
        const message = {
            id: Math.floor(Math.random() * 1000000),
            senderId: event.body.senderId,
            content: event.body.content,
            type: event.body.type,
            createdAt: new Date().toISOString()
        };

        await messagesService.createMessage(parseInt(event.pathParameters.id), message);

        if (message && message.type === 'Meeting') {
            try {
                console.log('message.content', message.content);
                const meeting = await messageActionHandler(message.content);
                console.log('meeting', meeting);

                return formatJSONResponse(200, {
                    status: "success",
                    message: meeting,
                });

            } catch (error) {
                console.error("Error occurred:", error);
                return formatJSONResponse(500, {
                    status: "error",
                    message: error
                });
            }
        }
        return formatJSONResponse(200, {
            status: "success",
            message,
        });
    } catch (error) {
        console.error("Error occurred", error);
        return formatJSONResponse(500, {
            status: "error",
            message: error,
        });
    }
});

