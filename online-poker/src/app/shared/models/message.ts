export interface Message {
	event: Event,
	data: object
}

export const enum Event {
	CREATE_GAME,
	JOIN_GAME,
	BET,
	CHECK,
	FOLD,
	SIT_OUT,
	SIT_IN
}

export function validate(object): boolean {
	return object.event && object.data;
}
