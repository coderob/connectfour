import { Injectable } from '@angular/core';
import { Board } from './board';

export class Player {
	id: number;
	name: string;
	type: PlayerType

	constructor (id: number, name: string, type: PlayerType) {
		this.id = id;
		this.name = name;
		this.type = type;
	}
}

export enum PlayerType {
	Human,
	AI // Beware of Skynet
}

export class Move {
	column: number;
	row: number;
	player: Player;

	constructor (column: number, row: number, player: Player) {
		this.column = column;
		this.row = row;
		this.player = player;
	}
}

export enum MoveResult {
	InvalidMove,
	GameWon,
	GameTied,
	GameContinues
}

export const CONSECUTIVE_SLOTS_FOR_WIN = 4;

@Injectable()
export class GameService {
	private moveCount: number = 0;

	public makeMove (board: Board, move: Move): MoveResult {
		if (this.isColumnFull(board, move.column)) {
			//  this may be unexpected, TODO: probably worth preventing clicks when the game is over/board is full
			console.debug(`Whoa! Column # ${move.column} is full`);
			return MoveResult.InvalidMove;
		}

		move.row = this.getLastOpenRow(board, move.column);
		board.columns[move.column][move.row] = move.player.id;
		this.moveCount++;

		if (this.isWin(board, move)) {
			return MoveResult.GameWon;
		}
		if (this.isBoardFull(board)) {
			return MoveResult.GameTied;
		}

		return MoveResult.GameContinues;
	}
	
	public simulateMove (board: Board, move: Move): MoveResult {
		let row: number = this.getLastOpenRow(board, move.column);
		let result = this.makeMove(board, move);
		this.moveCount--; // this is kinda ugly and coupled; refactor this

		if (result != MoveResult.InvalidMove) {
			board.columns[move.column][row] = null;
		}

		return result;
	}

	public isWin (board: Board, move: Move): boolean {
		return this.isHorizontalWin(board, move) ||
			this.isVerticalWin(board, move) ||
			this.isForwardDiagonalWin(board, move) ||
			this.isBackwardsDiagonalWin(board, move);
	}

	private isHorizontalWin (board: Board, move: Move) {
		let retVal: boolean = false;
		let consecutiveHorizontalSlots = 0;
		for (let i:number = 0; i < board.numberOfColumns; i++) {
			if (board.columns[i][move.row] === move.player.id) {
				consecutiveHorizontalSlots++;
				if (consecutiveHorizontalSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
					retVal = true;
					break;
				}
			}
			else {
				consecutiveHorizontalSlots = 0;
			}
		}
		return retVal;
	}

	private isVerticalWin (board: Board, move: Move) {
		let retVal: boolean = false;
		let consecutiveVerticalSlots = 0;
		for (let i:number = 0; i < board.numberOfRows; i++) {
			if (board.columns[move.column][i] === move.player.id) {
				consecutiveVerticalSlots++;

				if (consecutiveVerticalSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
					retVal = true;
					break;
				}
			}
			else {
				consecutiveVerticalSlots = 0;
			}
		}
		return retVal;
	}

	private isForwardDiagonalWin (board: Board, move: Move) {
		let retVal: boolean = false;
		let rowOrigin: number    = (move.row - move.column > 0) ? move.row - move.column : 0;
		let columnOrigin: number = (move.column - move.row > 0) ? move.column - move.row : 0;
		let maxDiagonalSize: number = Math.max(move.column, move.row);
		let consecutiveDiagonalSlots = 0;
		for (let i:number = 0; i < maxDiagonalSize; i++) {
			let onBoard: boolean = 
				(columnOrigin + i) < board.numberOfColumns &&
				(rowOrigin    + i) < board.numberOfRows;

			let currentSlot: number = (onBoard) ? board.columns[columnOrigin + i][rowOrigin + i] : null;
			let match: boolean = currentSlot === move.player.id;

			if (match) {
				consecutiveDiagonalSlots++;
				if (consecutiveDiagonalSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
					retVal = true;
					break;
				}
			}
		}
		return retVal;
	}

	private isBackwardsDiagonalWin (board: Board, move: Move) {
		let hasConnection: boolean = true;
		let consecutiveDiagonalSlots2 = 1;
		let offset: number = 1;
		// go down and right from the origin
		while (hasConnection) {
			let newRow    = move.row - offset;
			let newColumn = move.column + offset;

			let onBoard: boolean = newRow >= 0 && newColumn < board.numberOfColumns;
			let lowerRightSlot: number = (onBoard) ? board.columns[newColumn][newRow] : null;
			let match: boolean = (lowerRightSlot === move.player.id);
			offset++;

			if (match) {
				consecutiveDiagonalSlots2++;

				if (consecutiveDiagonalSlots2 === CONSECUTIVE_SLOTS_FOR_WIN) {
					return true;
				}
			}
			else {
				hasConnection = false;
			}
		}
		// go up and to the left of the origin
		hasConnection = true;
		offset = 1;
		while (hasConnection) {
			let newRow    = move.row + offset;
			let newColumn = move.column - offset;

			let onBoard: boolean = newRow < board.numberOfColumns && newColumn >= 0;
			let lowerRightSlot: number = (onBoard) ? board.columns[newColumn][newRow] : null;
			let match: boolean = (lowerRightSlot === move.player.id);
			offset++;

			if (match) {
				consecutiveDiagonalSlots2++;

				if (consecutiveDiagonalSlots2 === CONSECUTIVE_SLOTS_FOR_WIN) {
					return true;
				}
			}
			else {
				hasConnection = false;
			}
		}

		return false;
	}

	public isBoardFull (board: Board): boolean {
		return this.moveCount >= board.numberOfPossibleMoves;
	}

	private isColumnFull (board: Board, column: number): boolean {
		return this.getLastOpenRow(board, column) == null;
	}

	private getLastOpenRow (board: Board, column: number): number {
		let retVal = null;

		for (let i:number = 0; i < board.columns[column].length; i++) {
			if (!board.columns[column][i]) {
				retVal = i;
				break;
			}
		}

		return retVal;
	}

	public getAllOpenColumns (board: Board) {
		let retVal: number[] = [];

		let message;
		board.columns.forEach((column: number[], index: number) => {
			if (!this.isColumnFull(board, index)) {
				retVal.push(index);
				message += index + ", ";
			}
		});
		return retVal;
	}
}