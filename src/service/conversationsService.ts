import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { GetConversations } from "../model/Conversations";
import { PostConversations } from "../model/Conversations";

interface ConversationsResponse {
    currentPage: number;
    totalPages: number;
    conversations: GetConversations[];
}

export default class conversationsService {

    private Tablename: string = process.env.CONVERSATIONS_TABLE;

    constructor(private docClient: DocumentClient) { }

    async createConversation(conversation: PostConversations): Promise<PostConversations> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: conversation
        }).promise()
        return conversation as PostConversations;
    }

    async getAllConversations(page: number): Promise<ConversationsResponse> {
        const conversations = await this.docClient.scan({
            TableName: this.Tablename,
        }).promise();

        const startIndex = (page - 1) * 10;

        const endIndex = page * 10;

        let conversationsForPage = conversations.Items as GetConversations[]
        if (page !== 0) {
            conversationsForPage = conversations.Items.slice(startIndex, endIndex) as GetConversations[];
        }

        const totalPages = Math.ceil(conversations.Items.length / 10);

        const data: ConversationsResponse = {
            currentPage: page,
            totalPages: totalPages,
            conversations: conversationsForPage,
        };

        return data;
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
