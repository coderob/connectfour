import { Inject, Injectable } from '@angular/core';
import { Board } from './board';
import { GameService, Player, Move, MoveResult } from './game.service';

export class Node {
	board: Board;
	moveType: NodeType;
	score: number;
	availableMoves: Node[];

	constructor (board: Board, nextMoveType: NodeType) {
		this.board = DeepCopyService.deepCopyBoard(board);
		this.moveType = nextMoveType;
	}
}

@Injectable()
export class NodeFactory {
	private gameService: GameService;

	constructor (@Inject(GameService) gameService: GameService) {
		this.gameService = gameService;
	}

	// Returns the score of the 
	public createNode (board: Board, currentMoveType: NodeType, columnOfMove: number, maxDepth: number, currentDepth: number): Node {
		let currentNode: Node = new Node(board, currentMoveType);
		currentDepth++;

		// NOTE: For time's sake, going to bake in the assumption that there are only two players with values 1 and 2. 
		// This should be refactored out.
		let player: Player = new Player(currentMoveType.valueOf(), null, null);

		let move: Move = new Move(columnOfMove, null, player);
		let moveResult: MoveResult = this.gameService.makeMove(currentNode.board, move);

		currentNode.score = this.convertResultToScore(moveResult, currentMoveType);

		if (currentDepth < maxDepth) {
			let nextMoveType = (currentMoveType === NodeType.Max) ? NodeType.Min : NodeType.Max;
			let nextMoves: number[] = this.gameService.getAllOpenColumns(currentNode.board);
			let childNodes: Node[] = [];
			nextMoves.forEach(element => {
				// TODO: remove this tail recursion
				let childNode: Node = this.createNode(currentNode.board, nextMoveType, element, maxDepth, currentDepth);
				childNodes.push(childNode);
				currentNode.score += childNode.score;
			});
		}

		return currentNode;
	}

	private convertResultToScore (moveResult: MoveResult, lastMoveType: NodeType) {
		let score: number = 0;
		switch (moveResult) {
			case MoveResult.GameContinues:
				score = 0;
				break;
			case MoveResult.GameTied:
				score = -1;
				break;
			case MoveResult.GameWon:
				score = (lastMoveType == NodeType.Max) ? 2 : -2;
				break;
			default:
				debugger;
				throw "Unhandled MoveResult: " + moveResult.toString();
		}
		return score;
	}
}

export enum NodeType {
	Min = 1,
	Max = 2
}

export class GameTree {
	rootNote: Node;

	constructor (rootNode: Node) {
		this.rootNote = rootNode
	}
}

export class DeepCopyService {
	public static deepCopyBoard (board: Board): Board {
		let copy: Board = new Board(board.numberOfRows, board.numberOfColumns);
		board.columns.forEach(element => {
			copy.columns.push(DeepCopyService.deepCopyArray(element));
		});
		return copy;
	}

	public static deepCopyArray (arr: Array<any>): Array<any> {
		let copy: Array<any> = Array<any>();
		arr.forEach(element => {
			let elementCopy: any = copy.push(element); // NOTE : I could make this deep copy objects as well as primitives, but won't for the sake of time
		});
		return copy;
	}
}