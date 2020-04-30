export interface CreateGameData {
	playerName: string;
	buyIn: number;
	bigBlind: number;
	smallBlind: number;
}

export function parseCreateGameData(object: any): CreateGameData {
	if (
		typeof object.playerName === 'string' &&
		typeof object.buyIn === 'number' &&
		typeof object.bigBlind === 'number' &&
		typeof object.smallBlind === 'number'
	)
		return object as CreateGameData;
	else
		return null;
}
