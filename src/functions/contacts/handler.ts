import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { contactsService } from '../../service'

export const getAllContacts = middyfy(async (): Promise<APIGatewayProxyResult> => {
    try {
        const contacts = await contactsService.getAllContacts();
        return formatJSONResponse(200, {
            contacts,
        });
    } catch (error) {
        console.error("Error occurred while fetching contacts:", error);
        return formatJSONResponse(500,
            {
                message: error,
            }
        );
    }
});