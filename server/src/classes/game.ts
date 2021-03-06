import {Player} from './player';
import {Cards, playingCard} from '../models/cards';
import {v4 as Uuidv4} from 'uuid';
import {WinDetection} from './win-detection';
import {Event} from '../models/event';
import {Subject} from 'rxjs';

export class Game {

	public readonly id = Uuidv4();

	private _buyIn: number;
	private _playerLimit = 8;

	private _hasStarted = false;

	private _players: Player[];
	private _currPlayerIndex: number;
	private _smallBlindIndex: number = -1;

	private _pot: number;
	private _lastBet: number;

	private _smallBlindAmount: number;
	private _bigBlindAmount: number;

	private _stack: playingCard[];
	private _tableCards: playingCard[];
	private _roundNum: number;

	public deleteSubject: Subject<void>;

	constructor(smallBlindAmount: number, bigBlindAmount: number, buyIn: number, playerCount?: number) {
		this._smallBlindAmount = smallBlindAmount;
		this._bigBlindAmount = bigBlindAmount;
		this._buyIn = buyIn;
		if (playerCount)
			this._playerLimit = playerCount;
		this._players = [];
		this.deleteSubject = new Subject<void>();
	}

	public join(player: Player): boolean {
		player.budget = this._buyIn;
		const playerCount = this._players.filter(p => p !== null).length;
		if (playerCount >= this._playerLimit)
			return false;
		if (playerCount === this._players.length) {
			this._players.push(null);
		}
		for (let i = 0; i < this._players.length; i++) {
			if (!this._players[i]) {
				this._players[i] = player;
				player.id = i;
				break;
			}
		}
		console.log(`${player.name} joined the game ${this.id}`);
		this.pushUpdateState();
		this.pushChatMessage('Server', `"${player.name}" joined the game`);
		return true;
	}

	public leave(player: Player): void {
		if (this._hasStarted) {
			player.inGame = false;
			if (this._currPlayerIndex === player.id) {
				this.endTurn();
			}
			if (this._smallBlindIndex === player.id) {
				this._smallBlindIndex = this.bigBlindIndex;
			}
			this.checkOnePlayer();
		}
		this._players[player.id] = null;
		console.log(`${player.name} left the game ${this.id}`);
		let deleteGame = true;
		for (const player of this._players) {
			if (player) {
				deleteGame = false;
				break;
			}
		}
		if (deleteGame)
			this.deleteGame();
		this.pushUpdateState();
		this.pushChatMessage('Server', `"${player.name}" left the game`);
	}

	private deleteGame() {
		console.log(`Deleted game ${this.id}`);
		this.deleteSubject.next();
	}

