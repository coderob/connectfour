import { Injectable, Inject }                    from '@angular/core';
import { Board }                                 from './board';
import { GameService, Player, Move, MoveResult } from './game.service';


@Injectable()
export class AIService {
	constructor (@Inject(GameService) private gameService: GameService) {
	}

	public getNextMove(board: Board, player: Player): number {
		let availableMoves: number[] = this.gameService.getAllOpenColumns(board);

		return this.getBestMove(board, availableMoves, player);
		// return this.getRandomMove(board, availableMoves);
	}

	private getRandomMove(board: Board, availableMoves: number[]): number {
		return ArrayUtilities.getRandomElement(availableMoves);
	}

	private getBestMove(board: Board, availableMoves: number[], player: Player): number {
		let winningMoves: number[]    = [];
		let continuingMoves: number[] = [];
		let tyingMoves: number[]      = [];
		
		for (let i:number = 0; i < availableMoves.length; i++) {
			let move: Move = new Move(availableMoves[i], null, player);
			let result: MoveResult = this.gameService.simulateMove(board, move);

			switch (result) {
				case MoveResult.GameWon:
					// You could alternatively short-circuit on any winning move here as well
					winningMoves.push(move.column);
					break;
				case MoveResult.GameContinues:
					continuingMoves.push(move.column);
					break;
				case MoveResult.GameTied:
					tyingMoves.push(move.column);
					break;
				default:
					throw `Unhandled result: ${result}`;
			}
		}

		// The best moves are (in order): Winning Moves, Game Continuing Moves, Game Tying Moves
		let movesetOfChoice: number[] = 
			(winningMoves.length)    ? winningMoves :
			(continuingMoves.length) ? continuingMoves :
			tyingMoves;
		return ArrayUtilities.getRandomElement(movesetOfChoice);
	}
}

export class ArrayUtilities {
	public static getRandomElement<T>(array: T[]): T {
		if (!array || !array.length) {
			return null;
		}

		return array[Math.floor(Math.random() * array.length)]
	}
}