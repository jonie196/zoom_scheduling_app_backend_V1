interface GetMessages {
    messages: any;
    id: number;
    content: string;
    senderName: string;
    senderId: number;
    createdAt: string;
    type: string;
}

interface PostMessages {
    senderId: number;
    content: string;
    type: string;
}

export { GetMessages, PostMessages };