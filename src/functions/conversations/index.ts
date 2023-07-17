import { handlerPath } from '@libs/handler-resolver';

export const getAllConversations = {
    handler: `${handlerPath(__dirname)}/handler.getAllConversations`,
    events: [
        {
            http: {
                method: 'get',
                path: 'conversations',
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

export const createConversation = {
    handler: `${handlerPath(__dirname)}/handler.createConversation`,
    events: [
        {
            http: {
                method: 'post',
                path: 'conversations',
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