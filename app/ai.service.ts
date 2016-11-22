import { Injectable, Inject } from '@angular/core';
import { Board } from './board';
import { GameService } from './game.service';


@Injectable()
export class AIService {
	constructor (@Inject(GameService) private gameService: GameService) {
	}

	public getNextMove(board: Board): number {
		let availableMoves: number[] = this.gameService.getAllOpenColumns(board);
		return this.getRandomMove(board, availableMoves);
	}

	private getRandomMove(board: Board, availableMoves: number[]): number {
		return availableMoves[Math.floor(Math.random() * availableMoves.length)];
	}
}