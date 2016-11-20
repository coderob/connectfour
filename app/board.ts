export enum MoveResult {
	InvalidMove,
	GameWon,
	GameTied,
	GameContinues
}

export class Player {
	id: number;
	name: string;

	constructor (id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}

export const CONSECUTIVE_SLOTS_FOR_WIN = 4;

export class Board {
	public readonly numberOfPossibleMoves: number;
	private numberOfRows: number;
	private numberOfColumns: number;
	private moveCount: number;
	public readonly columns: number[][];

	constructor (rows: number, columns: number) {
		this.numberOfRows = rows;
		this.numberOfColumns = columns;
		this.numberOfPossibleMoves = rows * columns;
		this.moveCount = 0;

		this.columns = [];
		for (let i:number=0; i<columns; i++) {
			this.columns[i] = new Array<number>(rows);
		}
	}

	public isBoardFull (): boolean {
		return this.moveCount >= this.numberOfPossibleMoves;
	}

	private isColumnFull (columnNumber: number): boolean {
		return this.getLastOpenRow(columnNumber) == null;
	}

	private getLastOpenRow (columnNumber): number {
		let retVal = null;

		// NOTE: Inversing the array traversal, since our game board "starts" 
		// in the bottom left and is technically the last element in a single column array.
		for (let i:number = 0; i < this.columns[columnNumber].length; i++) {
			if (!this.columns[columnNumber][i]) {
				retVal = i;
				break;
			}
		}

		return retVal;
	}

	public makeMove (columnNumber: number, player: Player): MoveResult {
		if (this.isBoardFull() || this.isColumnFull(columnNumber)) {
			//  this is unexpected, TODO: probably worth preventing clicks when the game is over/board is full
			console.debug(`Whoa! Column # ${columnNumber} is full`);
			return MoveResult.InvalidMove;
		}

		let openRowIndex = this.getLastOpenRow(columnNumber);
		this.columns[columnNumber][openRowIndex] = player.id;
		this.moveCount++;

		if (this.isBoardFull()) {
			return MoveResult.GameTied;
		}
		if (this.isWin(columnNumber, openRowIndex, player)) {
			return MoveResult.GameWon;
		}

		return MoveResult.GameContinues;
	}

	public isWin (column: number, row: number, player: Player): boolean {
		// check for horizontal connection
		let consecutiveHorizontalSlots = 0;
		for (let i:number = 0; i < this.numberOfColumns; i++) {
			if (this.columns[i][row] === player.id) {
				consecutiveHorizontalSlots++;

				if (consecutiveHorizontalSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
					return true;
				}
			}
			else {
				consecutiveHorizontalSlots = 0;
			}
		}

		// check for vertical connection
		let consecutiveVerticalSlots = 0;
		for (let i:number = 0; i < this.numberOfRows; i++) {
			if (this.columns[column][i] === player.id) {
				consecutiveVerticalSlots++;

				if (consecutiveVerticalSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
					return true;
				}
			}
			else {
				consecutiveVerticalSlots = 0;
			}
		}

		// check for Up-Right diagonal connections
		let rowOrigin: number    = (row - column > 0) ? row - column : 0;
		let columnOrigin: number = (column - row > 0) ? column - row : 0;
		let maxDiagonalSize: number = Math.max(column, row);
		let consecutiveDiagonalSlots = 0;
		for (let i:number = 0; i < maxDiagonalSize; i++) {
			let onBoard: boolean = 
				(columnOrigin + i) < this.numberOfColumns &&
				(rowOrigin    + i) < this.numberOfRows;

			let currentSlot: number = (onBoard) ? this.columns[columnOrigin + i][rowOrigin + i] : null;
			let match: boolean = currentSlot === player.id;

			if (match) {
				consecutiveDiagonalSlots++;
				if (consecutiveDiagonalSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
					return true;
				}
			}
		}

		// check for Up-Left diagonal connections
		let hasConnection: boolean = true;
		let consecutiveDiagonalSlots2 = 1;
		let offset: number = 1;
		// go down and right from the origin
		while (hasConnection) {
			let newRow    = row - offset;
			let newColumn = column + offset;

			let onBoard: boolean = newRow >= 0 && newColumn < this.numberOfColumns;
			let lowerRightSlot: number = (onBoard) ? this.columns[newColumn][newRow] : null;
			let match: boolean = (lowerRightSlot === player.id);
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
			let newRow    = row + offset;
			let newColumn = column - offset;

			let onBoard: boolean = newRow < this.numberOfColumns && newColumn >= 0;
			let lowerRightSlot: number = (onBoard) ? this.columns[newColumn][newRow] : null;
			let match: boolean = (lowerRightSlot === player.id);
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
}