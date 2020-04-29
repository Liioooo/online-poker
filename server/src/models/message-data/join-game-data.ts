export interface JoinGameData {
	playerName: string;
	gameId: string;
}

export function parseJoinGameData(object: any): JoinGameData {
	if (
		typeof object.playerName === 'string' &&
		typeof object.gameId === 'string'
	)
		return object as JoinGameData;
	else
		return null;
}
