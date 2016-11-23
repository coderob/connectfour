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
var board_1 = require('./board');
var game_service_1 = require('./game.service');
var Node = (function () {
    function Node(board, nextMoveType) {
        this.board = DeepCopyService.deepCopyBoard(board);
        this.moveType = nextMoveType;
    }
    return Node;
}());
exports.Node = Node;
var NodeFactory = (function () {
    function NodeFactory(gameService) {
        this.gameService = gameService;
    }
    // Returns the score of the 
    NodeFactory.prototype.createNode = function (board, currentMoveType, columnOfMove, maxDepth, currentDepth) {
        var _this = this;
        var currentNode = new Node(board, currentMoveType);
        currentDepth++;
        // NOTE: For time's sake, going to bake in the assumption that there are only two players with values 1 and 2. 
        // This should be refactored out.
        var player = new game_service_1.Player(currentMoveType.valueOf(), null, null);
        var move = new game_service_1.Move(columnOfMove, null, player);
        var moveResult = this.gameService.makeMove(currentNode.board, move);
        currentNode.score = this.convertResultToScore(moveResult, currentMoveType);
        if (currentDepth < maxDepth) {
            var nextMoveType_1 = (currentMoveType === NodeType.Max) ? NodeType.Min : NodeType.Max;
            var nextMoves = this.gameService.getAllOpenColumns(currentNode.board);
            var childNodes_1 = [];
            nextMoves.forEach(function (element) {
                // TODO: remove this tail recursion
                var childNode = _this.createNode(currentNode.board, nextMoveType_1, element, maxDepth, currentDepth);
                childNodes_1.push(childNode);
                currentNode.score += childNode.score;
            });
        }
        return currentNode;
    };
    NodeFactory.prototype.convertResultToScore = function (moveResult, lastMoveType) {
        var score = 0;
        switch (moveResult) {
            case game_service_1.MoveResult.GameContinues:
                score = 0;
                break;
            case game_service_1.MoveResult.GameTied:
                score = -1;
                break;
            case game_service_1.MoveResult.GameWon:
                score = (lastMoveType == NodeType.Max) ? 2 : -2;
                break;
            default:
                debugger;
                throw "Unhandled MoveResult: " + moveResult.toString();
        }
        return score;
    };
    NodeFactory = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(game_service_1.GameService)), 
        __metadata('design:paramtypes', [game_service_1.GameService])
    ], NodeFactory);
    return NodeFactory;
}());
exports.NodeFactory = NodeFactory;
(function (NodeType) {
    NodeType[NodeType["Min"] = 1] = "Min";
    NodeType[NodeType["Max"] = 2] = "Max";
})(exports.NodeType || (exports.NodeType = {}));
var NodeType = exports.NodeType;
var GameTree = (function () {
    function GameTree(rootNode) {
        this.rootNote = rootNode;
    }
    return GameTree;
}());
exports.GameTree = GameTree;
var DeepCopyService = (function () {
    function DeepCopyService() {
    }
    DeepCopyService.deepCopyBoard = function (board) {
        var copy = new board_1.Board(board.numberOfRows, board.numberOfColumns);
        board.columns.forEach(function (element) {
            copy.columns.push(DeepCopyService.deepCopyArray(element));
        });
        return copy;
    };
    DeepCopyService.deepCopyArray = function (arr) {
        var copy = Array();
        arr.forEach(function (element) {
            var elementCopy = copy.push(element); // NOTE : I could make this deep copy objects as well as primitives, but won't for the sake of time
        });
        return copy;
    };
    return DeepCopyService;
}());
exports.DeepCopyService = DeepCopyService;
//# sourceMappingURL=game-tree.js.map