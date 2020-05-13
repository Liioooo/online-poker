export interface Player {
	id: number;
	name: string;
	hasRaised?: boolean;
	budget: number;
	budgetChange?: number
	bet?: number;
	inGame: boolean;
	hand?: string[];
	isPlayerTurn?: boolean;
	isPlayer?: boolean;
	isDealer?: boolean;
}
