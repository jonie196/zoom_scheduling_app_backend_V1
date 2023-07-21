import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { GetMessages } from "../model/Messages";
import { PostMessages } from "../model/Messages";

interface MessagesResponse {
    currentPage: number;
    totalPages: number;
    messages: GetMessages[];
}

export default class messagesService {

    private TableName: string = process.env.CONVERSATIONS_TABLE;

    constructor(private docClient: DocumentClient) { }

    async getMessageById(id: number): Promise<GetMessages> {
        const message = await this.docClient.get({
            TableName: this.TableName,
            Key: {
                id
            }
        }).promise()
        return message.Item as GetMessages;
    }

    async getMessages(id: number, page: number): Promise<MessagesResponse> {
        const messages = await this.docClient.get({
            TableName: this.TableName,
            Key: {
                id
            }
        }).promise();

        const startIndex = (page - 1) * 10;

        const endIndex = page * 10;

        let messagesForPage = messages.Item.messages as GetMessages[]
        if (page !== 0) {
            messagesForPage = messages.Item.messages.slice(startIndex, endIndex) as GetMessages[];
        }
        const totalPages = Math.ceil(messages.Item.messages.length / 10);

        const data: MessagesResponse = {
            currentPage: page,
            totalPages: totalPages,
            messages: messagesForPage,
        };
        return data;
    }

    async createMessage(id: number, message: PostMessages): Promise<PostMessages> {
        const updateParams = {
            TableName: this.TableName,
            Key: {
                id
            },
            UpdateExpression: 'SET #attrName = list_append(#attrName, :newMessage)',
            ExpressionAttributeNames: {
                '#attrName': 'messages'
            },
            ExpressionAttributeValues: {
                ':newMessage': [message]
            },
            ReturnValues: 'ALL_NEW'
        };

        await this.docClient.update(updateParams).promise();
        return message as PostMessages;
    }
}