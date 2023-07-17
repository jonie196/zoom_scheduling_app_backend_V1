import { handlerPath } from '@libs/handler-resolver';

export const getAllContacts = {
    handler: `${handlerPath(__dirname)}/handler.getAllContacts`,
    events: [
        {
            http: {
                method: 'get',
                path: 'contacts',
                cors: {
                    origin: '*',
                    headers: [
                        'Content-Type',
                        'x-access-token',
                    ],
                }
            },
        },
    ],
};