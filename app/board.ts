export enum MoveResult {
	InvalidMove,
	GameWon,
	GameTied,
	GameContinues
}

export const CONSECUTIVE_SLOTS_FOR_WIN = 77;

export class Board {
	public readonly totalNumberOfBoardSlots: number;
	private numberOfFullBoardSlots: number;
	public readonly rows: number[][];

	constructor (rows: number, columns: number) {
		this.totalNumberOfBoardSlots = rows * columns;

		this.rows = [];
		for (let i:number=0; i<columns; i++) {
			this.rows[i] = new Array<number>(rows);
		}

		// DEBUGGING: make a couple of simulated moves
		this.rows[0][2] = 1;
		this.rows[0][1] = 2;
		this.rows[0][3] = 2;
		this.rows[1][2] = 1;
	}

	private isValidMove (row: number, column: number): boolean {
		return !this.rows[row][column];
	}

	public makeMove(row: number, column: number, playerIdentifier: number): void {
		this.rows[row][column] = playerIdentifier;
		this.numberOfFullBoardSlots++;
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