import { Component, Input } from '@angular/core';
import { Board } from './board';

@Component({
	selector: 'cf-board',
	template: `
		<h2>Board</h2>
		<div class="board list-group">
			<div *ngFor="let row of board.rows; let i=index" class="row">
				<button
					*ngFor="let cell of row; let j=index"
					class="cell player-{{cell}} list-group-item"
					(click)="makeMove(i, j)"
				>
					<small>r:{{i}},c:{{j}}</small>
				</button>
			</div>
		</div>
	`,
	styles: [`
		.board {
			width: 70%;
			margin: 2rem auto;
		}
		.board .row {
			display: flex;
			justify: content;
			align-items: center;
		}
		.board .row .cell {
			height: 7rem;
			width: 7rem;
			border-radius: 4rem;
		}
		.board .player-1 {
			background: #ff3b3f;
		}
		.board .player-2 {
			background: #514a79;
		}
	`]
})
export class BoardComponent {
	@Input()
	board: Board;

	makeMove (row: number, column: number) {
		this.board.makeMove(row, column, 77);
	}
}