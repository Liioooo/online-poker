import {Player} from '../player';

export interface UpdateEventData {
	hasStarted: boolean;
	id: number;
	hand: string[];
	players: Player[];
	currPlayerIndex: number;
	pot: number;
	lastBet: number;
	tableCards: string[];
}
