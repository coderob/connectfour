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

	public print(): string {
		let retVal: string = '';
		for (let row:number=0; row<this.numberOfRows; row++) {
			for (let col:number=0; col<this.numberOfColumns; col++) {
				let value: number = this.columns[col][this.numberOfRows - row - 1]; // print rows in reverse order
				let sValue: string = (value) ? value.toString() : '-';
				retVal += sValue + '|';
			}
			retVal += '\n';
		}
		return retVal;
	}
}