import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { RootComponent } from './root.component';
import { BoardComponent } from './board.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule
	],
	declarations: [
		RootComponent,
		BoardComponent
	],
	bootstrap: [
		RootComponent
	]
})
export class RootModule { }

