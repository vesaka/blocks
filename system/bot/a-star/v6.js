export function solve(board, limit = 30) {
    const numRows = board.length;
    const numCols = board[0].length;
    const targetBlock = 1;

    // Helper function to find the position of a block on the board
    function findBlockPosition(block) {
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (board[i][j] === block) {
                    return {row: i, col: j};
                }
            }
        }
        return null;
    }

    // Helper function to check if a move is valid
    function isValidMove(row, col) {
        return row >= 0 && row < numRows && col >= 0 && col < numCols && board[row][col] === 0;
    }

    // Helper function to check if the puzzle is solved
    function isPuzzleSolved() {
        const targetPosition = findBlockPosition(targetBlock);
        return targetPosition.row === 0 && targetPosition.col === numCols - 1;
    }

    // Define a node class for the A* algorithm
    class Node {
        constructor(board, g, h, parent) {
            this.board = board;
            this.g = g;
            this.h = h;
            this.parent = parent;
        }

        // Calculate the total cost of the node (g + h)
        get f() {
            return this.g + this.h;
        }
    }

    // Helper function to calculate the heuristic cost (h) of a given block
    function calculateHeuristic(block) {
        const currentPosition = findBlockPosition(block);
        const targetPosition = findBlockPosition(targetBlock);
        return Math.abs(currentPosition.row - targetPosition.row) + Math.abs(currentPosition.col - targetPosition.col);
    }

    // Perform A* search to find the optimal solution
    function aStarSearch() {
        const openList = [];
        const closedList = new Set();
        const startNode = new Node(board, 0, calculateHeuristic(targetBlock), null);
        openList.push(startNode);

        while (openList.length > 0) {
            // Sort the open list by total cost (f)
            openList.sort((a, b) => a.f - b.f);

            const currentNode = openList.shift();
            const currentBoard = currentNode.board;

            if (isPuzzleSolved()) {
                return currentNode;
            }

            if (currentNode.g >= limit) {
                continue;
            }

            const currentBlockPosition = findBlockPosition(targetBlock);
            const currentBlockRow = currentBlockPosition.row;
            const currentBlockCol = currentBlockPosition.col;

            // Generate possible moves for the current block
            const possibleMoves = [
                {row: currentBlockRow - 1, col: currentBlockCol},
                {row: currentBlockRow + 1, col: currentBlockCol},
                {row: currentBlockRow, col: currentBlockCol - 1},
                {row: currentBlockRow, col: currentBlockCol + 1}
            ];

            for (const move of possibleMoves) {
                const newRow = move.row;
                const newCol = move.col;

                if (isValidMove(newRow, newCol)) {
                    const newBoard = JSON.parse(JSON.stringify(currentBoard));
                    newBoard[newRow][newCol] = targetBlock;
                    newBoard[currentBlockRow][currentBlockCol] = 0;
                    const newNode = new Node(newBoard, currentNode.g + 1, calculateHeuristic(targetBlock), currentNode);
                    // Check if the new board configuration is already in the closed list
                    const newBoardString = JSON.stringify(newBoard);
                    if (closedList.has(newBoardString)) {
                        continue;
                    }

                    // Check if the new board configuration is already in the open list
                    let existingNodeIndex = -1;
                    for (let i = 0; i < openList.length; i++) {
                        if (JSON.stringify(openList[i].board) === newBoardString) {
                            existingNodeIndex = i;
                            break;
                        }
                    }

                    if (existingNodeIndex !== -1 && openList[existingNodeIndex].g <= currentNode.g + 1) {
                        continue;
                    }

                    if (existingNodeIndex !== -1) {
                        openList.splice(existingNodeIndex, 1);
                    }

                    openList.push(newNode);
                    closedList.add(newBoardString);
                }
            }
        }

        return null; // No solution found
    }

// Call the A* search function to find the optimal solution
    const optimalNode = aStarSearch();

// If a solution is found, backtrack from the optimal node to construct the solution path
    if (optimalNode) {
        const solution = [];
        let currentNode = optimalNode;
        while (currentNode) {
            solution.push(currentNode.board);
            currentNode = currentNode.parent;
        }
        solution.reverse();
        return solution;
    } else {
        return null; // No solution found
}
}


