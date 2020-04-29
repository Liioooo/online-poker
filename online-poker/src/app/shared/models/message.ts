import {Event} from './event';

export interface Message {
	event: Event,
	data: object
}

export interface ErrorMessage {
	error: string
}

export function parseMessage(object: any): Message {
	if (
		typeof object.event === 'number' &&
		typeof object.data === 'object'
	)
		return object as Message;
	else
		return null;
}
