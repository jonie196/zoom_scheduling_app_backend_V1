import { handlerPath } from '@libs/handler-resolver';

export const getMessageById = {
    handler: `${handlerPath(__dirname)}/handler.getMessageById`,
    events: [
        {
            http: {
                method: 'get',
                path: 'conversations/{id}/messages/{messageId}',
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

export const getMessages = {
    handler: `${handlerPath(__dirname)}/handler.getMessages`,
    events: [
        {
            http: {
                method: 'get',
                path: 'conversations/{id}/messages',
                cors: {
                    origin: '*',
                    headers: [
                        'Content-Type',
                        'x-access-token',
                    ],
                },
                request: {
                    parameters: {
                        querystrings: {
                            page: true,
                        },
                    },
                },
            },
        },
    ],
};

export const createMessage = {
    handler: `${handlerPath(__dirname)}/handler.createMessage`,
    events: [
        {
            http: {
                method: 'post',
                path: 'conversations/{id}/messages',
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