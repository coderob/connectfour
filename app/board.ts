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

	public makeMove (columnNumber: number, player: Player): void {
		if (this.isBoardFull() || this.isColumnFull(columnNumber)) {
			//  this is unexpected, TODO: probably worth preventing clicks when the game is over/board is full
			console.debug(`Whoa! Column # ${columnNumber} is full`);
		}

		let openRowIndex = this.getLastOpenRow(columnNumber);
		this.columns[columnNumber][openRowIndex] = player.id;
		this.moveCount++;
	}

	public winningPlayerIdentifier (): number {
		// TODO : implement this
		let consecutiveSlots = 0;
		let potentialWinner = null;

		// check for vertical wins
		for (let i:number = 0; i < this.numberOfColumns; i++) {
			consecutiveSlots = 0;
			for (let j:number = 0; j < this.numberOfRows - 1; j++) {
				let cell = this.columns[i][j];
				let cellAbove = this.columns[i][j-1];

				if (cell) {
					if (cell === potentialWinner) {
						consecutiveSlots++;

						if (consecutiveSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
							return potentialWinner;
						}
					}
					else {
						potentialWinner = cell;
						consecutiveSlots = 1;
					}
				}
			}
		}

		//check for horizontal wins
		for (let j:number = 0; j < this.numberOfRows; j++) {
			for (let i: number = 0; i < this.numberOfColumns - 1; i++) {
				let cell = this.columns[i][j];
				let cellRight = this.columns[i+1][j];

				if (cell) {
					if (cell === potentialWinner) {
						consecutiveSlots++;

						if (consecutiveSlots === CONSECUTIVE_SLOTS_FOR_WIN) {
							return potentialWinner;
						}
					}
					else {
						potentialWinner = cell;
						consecutiveSlots = 1;
					}
				}
			}
		}

		consecutiveSlots = 0;
		potentialWinner = null;
		return null;
	}

	public isGameOver (): boolean {
		return this.isBoardFull() || !!this.winningPlayerIdentifier();
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