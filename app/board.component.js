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
var board_1 = require('./board');
var game_service_1 = require('./game.service');
var ai_service_1 = require('./ai.service');
var BoardComponent = (function () {
    function BoardComponent(gameService, aiService) {
        this.gameService = gameService;
        this.aiService = aiService;
        this.moveResultTypes = game_service_1.MoveResult;
    }
    Object.defineProperty(BoardComponent.prototype, "currentMoveBy", {
        get: function () {
            return this._currentMoveBy;
        },
        set: function (nextPlayerToMove) {
            this._currentMoveBy = nextPlayerToMove;
            if (this.currentMoveBy.type == game_service_1.PlayerType.AI) {
                var nextMoveIndex = this.aiService.getNextMove(this.board, nextPlayerToMove, this.lastMoveBy);
                this.makeMove(nextMoveIndex);
            }
        },
        enumerable: true,
        configurable: true
    });
    BoardComponent.prototype.makeMove = function (column) {
        var move = new game_service_1.Move(column, null, this.currentMoveBy);
        this.lastMoveResult = this.gameService.makeMove(this.board, move);
        this.lastMoveBy = move.player;
        if (this.lastMoveResult === game_service_1.MoveResult.GameContinues) {
            this.currentMoveBy = this.getNextPlayerToMove();
        }
    };
    BoardComponent.prototype.ngOnInit = function () {
        this.board = new board_1.Board(game_service_1.RulesConfiguration.NUMBER_OF_ROWS, game_service_1.RulesConfiguration.NUMBER_OF_COLUMNS);
        this.player1 = new game_service_1.Player(1, "Player 1", game_service_1.PlayerType.Human);
        this.player2 = new game_service_1.Player(2, "Player 2", game_service_1.PlayerType.AI);
        this.currentMoveBy = this.player1;
    };
    BoardComponent.prototype.getNextPlayerToMove = function () {
        switch (this.currentMoveBy.id) {
            case this.player1.id:
                return this.player2;
            case this.player2.id:
                return this.player1;
            default:
                throw "Whoa! Something went wrong. We can't determine whose move it is.";
        }
    };
    BoardComponent = __decorate([
        core_1.Component({
            selector: 'cf-board',
            // TODO : move this to an external component template
            template: "\n\t\t<h2 class=\"jumbotron\">\n\t\t\t<div class=\"players\">\n\t\t\t\t<span *ngFor=\"let player of [ player1, player2 ]\"\n\t\t\t\t\tclass=\"player\"\n\t\t\t\t\t[ngClass]=\"{ 'active': player == currentMoveBy }\"\n\t\t\t\t>\n\t\t\t\t\t{{ player.name }}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<small [ngSwitch]=\"lastMoveResult\">\n\t\t\t\t\t<span *ngSwitchCase=\"moveResultTypes.GameContinues\">Game in Progress</span>\n\t\t\t\t\t<span *ngSwitchCase=\"moveResultTypes.GameWon\">{{ currentMoveBy.name }} Wins!</span>\n\t\t\t\t\t<span *ngSwitchCase=\"moveResultTypes.GameTied\">Game Over: You Tied!</span>\n\t\t\t\t\t<span *ngSwitchCase=\"moveResultTypes.InvalidMove\">Invalid Move</span>\n\t\t\t\t</small>\n\t\t\t</div>\n\t\t</h2>\n\t\t<div class=\"board\">\n\t\t\t<div *ngFor=\"let column of board.columns; let i=index\"\n\t\t\t\tclass=\"column\"\n\t\t\t\t(click)=\"makeMove(i)\"\n\t\t\t>\n\t\t\t\t<div\n\t\t\t\t\t*ngFor=\"let cell of column.slice().reverse(); let j=index\"\n\t\t\t\t\tclass=\"cell player-{{cell}} list-group-item\"\n\t\t\t\t></div>\n\t\t\t</div>\n\t\t</div>\n\t",
            // TODO : move this to a component stylesheet
            styles: ["\n\t\t.board {\n\t\t\twidth: 70%;\n\t\t\tmargin: 2rem auto;\n\t\t}\n\t\t.board .column {\n\t\t\tdisplay: flex;\n\t\t\tjustify: content;\n\t\t\talign-items: center;\n\t\t\tpadding: 3rem 0.2rem 1rem;\n\t\t\tborder-radius: 3px;\n\t\t\tdisplay:inline-block;\n\t\t\tvertical-align:top;\n\t\t\tcursor: pointer;\n\t\t}\n\t\t.board .column:hover {\n\t\t\tbackground: #efefef;\n\t\t}\n\t\t.board .cell {\n\t\t\theight: 7rem;\n\t\t\twidth: 7rem;\n\t\t\tborder-radius: 4rem;\n\t\t}\n\t\t.board .player-1 {\n\t\t\tbackground: #ff3b3f;\n\t\t}\n\t\t.board .player-2 {\n\t\t\tbackground: #333333;\n\t\t}\n\t\t.players {\n\t\t\tmargin-bottom: 1em;\n\t\t}\n\t\t.player {\n\t\t\tmargin: 0.1em;\n\t\t\tpadding: 0.3em;\n\t\t}\n\t\t.player.active {\n\t\t\tbackground: #dff0d8;\n\t\t\tcolor: #3c763d;\n\t\t\tborder-radius: 5px;\n\t\t\tborder-left: 1px solid #fefefe;\n\t\t\tborder-top: 1px solid #fefefe;\n\t\t}\n\t"],
            providers: [game_service_1.GameService, ai_service_1.AIService],
        }), 
        __metadata('design:paramtypes', [game_service_1.GameService, ai_service_1.AIService])
    ], BoardComponent);
    return BoardComponent;
}());
exports.BoardComponent = BoardComponent;
//# sourceMappingURL=board.component.js.map