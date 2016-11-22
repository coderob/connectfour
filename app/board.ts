export class Board {
	public readonly numberOfPossibleMoves: number;
	public readonly numberOfRows: number;
	public readonly numberOfColumns: number;
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
}