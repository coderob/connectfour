"use strict";
var Board = (function () {
    function Board(rows, columns) {
        this.numberOfRows = rows;
        this.numberOfColumns = columns;
        this.numberOfPossibleMoves = rows * columns;
        this.moveCount = 0;
        this.columns = [];
        for (var i = 0; i < columns; i++) {
            this.columns[i] = new Array(rows);
        }
    }
    Board.prototype.print = function () {
        var retVal = '';
        for (var row = 0; row < this.numberOfRows; row++) {
            for (var col = 0; col < this.numberOfColumns; col++) {
                var value = this.columns[col][this.numberOfRows - row - 1]; // print rows in reverse order
                var sValue = (value) ? value.toString() : '-';
                retVal += sValue + '|';
            }
            retVal += '\n';
        }
        return retVal;
    };
    return Board;
}());
exports.Board = Board;
//# sourceMappingURL=board.js.map