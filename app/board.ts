export enum MoveResult {
	InvalidMove,
	GameWon,
	GameTied,
	GameContinues
}

export const CONSECUTIVE_SLOTS_FOR_WIN = 77;

export class Board {
	private readonly rows: number;
	private readonly columns: number;
	public readonly totalNumberOfBoardSlots: number;
	private numberOfFullBoardSlots: number;
	public readonly boardRows: number[][];

	constructor (rows: number, columns: number) {
		this.rows = rows;
		this.columns = columns;
		this.totalNumberOfBoardSlots = rows * columns;

		this.boardRows = [];
		for (let i:number=0; i<columns; i++) {
			this.boardRows[i] = new Array<number>(rows);
		}

		// DEBUGGING: make a couple of simulated moves
		this.boardRows[0][2] = 1;
		this.boardRows[0][1] = 2;
		this.boardRows[0][3] = 2;
		this.boardRows[1][2] = 1;
	}

	// private isValidMove (row: number, column: number): boolean {
	// 	return !this.board[row][column];
	// }

	// public makeMove(row: number, column: number, playerIdentifier: number): MoveResult {
	// 	if (this.isValidMove(row, column)) {
	// 		return MoveResult.InvalidMove;
	// 	}

	// 	this.board[row][column] = playerIdentifier;
	// 	this.numberOfFullBoardSlots++;
	// }

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