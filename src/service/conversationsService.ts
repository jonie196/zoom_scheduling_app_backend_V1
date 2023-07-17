import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { GetConversations } from "../model/Conversations";
import { PostConversations } from "../model/Conversations";

export default class conversationsService {

    private Tablename: string = process.env.CONVERSATIONS_TABLE;

    constructor(private docClient: DocumentClient) { }

    async getAllConversations(): Promise<GetConversations[]> {
        const conversations = await this.docClient.scan({
            TableName: this.Tablename,
        }).promise()
        return conversations.Items as GetConversations[];
    }

    async createConversation (conversation: PostConversations): Promise<PostConversations> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: conversation
        }).promise()
        return conversation as PostConversations;
    }


}
