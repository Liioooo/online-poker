import {Player} from '../player';

export interface WinEventData {
	id: number;
	pot: number;
	players: Player[];
	tableCards: string[];
	winners: number[];
	amounts: number;
}