	public newGame(): void {
		const players = this._players.filter(p => p);
		if (players.length <= 1) {
			this._hasStarted = false;
			return;
		}
		players.forEach(p => { p.inGame = true });
		if (this._smallBlindIndex < 0) {
			do {
				this._smallBlindIndex = Math.floor(Math.random() * this._players.length);
			} while (!this._players[this._smallBlindIndex]);
		}
		this._hasStarted = true;
		this._smallBlindIndex = this.bigBlindIndex;
		this._currPlayerIndex = this._smallBlindIndex;
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
		this.pushChatMessage('Server', 'Starting new game');
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
				this.raise(this._smallBlindAmount, true);
				this.raise(this._bigBlindAmount);
				this.pushUpdateState();
				break;
			case 1:
				for (let i = 0; i < 3; i++)
					this._tableCards.push(this._stack.pop());
				this.pushUpdateState();
				break;
			case 2:
			case 3:
				this._tableCards.push(this._stack.pop());
				this.pushUpdateState();
				break;
			default:
				this.checkWin();
				setTimeout(() => this.newGame(), 3000);
		}
	}

	private endTurn(isSmallBlind?: boolean): boolean {
		if (!isSmallBlind)
			this.currPlayer.hasCalled = true;
		if (this.checkOnePlayer())
			return true;
		do {
			this._currPlayerIndex = (this._currPlayerIndex + 1) % this._players.length;
		} while (!(this._players[this._currPlayerIndex] && this._players[this._currPlayerIndex].inGame));
		this.pushUpdateState();
		if (this.canStartNextRound())
			this.newRound();
		return true;
	}

	private checkOnePlayer(): boolean {
		if (this.inGamePlayers().length === 1) {
			for (let player of this._players) {
				if (player) {
					this._pot += player.bet;
					player.bet = 0;
				}
			}
			this.win([this.inGamePlayers()[0]], [this._pot]);
			setTimeout(() => this.newGame(), 3000);
			return true;
		}
		return false;
	}

	private canStartNextRound(): boolean {
		const bet = this.inGamePlayers()[0].bet;
		for (const player of this.inGamePlayers()) {
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

	public raise(bet: number, isSmallBlind?: boolean): boolean {
		if (this.currPlayer.hasRaised || this.currPlayer.bet + bet < this._lastBet || !this.bet(bet)) {
			return false;
		}
		this._lastBet = this.currPlayer.bet;
		if (!isSmallBlind)
			this.currPlayer.hasRaised = true;
		return this.endTurn(isSmallBlind);
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

	public get smallBlind(): Player {
		return this._players[this._smallBlindIndex];
	}

	public get bigBlind(): Player {
		return this._players[this.bigBlindIndex];
	}

	private get bigBlindIndex(): number {
		let bb = this._smallBlindIndex + 1;
		while (!this._players[bb]) {
			bb = (bb + 1) % this._players.length;
		}
		return bb;
	}

	private get dealerIndex(): number {
		let bb = this._smallBlindAmount;
		do {
			bb--;
			if (bb < 0)
				bb = this._players.length - 1;
		}
		while (!this._players[bb]);
		return bb;
	}

	private inGamePlayers(): Player[] {
		return this._players.filter(p => p !== null && p.inGame);
	}

	private hasAmount(amount: number): boolean {
		return this.currPlayer.budget >= amount;
	}

	private checkWin(): void {
		const winners = WinDetection.getWinners(this._tableCards, this.inGamePlayers());
		let left = winners.length;
		// for (let winner of winners) {
		// 	this.win(winners, Math.floor(this._pot / left--));
		// }
		this.win(winners, winners.map(_ => this._pot / left--));
		console.log('winners: ', winners.map(p => p.name));
	}

	private win(winners: Player[], amounts: number[]): void {
		for (let i = 0; i < winners.length; i++) {
			winners[i].budget += amounts[i];
			this._pot -= amounts[i];
			console.log(winners[i].name + ' wins ' + amounts[i]);
		}
		this.pushWinState(winners.map(p => p.id), amounts);
		// this._hasStarted = false;
	}

	public pushChatMessage(sender: string, message: string) {
		const time = Date.now();
		this._players.forEach(player => {
			if (!player)
				return;
			player.sendState({
				time,
				sender,
				message
			}, Event.CHAT_MESSAGE);
		});
	}

	private pushWinState(winners: number[], amounts: number[]) {
		this._players.forEach(player => {
			if (!player)
				return;
			player.sendState({
				id: player.id,
				players: this._players.map(p => {
					return p ? {
						id: p.id,
						name: p.name,
						budget: p.budget,
						inGame: p.inGame,
						hand: p.inGame ? p.hand : null
					} : null;
				}),
				pot: this._pot,
				tableCards: this._tableCards,
				winners,
				amounts
			}, Event.WIN);
		})
	}

	private pushUpdateState() {
		this._players.forEach(player => {
			if (!player)
				return;
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
				dealerIndex: this.dealerIndex,
				pot: this._pot,
				lastBet: this._lastBet,
				tableCards: this._tableCards,
				hasStarted: this._hasStarted,
				smallBlindAmount: this._smallBlindAmount,
				bigBlindAmount: this._bigBlindAmount
			}, Event.UPDATE);
		});
	}
}
