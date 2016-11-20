import { Component, OnInit } from '@angular/core';
import { Board, Player }     from './board';

@Component({
	selector: 'cf-root',
	template: `
		<div class="page-header">
			<h1>
				{{ title }}
				<small>Get Ready for Awesomeness</small>
			</h1>
		</div>
		<cf-board></cf-board>
	`,
	providers: [],
})
export class RootComponent implements OnInit {
	title = "Connect Four";

	constructor () {
	}

	ngOnInit (): void {
	}
}
