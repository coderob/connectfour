import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
	selector: 'cf-root',
	template: `
		<div class="page-header">
			<h1>
				{{ title }}
				<small>Get Ready for Awesomeness</small>
			</h1>
		</div>
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
