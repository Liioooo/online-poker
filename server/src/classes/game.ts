import {Player} from './player';
import {Cards, playingCard} from '../models/cards';
import {v4 as Uuidv4} from 'uuid';
import {WinDetection} from './win-detection';

export class Game {

	public readonly id = Uuidv4();

	private START_BUDGET = 10000;
	private _playerLimit = 8;

	private _players: Player[];
	private _currPlayerIndex: number;

	private _pot: number;
	private _lastBet: number;

	private _stack: playingCard[];
	private _tableCards: playingCard[];
	private _roundNum: number;

	constructor(playerCount?: number) {
		if (playerCount)
			this._playerLimit = playerCount;
		this._players = [];
	}

	public join(player: Player): boolean {
		const playerCount = this._players.filter(p => p !== null).length;
		if (playerCount >= this._playerLimit)
			return false;
		if (playerCount === this._players.length) {
			this._players.push(player);
		}
		for (let i = 0; i < this._players.length; i++) {
			if (!this._players[i]) {
				this._players[i] = player;
				player.id = i;
				break;
			}
		}

		this.pushState();
		return true;
	}

	public leave(player: Player): void {
		this._players[player.id] = null;
		this.pushState();
	}

	private newGame(): void {
		this._players.forEach(p => p.inGame = true);
		this._currPlayerIndex = 0;
		this._stack = Cards.newDeck();
		this._tableCards = [];
		for (let player of this._players) {
			if (player) {
				player.bet = 0;
				player.hand = this._stack.splice(0, 2);
			}
		}
		this._pot = 0;
		this._roundNum = 0;
		this.newRound();
	}

	private newRound(): void {
		for (let player of this._players) {
			if (player) {
				this._pot += player.bet;
				player.bet = 0;
				player.hasRaised = false;
				player.hasCalled = false;
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
		const hands = [];
		for (const player of this.inRoundPlayers())
			hands.push(player.hand);

		WinDetection.getWinners(this._tableCards, hands);
		// this.win(this._inRound[Math.floor(Math.random() * this._inRound.length)]);
	}

	private endTurn(): boolean {
		this.currPlayer.hasCalled = true;
		if (this.inRoundPlayers().length === 1) {
			this.win(this.inRoundPlayers()[0]);
		}
		do {
			this._currPlayerIndex = (this._currPlayerIndex + 1) % this._players.length;
		} while (this._players[this._currPlayerIndex].inGame);
		if (this.canStartNextRound()) {
			this.newRound();
		}
		this.pushState();
		return true;
	}

	private canStartNextRound(): boolean {
		const bet = this.inRoundPlayers()[0].bet;
		for (const player of this.inRoundPlayers()) {
			if (!player.hasCalled || player.bet !== bet) {
				return false;
			}
		}
		return true;
	}

	public fold(): boolean {
		this.currPlayer.inGame = false;
		return this.endTurn();
	}

	public call(): boolean {
		if (!this.bet(this._lastBet - this.currPlayer.bet)) {
			return false;
		}
		return this.endTurn();
	}

	public check(): boolean {
		if (this._lastBet !== this.currPlayer.bet)
			return false;
		return this.endTurn();
	}

	public raise(bet: number): boolean {
		if (!this.bet(bet - this.currPlayer.bet)
			|| this.currPlayer.hasRaised) {
			return false;
		}
		this._lastBet = bet;
		this.currPlayer.hasRaised = true;
		return this.endTurn();
	}

	private bet(amount: number): boolean {
		if (this.hasAmount(amount)) {
			this.currPlayer.bet += amount;
			this.currPlayer.budget -= amount;
			return true;
		}
		return false;
	}


	public get currPlayer(): Player {
		return this._players[this._currPlayerIndex];
	}

	private inRoundPlayers(): Player[] {
		return this._players.filter(p => p !== null && p.inGame);
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
				hand: player.hand,
				players: this._players.map(p => {
					return p ? {
						id: p.id,
						name: p.name,
						budget: p.budget,
						bet: p.bet,
						inGame: p.inGame,
						hasRaised: p.hasRaised
					} : null;
				}),
				currPlayerIndex: this._currPlayerIndex,
				pot: this._pot,
				lastBet: this._lastBet,
				tableCards: this._tableCards
			});
		});
	}
}
