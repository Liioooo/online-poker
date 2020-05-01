export interface Player {
	id: number;
	name: string;
	hasRaised: boolean;
	budget: number;
	bet: number;
	inGame: boolean;
	hand?: string[];
	isPlayerTurn?: boolean;
}
