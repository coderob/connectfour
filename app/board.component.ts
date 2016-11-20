import { Component, Input } from '@angular/core';
import { Board } from './board';

@Component({
	selector: 'cf-board',
	template: `
		<h2>Board</h2>
		<table>
			<tr *ngFor="let row of board.boardRows" class="row">
				<td *ngFor="let cell of row">
					{{ cell }}
				</td>
			</tr>
		</table>
	`,
})
export class BoardComponent {
	@Input()
	board: Board;
}