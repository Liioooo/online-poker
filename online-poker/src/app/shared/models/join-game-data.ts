export interface JoinGameData {
	playerName: string;
	gameId: string;
}

export function validate(object): boolean {
	return typeof object.playerName === 'string' && typeof object.gameId === 'string';
}
