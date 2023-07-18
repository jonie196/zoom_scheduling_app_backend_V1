interface GetConversations {
    title: string;
    senderName: string;
    lastMessage: string;
}

interface PostConversations {
    id: number;
    title: string;
    participants: string[];
    messages: string[];
    createdAt: string;
}

export { GetConversations, PostConversations };