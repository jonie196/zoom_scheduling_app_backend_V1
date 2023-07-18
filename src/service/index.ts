import dynamoDBClient from "../model";
import ContactsService from "./contactsService"
import ConversationsService from "./conversationsService"
import MessagesService from "./messagesService"

export const contactsService = new ContactsService(dynamoDBClient());
export const conversationsService = new ConversationsService(dynamoDBClient());
export const messagesService = new MessagesService(dynamoDBClient());
