import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Board } from './board';

@Component({
	selector: 'cf-root',
	template: `
		<div class="page-header">
			<h1>
				{{ title }}
				<small>Get Ready for Awesomeness</small>
			</h1>
		</div>
		<cf-board [board]="board"></cf-board>
	`,
	providers: [],
})
export class RootComponent implements OnInit {
	title = "Connect Four";
	board = new Board(5, 5);

	constructor () {
	}

	ngOnInit (): void {
	}
}
