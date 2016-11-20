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

	public get totalMoveCount() { return this.moveCount; }

	constructor (rows: number, columns: number) {
		this.numberOfRows = rows;
		this.numberOfColumns = columns;
		this.numberOfPossibleMoves = rows * columns;

		this.columns = [];
		for (let i:number=0; i<columns; i++) {
			this.columns[i] = new Array<number>(rows);
		}

		// DEBUGGING: make a couple of simulated moves
		this.columns[1][4] = 1;
		this.columns[2][4] = 2;
		this.columns[2][3] = 2;
		this.columns[3][4] = 1;
	}

	private isColumnFull (columnNumber: number): boolean {
		return this.getLastOpenRow(columnNumber) == null;
	}

	private isBoardFull (): boolean {
		return this.totalMoveCount >= this.numberOfPossibleMoves;
	}

	private getLastOpenRow (columnNumber): number {
		let retVal = null;

		// NOTE: Inversing the array traversal, since our game board "starts" 
		// in the bottom left and is technically the last element in a single column array.
		for (let i:number = this.columns[columnNumber].length - 1; i >= 0; i--) {
			if (!this.columns[columnNumber][i]) {
				retVal = i;
				break;
			}
		}

		return retVal;
	}

	public makeMove(columnNumber: number, player: Player): void {
		if (this.isBoardFull() || this.isColumnFull(columnNumber)) {
			//  this is unexpected, TODO: probably worth preventing clicks when the game is over/board is full
			console.debug(`Whoa! Column # ${columnNumber} is full`);
		}

		let openRowIndex = this.getLastOpenRow(columnNumber);
		this.columns[columnNumber][openRowIndex] = player.id;
		this.moveCount++;
	}

	// private isGameWon(playerIdentifier: number) {
	// 	let consecutiveSlots = 0;

	// 	//check vertical wins
	// 	for (let i: number = 0; i < this.columns; i++) {
	// 		this.board[i].forEach(element => {
	// 			if (element === playerIdentifier) {
	// 				consecutiveSlots++;
	// 			}
	// 			if (consecutiveSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
	// 				return true;
	// 			}
	// 		});
	// 	}

	// 	return false;
	// }
}