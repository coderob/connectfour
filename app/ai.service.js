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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var game_service_1 = require('./game.service');
var AIService = (function () {
    function AIService(gameService) {
        this.gameService = gameService;
    }
    AIService.prototype.getNextMove = function (board, player) {
        var availableMoves = this.gameService.getAllOpenColumns(board);
        return this.getBestMove(board, availableMoves, player);
        // return this.getRandomMove(board, availableMoves);
    };
    AIService.prototype.getRandomMove = function (board, availableMoves) {
        return ArrayUtilities.getRandomElement(availableMoves);
    };
    AIService.prototype.getBestMove = function (board, availableMoves, player) {
        var winningMoves = [];
        var continuingMoves = [];
        var tyingMoves = [];
        for (var i = 0; i < availableMoves.length; i++) {
            var move = new game_service_1.Move(availableMoves[i], null, player);
            var result = this.gameService.simulateMove(board, move);
            switch (result) {
                case game_service_1.MoveResult.GameWon:
                    // You could alternatively short-circuit on any winning move here as well
                    winningMoves.push(move.column);
                    break;
                case game_service_1.MoveResult.GameContinues:
                    continuingMoves.push(move.column);
                    break;
                case game_service_1.MoveResult.GameTied:
                    tyingMoves.push(move.column);
                    break;
                default:
                    throw "Unhandled result: " + result;
            }
        }
        // The best moves are (in order): Winning Moves, Game Continuing Moves, Game Tying Moves
        var movesetOfChoice = (winningMoves.length) ? winningMoves :
            (continuingMoves.length) ? continuingMoves :
                tyingMoves;
        return ArrayUtilities.getRandomElement(movesetOfChoice);
    };
    AIService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(game_service_1.GameService)), 
        __metadata('design:paramtypes', [game_service_1.GameService])
    ], AIService);
    return AIService;
}());
exports.AIService = AIService;
var ArrayUtilities = (function () {
    function ArrayUtilities() {
    }
    ArrayUtilities.getRandomElement = function (array) {
        if (!array || !array.length) {
            return null;
        }
        return array[Math.floor(Math.random() * array.length)];
    };
    return ArrayUtilities;
}());
exports.ArrayUtilities = ArrayUtilities;
//# sourceMappingURL=ai.service.js.map