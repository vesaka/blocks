// Define a class for the puzzle state
class PuzzleState {
    constructor(grid, move, prev) {
        this.grid = grid; // 2D array representing the current puzzle state
        this.move = move; // Move made to reach this state from the previous state (e.g. 'up', 'down', 'left', 'right')
        this.prev = prev; // Reference to the previous state
    }
}

// Function to check if the puzzle is solved
// Function to check if the puzzle is solved
function isPuzzleSolved(grid) {
  const numRows = grid.length;
  const numCols = grid[0].length;

  // Find the main block (block with ID 1)
  let mainBlockRow = -1;
  let mainBlockCol = -1;
  let mainBlockOrientation = '';

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (grid[row][col] === 1) {
        mainBlockRow = row;
        mainBlockCol = col;

        // Determine the orientation of the main block
        if (row > 0 && grid[row - 1][col] === 1) {
          mainBlockOrientation = 'vertical';
        } else if (col > 0 && grid[row][col - 1] === 1) {
          mainBlockOrientation = 'horizontal';
        } else if (row < numRows - 1 && grid[row + 1][col] === 1) {
          mainBlockOrientation = 'vertical';
        } else if (col < numCols - 1 && grid[row][col + 1] === 1) {
          mainBlockOrientation = 'horizontal';
        }

        break;
      }
    }
  }

  // Check if the main block is at the appropriate edge of the grid based on its orientation
  switch (mainBlockOrientation) {
    case 'vertical':
      if (mainBlockRow === 0) {
        return true; // Main block is at the top edge
      }
      break;
    case 'horizontal':
      if (mainBlockCol === numCols - 1) {
        return true; // Main block is at the right edge
      }
      break;
    default:
      // Main block is not oriented yet, puzzle is not solved
      return false;
  }

  return false;
}


// Function to generate next possible states from the current state
function generateNextStates(currentState) {
    const nextStates = [];
    const grid = currentState.grid;
    const numRows = grid.length;
    const numCols = grid[0].length;

    // Iterate through the grid to find blocks and generate next possible states
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const blockId = grid[row][col];
            if (blockId !== 0) {
                // Move block to the left
                if (col > 0 && grid[row][col - 1] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(grid));
                    newGrid[row][col] = 0;
                    newGrid[row][col - 1] = blockId;
                    const nextState = new PuzzleState(newGrid, 'left', currentState);
                    nextStates.push(nextState);
                }

                // Move block to the right
                if (col < numCols - 1 && grid[row][col + 1] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(grid));
                    newGrid[row][col] = 0;
                    newGrid[row][col + 1] = blockId;
                    const nextState = new PuzzleState(newGrid, 'right', currentState);
                    nextStates.push(nextState);
                }

                // Move block up
                if (row > 0 && grid[row - 1][col] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(grid));
                    newGrid[row][col] = 0;
                    newGrid[row - 1][col] = blockId;
                    const nextState = new PuzzleState(newGrid, 'up', currentState);
                    nextStates.push(nextState);
                }

                // Move block down
                if (row < numRows - 1 && grid[row + 1][col] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(grid));
                    newGrid[row][col] = 0;
                    newGrid[row + 1][col] = blockId;
                    const nextState = new PuzzleState(newGrid, 'down', currentState);
                    nextStates.push(nextState);
                }
            }
        }
    }

    return nextStates;
}

// Function to calculate heuristic value for a given state
function calculateHeuristic(state) {
    const grid = state.grid;
    const numRows = grid.length;
    const numCols = grid[0].length;

    // Calculate the number of blocks blocking the path of block 1 to the right edge
    const block1 = grid.find(row => row.includes(1));
    const colIdx = block1.indexOf(1);
    let blockingBlocks = 0;
    for (let row = 0; row < numRows; row++) {
        for (let col = colIdx + 1; col < numCols; col++) {
            if (grid[row][col] !== 0 && grid[row][col] !== 1) {
                blockingBlocks++;
            }
        }
    }

    return blockingBlocks;
}

// Function to find the most optimal solution using A* search
function findOptimalSolution(initialState) {
    const openList = [initialState]; // Initialize open list with the initial state
    const closedList = new Set(); // Initialize closed list as a set to keep track of visited states

    while (openList.length > 0) {
        // Get the state with the lowest f value (f = g + h) from the open list
        let currentState = openList.shift();

        // Check if the current state is the goal state
        if (isPuzzleSolved(currentState.grid)) {
            // Construct the solution path by following the prev references
            const solutionPath = [];
            while (currentState.prev !== null) {
                solutionPath.unshift(currentState.move); // Add the move made to the solution path
                currentState = currentState.prev;
            }
            return solutionPath; // Return the solution path
        }

        // Generate next possible states from the current state
        const nextStates = generateNextStates(currentState);
        for (let nextState of nextStates) {
            // Calculate g value (number of moves made so far) for the next state
            const g = currentState.g + 1;
            // Calculate h value (heuristic cost) for the next state
            const h = calculateHeuristic(nextState);

            // Calculate f value (g + h) for the next state
            const f = g + h;

            // Check if the next state is not in the closed list and not already in the open list
            if (!closedList.has(nextState.grid.toString()) && !openList.some(state => state.grid.toString() === nextState.grid.toString())) {
                // Update the next state with the calculated g, h, and f values, and set the current state as its prev
                nextState.g = g;
                nextState.h = h;
                nextState.f = f;
                nextState.prev = currentState;

                // Add the next state to the open list
                openList.push(nextState);
            }
        }

        // Add the current state to the closed list
        closedList.add(currentState.grid.toString());
    }

    return null; // Return null if no solution is found
}

export const solve = (grid) => {
    const initialState = new PuzzleState(grid, null, null); // Create initial state with the initial grid

    return findOptimalSolution(initialState); // Find the most optimal solution path

} 


const result = solve([[0, 2, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
]);
console.log(result);
//if (solutionPath) {
//    console.log("Solution found:");
//    console.log(solutionPath); // Print the solution path
//} else {
//    console.log("No solution found.");
//}

