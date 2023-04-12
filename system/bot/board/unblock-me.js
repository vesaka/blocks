import StateSpace from './state-space.js';
import Block from './elements/block.js';
class UnblockMe extends StateSpace {

    constructor(action, gval, target, blocks, board, parent = null) {
        super(action, gval, parent);

        this.target = target;
        this.blocks = blocks;
        this.board = board;

        this.moves = [];
    }

    successors() {
        let list = [];

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block.orientation === 'horizontal') {
                const [left, right] = this.getHorizontalMoves();
                list = list
                        .concat(this.horizontalSuccessors(block, left, i))
                        .concat(this.horizontalSuccessors(block, right, i));
            } else {
                const [up, down] = this.getVerticalMoves();
                list = list
                        .concat(this.verticalSuccessors(block, up, i))
                        .concat(this.verticalSuccessors(block, down, i));
            }
        }
    }

    horizontalSuccessors(block, distance, index) {
        const list = [];
        const {blocks, target} = this;

        if (0 !== distance) {
            const newBlock = copy(block);
            newBlock.col = block.col + distance;

            let newBlockList = blocks;
            let newTarget = target;

            if (block.id !== 1) {
                newBlockList = [blocks[index], newBlock, blocks[index + 1]];
            } else {
                newTarget = newBlock;
            }

            const newBoard = this.updateBoard(block, newBlock);
            const dir = distance < 0 ? 'left' : 'right';
            const action = this.addMove(block, newBlock, dir, distance);
            
            list.push(new UnblockMe(action, this.gval + Math.abs(distance), newTarget, newBlockList, newBoard, index));
        }
        
        return list;

    }

    verticalSuccessors() {
        const list = [];
        const {blocks, target} = this;
        
        if (0 !== distance) {
            const newBlock = copy(block);
            newBlock.row = block.row + distance;
            
            let newBlockList = blocks;
            let newTarget = target;
            
            if (block.id !== 1) {
                newBlockList = [blocks[index], newBlock, blocks[index + 1]];
            } else {
                newTarget = newBlock;
            }
            
            const newBoard = this.updateBoard(block, newBlock);
            const dir = distance < 0 ? 'top' : 'bottom';
            const action = this.addMove(block, newBlock, dir, distance);
            
            list.push(new UnblockMe(action, this.gval + Math.abs(distance), newTarget, newBlockList, newBoard, index));
        }
        
        return list;
    }

    getVerticalMoves() {
        const {board} = this;
        const {row, col} = block;
        let up = 0, down = 0, _row = row - 1;

        while (_row >= 0) {
            if (0 === board[_row][col]) {
                up--;
                _row--;
            } else {
                break;
            }
        }

        while (_row < board.length) {
            if (0 === board[_row][col]) {
                down++;
                _row++;
            } else {
                break;
            }
        }

        return [up, down];
    }

    getHorizontalMoves(block) {
        const {board} = this;
        const {row, col} = block;
        let left = 0, right = 0, column = col - 1;

        while (column >= 0) {
            if (0 === board[row][column]) {
                left--;
                column--;
            } else {
                break;
            }
        }

        while (column < board.length) {
            if (0 === board[row][column]) {
                right++;
                column++;
            } else {
                break;
            }
        }

        return [left, right];
    }
    
    updateBoard(block, newBlock) {
        const newBoard = copy(this.board);
        const old = {
            row: block.row,
            col: block.col
        };
        
        const { row, col } = newBlock;
        
        if (block.orientation === 'horizontal') {
            for (let i = 0; i < block.size; i++) {
                newBoard[old.row][old.col + i] = 0;
                newBoard[row][col + i] = block.id;
            }
        } else {
            for (let i = 0; i < block.size; i++) {
                newBoard[old.row + i][old.col] = 0;
                newBoard[row + i][col] = block.id;
            }
        }
    }
    
    hashableState() {
        return copy(this.state);
    }
    
    getTarget() {
        return this.blocks.find(block => block.id);
    }
    
    printState() {
        
    }
    
    

    addMove(block, newBlock, direction, distance) {
        const action = `Move ${block.id} ${direction} ${Math.abs(distance)} spaces from ${block.row} ${block.col} to ${newBlock.row} ${newBlock.col}`;
        this.moves.push({
            id: block.id,
            from: {
                row: block.row,
                col: block.col,
            },
            to: {
                row: newBlock.row,
                col: newBlock.col,
            },
            distance,
            direction,
            action
        });
        
        return action;
    }

}

const copy = obj => JSON.parse(JSON.stringify(obj));

export default UnblockMe;

