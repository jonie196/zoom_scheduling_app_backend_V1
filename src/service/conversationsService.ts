import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { GetConversations } from "../model/Conversations";
import { PostConversations } from "../model/Conversations";

export default class conversationsService {

    private Tablename: string = process.env.CONVERSATIONS_TABLE;

    constructor(private docClient: DocumentClient) { }

    async createConversation (conversation: PostConversations): Promise<PostConversations> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: conversation
        }).promise()
        return conversation as PostConversations;
    }

    async getAllConversations(): Promise<GetConversations[]> {
        const conversations = await this.docClient.scan({
            TableName: this.Tablename,
            // ProjectionExpression: "title, senderName, lastMessage"
        }).promise()
        return conversations.Items as GetConversations[];
    }

    async getConversationById(id: number): Promise<GetConversations> {
        const conversation = await this.docClient.get({
            TableName: this.Tablename,
            Key: {
                id
            }
        }).promise()
        return conversation.Item as GetConversations;
    }
    
}
