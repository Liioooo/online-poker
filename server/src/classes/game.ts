import {Player} from './player';
import {Cards, playingCard} from '../models/cards';
import {v4 as Uuidv4} from 'uuid';

export class Game {

	public readonly id = Uuidv4();

	private START_BUDGET = 10000;
	private _playerLimit = 8;

	private _players: Player[];
	private _currPlayerIndex: number;
	private _inRound: Player[];
	private _hasRaised: boolean[];
	private _hasCalled: boolean[];

	private _bets: number[];
	private _pot: number;
	private _lastBet: number;

	private _stack: playingCard[];
	private _tableCards: playingCard[];
	private _roundNum: number;
	private _hands: playingCard[][];

	constructor(playerCount?: number) {
		if (playerCount)
			this._playerLimit = playerCount;
		this._players = [];

		this._bets = [];
		this._hands = [];
		this._hasRaised = [];
		this._hasCalled = [];
		this._inRound = [];
	}

	public join(player: Player): boolean {
		const playerCount = this._players.filter(p => p !== null).length;
		if (playerCount >= this._playerLimit)
			return false;
		if (playerCount === this._players.length) {
			this._players.push(null);
			this._bets.push(null);
			this._hands.push(null);
			this._hasRaised.push(null);
			this._hasCalled.push(null);
			this._inRound.push(null);
		}
		for (let i = 0; i < this._players.length; i++) {
			if (!this._players[i]) {
				this._players[i] = player;
				player.id = i;
				break;
			}
		}
		this._bets[player.id] = 0;
		this._hands[player.id] = [];
		this._hasRaised[player.id] = false;
		this._hasCalled[player.id] = false;

		this.pushState();
		return true;
	}

	public leave(player: Player): void {
		this._players[player.id] = null;
		this._inRound[player.id] = null;
		this._bets[player.id] = null;
		this._hands[player.id] = null;
		this._hasRaised[player.id] = null;
		this._hasCalled[player.id] = null;
		this.pushState();
	}

	private newGame(): void {
		this._inRound = [...this._players];
		this._currPlayerIndex = 0;
		this._stack = Cards.newDeck();
		this._tableCards = [];
		for (let i = 0; i < this._players.length; i++) {
			if (this._players[i]) {
				this._hands[i] = this._stack.splice(0, 2);
				this._bets[i] = 0;
			}
		}
		this._pot = 0;
		this._roundNum = 0;
		this.newRound();
	}

	private newRound(): void {
		for (let i = 0; i < this._players.length; i++) {
			if (this._players[i]) {
				this._bets[i] = 0;
				this._hasRaised[i] = false;
				this._hasCalled[i] = false;
			}
		}
		this._lastBet = 0;
		switch (this._roundNum++) {
			case 0:
				break;
			case 1:
				for (let i = 0; i < 3; i++)
					this._tableCards.push(this._stack.pop());
				break;
			case 2:
			case 3:
				this._tableCards.push(this._stack.pop());
				break;
			default:
				this.checkWin();
				this.newGame();
		}
	}

	private checkWin(): void {
		this.win(this._inRound[Math.floor(Math.random() * this._inRound.length)]);
	}

	private endTurn(): boolean {
		if (this.inRoundPlayers().length === 1) {
			this.win(this.inRoundPlayers()[0]);
		}
		do {
			this._currPlayerIndex = (this._currPlayerIndex + 1) % this._players.length;
		} while (this._inRound.find(p => p.id === this._players[this._currPlayerIndex].id));
		if (this.canStartNextRound()) {
			this.newRound();
		}
		this.pushState();
		return true;
	}

	private canStartNextRound(): boolean {
		const bet = this._bets[this.inRoundPlayers()[0].id];
		for (const player of this.inRoundPlayers()) {
			if (!this._hasCalled[player.id] || this._bets[player.id] !== bet) {
				return false;
			}
		}
		return true;
	}

	public fold(): boolean {
		this._inRound[this.currPlayer.id] = null;
		return this.endTurn();
	}

	public call(): boolean {
		if (!this.bet(this._lastBet - this._bets[this._currPlayerIndex])) {
			return false;
		}
		return this.endTurn();
	}

	public check(): boolean {
		if (this._lastBet !== this._bets[this._currPlayerIndex])
			return false;
		return this.endTurn();
	}

	public raise(bet: number): boolean {
		if (!this.bet(bet - this._bets[this._currPlayerIndex])
			|| this._hasRaised[this._currPlayerIndex]) {
			return false;
		}
		this._lastBet = bet;
		this._hasRaised[this._currPlayerIndex] = true;
		return this.endTurn();
	}

	private bet(amount: number): boolean {
		if (this.hasAmount(amount)) {
			this._bets[this._currPlayerIndex] += amount;
			this.currPlayer.budget -= amount;
			return true;
		}
		return false;
	}


	public get currPlayer(): Player {
		return this._players[this._currPlayerIndex];
	}

	private inRoundPlayers(): Player[] {
		return this._inRound.filter(p => p !== null);
	}

	private hasAmount(amount: number): boolean {
		return this.currPlayer.budget >= amount;
	}

	private win(player: Player): void {
		player.budget += this._pot;
		this._pot = 0;
		console.log(player.name + ' wins');
	}

	private pushState() {
		this._players.forEach((player) => {
			player.sendState({
				id: player.id,
				players: this._players.map(p => {
					return {
						id: p.id,
						name: p.name,
						budget: p.budget
					};
				}),
				currPlayerIndex: this._currPlayerIndex,
				inRound: this._inRound.map(p => p !== null),
				bets: this._bets,
				pot: this._pot,
				lastBet: this._lastBet,
				tableCards: this._tableCards,
				hand: this._hands[player.id]
			});
		});
	}
}
