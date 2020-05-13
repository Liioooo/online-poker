import {UpdateEventData} from '../models/response/update-event-data';
import {Player} from '../models/player';
import {WinEventData} from '../models/response/win-event-data';

export class Game {

	private _gameId: string;
	private _hasStarted = false;
	private _pot = 0;
	private _tableCards: string[] = [];
	private _currPlayerIndex: number;
	private _dealerIndex: number;
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

	private _performedAction = false;
	private _isWinState = false;

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
		this._dealerIndex = data.dealerIndex;
		this._lastBet = data.lastBet;
		this._smallBlind = data.smallBlindAmount;
		this._bigBlind = data.bigBlindAmount;
		this._performedAction = false;
		this._isPlayerTurn = this._currPlayerIndex === this._playerId && this._hasStarted;

		if (this._hasStarted) {
			this._isWinState = false;
		}

		if (!this._isWinState) {
			this._players = data.players;
		} else {
			for (let i = 0; i < data.players.length; i++) {
				if (!this._players[i]) {
					this._players[i] = data.players[i];
				}
				if (!data.players[i]) {
					this._players[i] = undefined;
				}
			}
		}

		if (this._hasStarted) {
			for (const player of this._players) {
				if (!player)
					continue;

				player.isPlayerTurn = player.id === this._currPlayerIndex;

				if (player.id === this._playerId && player.inGame) {
					player.hand = this._playerHand;
				} else if (player.inGame) {
					player.hand = ['back', 'back'];
				} else {
					player.hand = undefined;
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
			this._canRaise = this._lastBet > 0 && !this._players[this._playerId].hasRaised && this._players[this._playerId].budget > this._lastBet;
			this._canFold = true;
		} else {
			this._canCheck = false;
			this._canCall = false;
			this._canBet = false;
			this._canRaise = false;
			this._canFold = false;
		}

		this._players[this._playerId].isPlayer = true;
		this._players[this._dealerIndex].isDealer = true;
	}

	win(data: WinEventData) {
		this._isWinState = true;
		this._performedAction = false;
		this._hasStarted = false;

		this._isPlayerTurn = false
		this._canCheck = false;
		this._canCall = false;
		this._canBet = false;
		this._canRaise = false;
		this._canFold = false;

		this._pot = data.pot;
		this._tableCards = data.tableCards;

		for (const player of data.players) {
			if (!player)
				continue;

			const winnerIndex = data.winners.findIndex(w => w === player.id);
			if (winnerIndex !== -1) {
				this._players[player.id].budgetChange = data.amounts[winnerIndex];
			}

			if (player.hand) {
				this._players[player.id].hand = player.hand;
			} else if (player.inGame) {
				player.hand = ['back', 'back'];
			} else {
				player.hand = undefined;
			}
			this._players[player.id].bet = 0;
			this._players[player.id].budget = player.budget;
			this._players[player.id].inGame = player.inGame;
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

	get isWinState(): boolean {
		return this._isWinState;
	}

	get performedAction(): boolean {
		return this._performedAction;
	}

	set performedAction(value: boolean) {
		this._performedAction = value;
	}

	get lastBet(): number {
		return this._lastBet;
	}
}
