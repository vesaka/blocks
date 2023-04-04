// Define the board
const boardSize = 6;
const board = Array.from({length: boardSize}, () => Array.from({length: boardSize}, () => 0));

// Define the blocks
const blocks = [
    {number: 1, size: 2, orientation: 'horizontal', row: 2, col: 0},
    {number: 2, size: 3, orientation: 'vertical', row: 0, col: 3},
    {number: 3, size: 3, orientation: 'horizontal', row: 4, col: 2},
    {number: 4, size: 2, orientation: 'vertical', row: 0, col: 1},
    {number: 5, size: 2, orientation: 'horizontal', row: 4, col: 4},
    {number: 6, size: 2, orientation: 'horizontal', row: 5, col: 3},
];

// Define the exit location
const exitRow = 2;
const exitCol = 6;

// Place the blocks on the board
for (const block of blocks) {
    const {number, size, orientation, row, col} = block;
    const cells = Array.from({length: size}, (_, i) => (orientation === 'horizontal' ? [row, col + i] : [row + i, col]));
    for (const [cellRow, cellCol] of cells) {
        board[cellRow][cellCol] = number;
    }
}

// Print the initial board
console.table(board);

// Define a function to move a block
function moveBlock(blockNumber, direction) {
    const block = blocks.find(b => b.number === blockNumber);
    const {size, orientation, row, col} = block;
    const cells = Array.from({length: size}, (_, i) => (orientation === 'horizontal' ? [row, col + i] : [row + i, col]));
    const [moveRow, moveCol] = direction === 'left' || direction === 'up' ? [-1, -1] : [1, 1];
    const [lastRow, lastCol] = cells[cells.length - 1];
    const [newRow, newCol] = orientation === 'horizontal' ? [row, col + moveCol] : [row + moveRow, col];
    if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
        return false; // Can't move off the board
    }
    const newCells = Array.from({length: size}, (_, i) => (orientation === 'horizontal' ? [newRow, newCol + i] : [newRow + i, newCol]));
    for (const [cellRow, cellCol] of newCells) {
        if (board[cellRow][cellCol] !== 0 && board[cellRow][cellCol] !== blockNumber) {
            return false; // Can't move onto another block
        }
    }
    for (const [cellRow, cellCol] of cells) {
        board[cellRow][cellCol] = 0;
    }
    for (const [cellRow, cellCol] of newCells) {
        board[cellRow][cellCol] = blockNumber;
    }
    block.row = newRow;
    block.col = newCol;
    return true;
}

// Example move
moveBlock(1, 'right');
console.table(board);
