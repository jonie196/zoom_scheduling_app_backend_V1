import dynamoDBClient from "../model";
import ContactsService from "./contactsService"
import ConversationsService from "./conversationsService"

export const contactsService = new ContactsService(dynamoDBClient());
export const conversationsService = new ConversationsService(dynamoDBClient());
