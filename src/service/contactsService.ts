import { DocumentClient } from "aws-sdk/clients/dynamodb";

import Contacts from "../model/Contacts";

export default class contactsService {

    private Tablename: string = process.env.CONTACTS_TABLE;

    constructor(private docClient: DocumentClient) { }

    async getAllContacts(): Promise<Contacts[]> {
        const contacts = await this.docClient.scan({
            TableName: this.Tablename,
        }).promise()
        return contacts.Items as Contacts[];
    }
}
