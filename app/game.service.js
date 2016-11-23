"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Player = (function () {
    function Player(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
    return Player;
}());
exports.Player = Player;
(function (PlayerType) {
    PlayerType[PlayerType["Human"] = 0] = "Human";
    PlayerType[PlayerType["AI"] = 1] = "AI"; // Beware of Skynet
})(exports.PlayerType || (exports.PlayerType = {}));
var PlayerType = exports.PlayerType;
var Move = (function () {
    function Move(column, row, player) {
        this.column = column;
        this.row = row;
        this.player = player;
    }
    return Move;
}());
exports.Move = Move;
(function (MoveResult) {
    MoveResult[MoveResult["InvalidMove"] = 0] = "InvalidMove";
    MoveResult[MoveResult["GameWon"] = 1] = "GameWon";
    MoveResult[MoveResult["GameTied"] = 2] = "GameTied";
    MoveResult[MoveResult["GameContinues"] = 3] = "GameContinues";
})(exports.MoveResult || (exports.MoveResult = {}));
var MoveResult = exports.MoveResult;
var RulesConfiguration = (function () {
    function RulesConfiguration() {
    }
    Object.defineProperty(RulesConfiguration, "NUMBER_OF_COLUMNS", {
        get: function () { return 7; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RulesConfiguration, "NUMBER_OF_ROWS", {
        get: function () { return 6; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RulesConfiguration, "CONSECUTIVE_SLOTS_FOR_WIN", {
        get: function () { return 4; },
        enumerable: true,
        configurable: true
    });
    return RulesConfiguration;
}());
exports.RulesConfiguration = RulesConfiguration;
var GameService = (function () {
    function GameService() {
        this.moveCount = 0;
    }
    GameService.prototype.makeMove = function (board, move) {
        if (this.isColumnFull(board, move.column)) {
            //  this may be unexpected, TODO: probably worth preventing clicks when the game is over/board is full
            console.debug("Whoa! Column # " + move.column + " is full");
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
    };
    GameService.prototype.simulateMove = function (board, move) {
        var row = this.getLastOpenRow(board, move.column);
        var result = this.makeMove(board, move);
        this.moveCount--; // this is kinda ugly and coupled; refactor this
        if (result != MoveResult.InvalidMove) {
            board.columns[move.column][row] = null;
        }
        return result;
    };
    GameService.prototype.isWin = function (board, move) {
        return this.isHorizontalWin(board, move) ||
            this.isVerticalWin(board, move) ||
            this.isForwardDiagonalWin(board, move) ||
            this.isBackwardsDiagonalWin(board, move);
    };
    GameService.prototype.isHorizontalWin = function (board, move) {
        var retVal = false;
        var consecutiveHorizontalSlots = 0;
        for (var i = 0; i < board.numberOfColumns; i++) {
            if (board.columns[i][move.row] === move.player.id) {
                consecutiveHorizontalSlots++;
                if (consecutiveHorizontalSlots === RulesConfiguration.CONSECUTIVE_SLOTS_FOR_WIN) {
                    retVal = true;
                    break;
                }
            }
            else {
                consecutiveHorizontalSlots = 0;
            }
        }
        return retVal;
    };
    GameService.prototype.isVerticalWin = function (board, move) {
        var retVal = false;
        var consecutiveVerticalSlots = 0;
        for (var i = 0; i < board.numberOfRows; i++) {
            if (board.columns[move.column][i] === move.player.id) {
                consecutiveVerticalSlots++;
                if (consecutiveVerticalSlots === RulesConfiguration.CONSECUTIVE_SLOTS_FOR_WIN) {
                    retVal = true;
                    break;
                }
            }
            else {
                consecutiveVerticalSlots = 0;
            }
        }
        return retVal;
    };
    GameService.prototype.isForwardDiagonalWin = function (board, move) {
        var retVal = false;
        var rowOrigin = (move.row - move.column > 0) ? move.row - move.column : 0;
        var columnOrigin = (move.column - move.row > 0) ? move.column - move.row : 0;
        var maxDiagonalSize = Math.max(move.column, move.row);
        var consecutiveDiagonalSlots = 0;
        for (var i = 0; i < maxDiagonalSize; i++) {
            var onBoard = (columnOrigin + i) < board.numberOfColumns &&
                (rowOrigin + i) < board.numberOfRows;
            var currentSlot = (onBoard) ? board.columns[columnOrigin + i][rowOrigin + i] : null;
            var match = currentSlot === move.player.id;
            if (match) {
                consecutiveDiagonalSlots++;
                if (consecutiveDiagonalSlots === RulesConfiguration.CONSECUTIVE_SLOTS_FOR_WIN) {
                    retVal = true;
                    break;
                }
            }
        }
        return retVal;
    };
    GameService.prototype.isBackwardsDiagonalWin = function (board, move) {
        var hasConnection = true;
        var consecutiveDiagonalSlots2 = 1;
        var offset = 1;
        // go down and right from the origin
        while (hasConnection) {
            var newRow = move.row - offset;
            var newColumn = move.column + offset;
            var onBoard = newRow >= 0 && newColumn < board.numberOfColumns;
            var lowerRightSlot = (onBoard) ? board.columns[newColumn][newRow] : null;
            var match = (lowerRightSlot === move.player.id);
            offset++;
            if (match) {
                consecutiveDiagonalSlots2++;
                if (consecutiveDiagonalSlots2 === RulesConfiguration.CONSECUTIVE_SLOTS_FOR_WIN) {
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
            var newRow = move.row + offset;
            var newColumn = move.column - offset;
            var onBoard = newRow < board.numberOfColumns && newColumn >= 0;
            var lowerRightSlot = (onBoard) ? board.columns[newColumn][newRow] : null;
            var match = (lowerRightSlot === move.player.id);
            offset++;
            if (match) {
                consecutiveDiagonalSlots2++;
                if (consecutiveDiagonalSlots2 === RulesConfiguration.CONSECUTIVE_SLOTS_FOR_WIN) {
                    return true;
                }
            }
            else {
                hasConnection = false;
            }
        }
        return false;
    };
    GameService.prototype.isBoardFull = function (board) {
        return this.moveCount >= board.numberOfPossibleMoves;
    };
    GameService.prototype.isColumnFull = function (board, column) {
        return this.getLastOpenRow(board, column) == null;
    };
    GameService.prototype.getLastOpenRow = function (board, column) {
        var retVal = null;
        for (var i = 0; i < board.columns[column].length; i++) {
            if (!board.columns[column][i]) {
                retVal = i;
                break;
            }
        }
        return retVal;
    };
    GameService.prototype.getAllOpenColumns = function (board) {
        var _this = this;
        var retVal = [];
        var message;
        board.columns.forEach(function (column, index) {
            if (!_this.isColumnFull(board, index)) {
                retVal.push(index);
                message += index + ", ";
            }
        });
        return retVal;
    };
    GameService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map