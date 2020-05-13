export interface ChatMessageData {
	message: string;
}

export function parseChatMessageData(object: any): ChatMessageData {
	if (
		typeof object.message === 'string'
	)
		return object as ChatMessageData;
	else
		return null;
}
