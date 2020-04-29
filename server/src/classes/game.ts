import {Player} from './player';
import {Cards, playingCard} from '../models/cards';
import {v4 as Uuidv4} from 'uuid';

export class Game {

	public readonly id = Uuidv4();

	private START_BUDGET = 10000;

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

	constructor(playerCount: number = 8) {
		if (playerCount < 2)
			playerCount = 2;
		this._players = new Array(playerCount > 8 ? 8 : playerCount);
	}

	public join(player: Player): void {
		this._players.push(player);
		player.id = this._players.length - 1;
		this._bets.push(0);
		this._hands.push([]);
		this._hasRaised.push(false);
		this._hasCalled.push(false);
	}

	public leave(player: Player): void {
		this._players = this._players.filter(p => p.id !== player.id);
		this._inRound = this._inRound.filter(p => p.id !== player.id);
		this._bets.slice(player.id, player.id + 1);
		this._hands.slice(player.id, player.id + 1);
		this._hasRaised.slice(player.id, player.id + 1);
		this._hasCalled.slice(player.id, player.id + 1);
		for (const p of this._players) {
			if (p.id > player.id)
				p.id--;
		}
	}

	private newGame(): void {
		this._inRound = [...this._players];
		this._currPlayerIndex = 0;
		this._stack = Cards.newDeck();
		this._tableCards = [];
		this._hands = new Array(this._players.length);
		for (let i = 0; i < this._players.length; i++) {
			this._hands[i] = [];
			for (let i = 0; i < 2; i++)
				this._hands[i].push(this._stack.pop());
		}
		this._bets = new Array(this._players.length);
		for (let i = 0; i < this._bets.length; i++) {
			this._bets[i] = 0;
		}
		this._pot = 0;
		this._roundNum = 0;
		this.newRound();
	}

	private newRound(): void {
		for (let i = 0; i < this._bets.length; i++) {
			this._bets[i] = 0;
			this._hasRaised[i] = false;
			this._hasCalled[i] = false;
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
		if (this._inRound.length === 1) {
			this.win(this._inRound[0]);
		}
		do {
			this._currPlayerIndex = (this._currPlayerIndex + 1) % this._players.length;
		} while (this._inRound.find(p => p.id === this._players[this._currPlayerIndex].id));
		if (this.canStartNextRound()) {
			this.newRound();
		}
		return true;
	}

	private canStartNextRound(): boolean {
		const bet = this._bets[this._inRound[0].id];
		for (const player of this._inRound) {
			if (!this._hasCalled[player.id] || this._bets[player.id] !== bet) {
				return false;
			}
		}
		return true;
	}

	public fold(): boolean {
		this._inRound = this._inRound.filter(p => p.id !== this.currPlayer.id);
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

	// fold (raus), call (mitgehen), check??, raise (neuer Betrag)

	public get currPlayer(): Player {
		return this._players[this._currPlayerIndex];
	}

	private hasAmount(amount: number): boolean {
		return this.currPlayer.budget >= amount;
	}

	private bet(amount: number): boolean {
		if (this.hasAmount(amount)) {
			this._bets[this._currPlayerIndex] += amount;
			this.currPlayer.budget -= amount;
			return true;
		}
		return false;
	}

	private win(player: Player): void {
		player.budget += this._pot;
		this._pot = 0;
		console.log(player.name + ' wins');
	}

	public dataToSend(player: Player): object {
		return {
			players: this._players,
			currPlayerIndex: this._currPlayerIndex,
			inRound: this._inRound,
			bets: this._bets,
			pot: this._pot,
			lastBet: this._lastBet,
			tableCards: this._tableCards,
			hand: this._hands[player.id]
		};
	}
}
