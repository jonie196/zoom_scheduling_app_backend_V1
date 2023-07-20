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

    // async createMessage(id: number, message: PostMessages): Promise<PostMessages> {
    //     await this.docClient.put({
    //         TableName: this.TableName,
    //         Item: message
    //     }).promise()
    //     return message as PostMessages;
    // }

    // async createMessage(id: number, message: PostMessages): Promise<PostMessages> {
    //     const conversation = await this.getMessageById(id);
    //     conversation.messages.push(message);
    //     await this.docClient.put({
    //         TableName: this.TableName,
    //         Item: conversation
    //     }).promise()
    //     return message as PostMessages;
    // }

    async createMessage(id: number, message: PostMessages): Promise<PostMessages> {
        const updateParams = {
            TableName: this.TableName,
            Key: {
                id
            },
            UpdateExpression: 'SET #attrName = list_append(#attrName, :newMessage)',
            ExpressionAttributeNames: {
                '#attrName': 'messages' // Replace 'messages' with the actual array attribute name in your table
            },
            ExpressionAttributeValues: {
                ':newMessage': [message] // Wrap the new message in an array to append it to the existing messages array
            },
            ReturnValues: 'ALL_NEW'
        };

        await this.docClient.update(updateParams).promise();
        return message as PostMessages;
    }


}