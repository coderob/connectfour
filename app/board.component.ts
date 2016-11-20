import { Component, Input, OnInit }  from '@angular/core';
import { Board, Player, MoveResult } from './board';

@Component({
	selector: 'cf-board',
	template: `
		<h2>
			Board
			<small [ngSwitch]="lastMoveResult">
				<span *ngSwitchCase="moveResultTypes.GameContinues">Game in Progress</span>
				<span *ngSwitchCase="moveResultTypes.GameWon">{{ currentMoveBy.name }} Wins!</span>
				<span *ngSwitchCase="moveResultTypes.GameTied">Game Over: You Tied!</span>
				<span *ngSwitchCase="moveResultTypes.InvalidMove">Invalid Move</span>
			</small>
		</h2>
		<div class="board">
			<div *ngFor="let column of board.columns; let i=index"
				class="column"
				(click)="makeMove(i)"
			>
				<div
					*ngFor="let cell of column.slice().reverse(); let j=index"
					class="cell player-{{cell}} list-group-item"
				>
					<small>c:{{i}},r:{{4 - j}}</small>
				</div>
			</div>
		</div>
	`,
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
	`]
})
export class BoardComponent implements OnInit {
	board: Board;
	moveResultTypes: typeof MoveResult = MoveResult;
	player1: Player;
	player2: Player;
	currentMoveBy: Player;
	lastMoveResult: MoveResult;

	makeMove (column: number) {
		this.lastMoveResult = this.board.makeMove(column, this.currentMoveBy);

		if (this.lastMoveResult === MoveResult.GameContinues) {
			this.currentMoveBy = this.getNextPlayerToMove();
		}
	}

	ngOnInit (): void {
		this.board = new Board(5, 5);
		this.player1 = new Player(1, "Player 1");
		this.player2 = new Player(2, "Player 2");
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