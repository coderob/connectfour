import { Component, Input, OnInit }                                              from '@angular/core';
import { Board }                                                                 from './board';
import { GameService, RulesConfiguration, Player, PlayerType, Move, MoveResult } from './game.service';
import { AIService }                                                             from './ai.service';

@Component({
	selector: 'cf-board',
	// TODO : move this to an external component template
	template: `
		<h2 class="jumbotron">
			<div class="players">
				<span *ngFor="let player of [ player1, player2 ]"
					class="player"
					[ngClass]="{ 'active': player == currentMoveBy }"
				>
					{{ player.name }}
				</span>
			</div>
			<div>
				<small [ngSwitch]="lastMoveResult">
					<span *ngSwitchCase="moveResultTypes.GameContinues">Game in Progress</span>
					<span *ngSwitchCase="moveResultTypes.GameWon">{{ currentMoveBy.name }} Wins!</span>
					<span *ngSwitchCase="moveResultTypes.GameTied">Game Over: You Tied!</span>
					<span *ngSwitchCase="moveResultTypes.InvalidMove">Invalid Move</span>
				</small>
			</div>
		</h2>
		<div class="board">
			<div *ngFor="let column of board.columns; let i=index"
				class="column"
				(click)="makeMove(i)"
			>
				<div
					*ngFor="let cell of column.slice().reverse(); let j=index"
					class="cell player-{{cell}} list-group-item"
				></div>
			</div>
		</div>
	`,
	// TODO : move this to a component stylesheet
	styles: [`
		.board {
			width: 70%;
			margin: 2rem auto;
		}
		.board .column {
			display: flex;
			justify: content;
			align-items: center;
			padding: 3rem 0.2rem 1rem;
			border-radius: 3px;
			display:inline-block;
			vertical-align:top;
			cursor: pointer;
		}
		.board .column:hover {
			background: #efefef;
		}
		.board .cell {
			height: 7rem;
			width: 7rem;
			border-radius: 4rem;
		}
		.board .player-1 {
			background: #ff3b3f;
		}
		.board .player-2 {
			background: #333333;
		}
		.players {
			margin-bottom: 1em;
		}
		.player {
			margin: 0.1em;
			padding: 0.3em;
		}
		.player.active {
			background: #dff0d8;
			color: #3c763d;
			border-radius: 5px;
			border-left: 1px solid #fefefe;
			border-top: 1px solid #fefefe;
		}
	`],
	providers: [ GameService, AIService ],
})
export class BoardComponent implements OnInit {
	board: Board;
	moveResultTypes: typeof MoveResult = MoveResult;
	player1: Player;
	player2: Player;
	lastMoveResult: MoveResult;
	_currentMoveBy: Player;

	constructor (private gameService: GameService, private aiService: AIService) {
	}

	get currentMoveBy() {
		return this._currentMoveBy;
	}

	set currentMoveBy(nextPlayerToMove: Player) {
		this._currentMoveBy = nextPlayerToMove;

		if (this.currentMoveBy.type == PlayerType.AI) {
			let nextMoveIndex: number = this.aiService.getNextMove(this.board, nextPlayerToMove);
			this.makeMove(this.aiService.getNextMove(this.board, nextPlayerToMove));
		}
	}

	makeMove (column: number) {
		let move: Move = new Move(column, null, this.currentMoveBy)
		this.lastMoveResult = this.gameService.makeMove(this.board, move);

		if (this.lastMoveResult === MoveResult.GameContinues) {
			this.currentMoveBy = this.getNextPlayerToMove();
		}
	}

	ngOnInit (): void {
		this.board = new Board(RulesConfiguration.NUMBER_OF_ROWS, RulesConfiguration.NUMBER_OF_COLUMNS);
		this.player1 = new Player(1, "Player 1", PlayerType.Human);
		this.player2 = new Player(2, "Player 2", PlayerType.AI);
		this.currentMoveBy = this.player1;
	}

	private getNextPlayerToMove(): Player {
		switch (this.currentMoveBy.id) {
			case this.player1.id:
				return this.player2;
			case this.player2.id:
				return this.player1;
			default:
				throw "Whoa! Something went wrong. We can't determine whose move it is.";
		}
	}
}