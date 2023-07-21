import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { contactsService } from '../../service'

export const getAllContacts = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const page: number = event.queryStringParameters?.page ? parseInt(event.queryStringParameters.page, 10) : 1;

        const contacts = await contactsService.getAllContacts(page);

        return formatJSONResponse(200, {
            status: "success",
            data: contacts,
        });
    } catch (error) {
        console.error("Error occurred while fetching contacts:", error);
        return formatJSONResponse(500, {
            status: "error",
            message: error,
        });
    }
});
