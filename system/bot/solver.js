export const solve = (blocks, size = 6, limit = 30) => {
    const createGoal = (blocks) => {
        const main = blocks.find(block => block.id === 1);
        const goal = Object.assign({}, main);
        const middle = size / 2;

        const axis = goal.axis === 'x' ? 'col' : 'row';
        goal[axis] = main[axis] <= middle - main.size ? size - main.size : 0;
        return goal;
    }
    const goal = createGoal(blocks);
    const initialState = {
        blocks, moves: [], cost: 0
    };

    return;



    const heuristic = (state) => {
        const mainBlock = state.blocks.find(block => block.id === 1);
        return Math.abs(mainBlock.row - goal.row) + Math.abs(mainBlock.col - goal.col);
    }

    const search = (initialState) => {
// Initialize the open and closed lists
        const openList = [initialState];
        const closedList = new Set();
        while (openList.length > 0) {
// Sort the open list by the cost plus the heuristic
            openList.sort((state1, state2) => state1.cost + heuristic(state1) - state2.cost - heuristic(state2));
            // Pop the state with the lowest cost plus the heuristic from the open list
            const state = openList.shift();
            if (state.blocks.some(block => block.id === 1 && block.col === size - 1)) {
// Return the solution if the main block is at the goal position
                return state.moves;
            } else if (state.cost < limit && !closedList.has(JSON.stringify(state.blocks))) {
// Generate all possible moves and add the resulting states to the open list
                const mainBlock = state.blocks.find(block => block.id === 1);
                const moves = [
                    {row: mainBlock.row, col: mainBlock.col - 1, dx: -1, dy: 0},
                    {row: mainBlock.row, col: mainBlock.col + 1, dx: 1, dy: 0},
                    {row: mainBlock.row - 1, col: mainBlock.col, dx: 0, dy: -1},
                    {row: mainBlock.row + 1, col: mainBlock.col, dx: 0, dy: 1},
                ].filter(move => {
// Check if the move is valid
                    const {row, col, dx, dy} = move;
                    const occupied = new Set(state.blocks.flatMap(block => {
                        const {id, orientation, row, col} = block;
                        return block.size === 2 ? [row * size + col, row * size + col + (orientation === 'horizontal' ? 1 : size)] :
                                size === 3 ? [row * size + col, row * size + col + (orientation === 'horizontal' ? 1 : size), row * size + col + (orientation === 'horizontal' ? 2 : size * 2)] :
                                [];
                    }));
                    return !occupied.has(row * size + col) && row >= 0 && row < size && col >= 0 && col < size;
                });
                for (const move of moves) {
// Apply the move to generate a new state
                    const {row, col, dx, dy} = move;
                    const newBlocks = state.blocks.map(block => {
                        if (block.id === 1) {
                            return {...block, row, col};
                        } else if (block.row === mainBlock.row && block.col === mainBlock.col) {
                            return {...block, row: block.row + dy, col: block.col + dx};
                        } else {
                            return block;
                        }
                    });
                    const newState = {blocks: newBlocks, moves: [...state.moves, move], cost: state.cost + 1};
                    // Add the new state to the open list
                    openList.push(newState);
                }

                // Add the current state to the closed list
                closedList.add(JSON.stringify(state.blocks));
            }
        }

// Return null if no solution is found within the given limit
        return null;
    }

    return search(initialState);
}

export const isSolvable = (blocks, size) => {
    let running = true;
    // Flatten the block positions into an array of numbers
    const positions = blocks.flatMap(block => {
        const {id, orientation, row, col} = block;
        const start = row * size + col;
        return block.size === 2 ? [start, start + (orientation === 'horizontal' ? 1 : size)] :
                block.size === 3 ? [start, start + (orientation === 'horizontal' ? 1 : size), start + (orientation === 'horizontal' ? 2 : size * 2)] :
                [];
    });

//    console.log(positions);
//    return;

    setTimeout(() => {
        if (running) {
            throw new Error('It takes too long. Spare me!');
        }
    }, 5000);
    let inversions = 0;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            if (positions[i] && positions[j] && positions[i] > positions[j]) {
                inversions++;
            }
        }
    }
    running = false;
    return inversions % 2 === 0;
}

