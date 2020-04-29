export interface CreateGameData {
	playerName: string;
	stackSize: number;
	bigBlind: number;
	smallBlind: number;
}

export function parseCreateGameData(object: any): CreateGameData {
	if (
		typeof object.playerName === 'string' &&
		typeof object.stackSize === 'number' &&
		typeof object.bigBlind === 'number' &&
		typeof object.smallBlind === 'number'
	)
		return object as CreateGameData;
	else
		return null;
}
