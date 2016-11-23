import { Injectable, Inject }                                    from '@angular/core';
import { Board }                                                 from './board';
import { GameService, Player, Move, MoveResult, AvailableMoves } from './game.service';


@Injectable()
export class AIService {
	constructor (@Inject(GameService) private gameService: GameService) {
	}

	public getNextMove(board: Board, player: Player, opponent: Player): number {
		return this.getBestMove(board, player, opponent);
		// return this.getRandomMove(board);
	}

	private getRandomMove(board: Board): number {
		let openColumns: number[] = this.gameService.getAllOpenColumns(board);
		return ArrayUtilities.getRandomElement(openColumns);
	}

	private getBestMove(board: Board, player: Player, opponent: Player): number {
		let aiMoves: AvailableMoves = this.gameService.getAvailableMoves(board, player);
		let opponentMoves:AvailableMoves = this.gameService.getAvailableMoves(board, opponent);
		let blockingMoves: number[] = opponentMoves.winningMoves;

		// The best moves are (in order): Winning Moves, Blocking Moves, Game Continuing Moves, Game Tying Moves
		let movesetOfChoice: number[] = 
			(aiMoves.winningMoves.length)    ? aiMoves.winningMoves :
			(blockingMoves.length)           ? blockingMoves :
			(aiMoves.continuingMoves.length) ? aiMoves.continuingMoves :
			aiMoves.tyingMoves;
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