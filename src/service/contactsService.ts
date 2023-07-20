import { DocumentClient } from "aws-sdk/clients/dynamodb";

import Contacts from "../model/Contacts";

interface ContactsResponse {
    currentPage: number;
    totalPages: number;
    contacts: Contacts[];
}

export default class contactsService {

    private Tablename: string = process.env.CONTACTS_TABLE;

    constructor(private docClient: DocumentClient) { }

    async getAllContacts(page: number): Promise<ContactsResponse> {
        const contacts = await this.docClient.scan({
            TableName: this.Tablename,
        }).promise();

        const startIndex = (page - 1) * 10;

        const endIndex = page * 10;

        let contactsForPage = contacts.Items as Contacts[]
        if (page !== 0) {
            contactsForPage = contacts.Items.slice(startIndex, endIndex) as Contacts[];
        }
        const totalPages = Math.ceil(contacts.Items.length / 10);

        const data: ContactsResponse = {
            currentPage: page,
            totalPages: totalPages,
            contacts: contactsForPage,
        };

        return data;
    }
}
