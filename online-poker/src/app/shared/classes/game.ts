import {UpdateEventData} from '../models/response/update-event-data';
import {Player} from '../models/player';

export class Game {

	private _gameId: string;
	private _hasStarted = false;
	private _pot = 0;
	private _tableCards: string[] = [];
	private _currPlayerIndex: number;
	private _players: Player[] = [];
	private _lastBet: number;
	private _smallBlind: number;
	private _bigBlind: number;

	private _playerHand: string[];
	private _playerId: number;

	private _isPlayerTurn = false;
	private _canCheck = false;
	private _canCall = false;
	private _toCall = 0;
	private _canBet = false;
	private _canRaise = false;
	private _canFold = false;

	constructor(gameId: string) {
		this._gameId = gameId;
	}

	public updateState(data: UpdateEventData) {
		this._hasStarted = data.hasStarted;
		this._playerHand = data.hand;
		this._playerId = data.id;
		this._pot = data.pot ?? 0;
		this._tableCards = data.tableCards ?? [];
		this._currPlayerIndex = data.currPlayerIndex;
		this._players = data.players;
		this._lastBet = data.lastBet;
		this._smallBlind = data.smallBlindAmount;
		this._bigBlind = data.bigBlindAmount;

		this._isPlayerTurn = this._currPlayerIndex === this._playerId && this._hasStarted;

		if (this._hasStarted) {
			for (const player of this._players) {
				if (player.id === this._playerId) {
					player.hand = this._playerHand;
				} else {
					player.hand = ['back', 'back'];
				}
			}
		}

		if (this._isPlayerTurn) {
			this._canCheck = this._lastBet === 0;
			this._canCall = this._lastBet > this._players[this._playerId].bet && this._players[this._playerId].budget > 0;
			if (this._players[this._playerId].budget > this._lastBet - this._players[this._playerId].bet) {
				this._toCall = this._lastBet - this._players[this._playerId].bet;
			} else {
				this._toCall = this._players[this._playerId].budget
			}
			this._canBet = this._lastBet === 0 && !this._players[this._playerId].hasRaised && this._players[this._playerId].budget > 0;
			this._canRaise = this._lastBet > 0 && !this._players[this._playerId].hasRaised && this._players[this._playerId].budget > 0;
			this._canFold = true;
		} else {
			this._canCheck = false;
			this._canCall = false
			this._canBet = false
			this._canRaise = false
			this._canFold = false
		}
	}

	get gameId(): string {
		return this._gameId;
	}

	get pot(): number {
		return this._pot;
	}

	get tableCards(): string[] {
		return this._tableCards;
	}

	get currPlayerIndex(): number {
		return this._currPlayerIndex;
	}

	get players(): Player[] {
		return this._players;
	}

	get playerHand(): string[] {
		return this._playerHand;
	}

	get isPlayerTurn(): boolean {
		return this._isPlayerTurn;
	}

	get canCheck(): boolean {
		return this._canCheck;
	}

	get canCall(): boolean {
		return this._canCall;
	}

	get toCall(): number {
		return this._toCall;
	}

	get canBet(): boolean {
		return this._canBet;
	}

	get canRaise(): boolean {
		return this._canRaise;
	}

	get canFold(): boolean {
		return this._canFold;
	}

	get playerBudget(): number {
		return this._players[this._playerId].budget;
	}

	get smallBlind(): number {
		return this._smallBlind;
	}

	get bigBlind(): number {
		return this._bigBlind;
	}

	get hasStarted(): boolean {
		return this._hasStarted;
	}
}
