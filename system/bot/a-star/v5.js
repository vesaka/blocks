

export const solve = (grid, blocks, limit = 30) => {

    const size = grid.length;
    const raw = state => JSON.stringify(state);
    const copy = state => JSON.parse(JSON.stringify(state));
    
    const mainBlock = blocks.find(block => block.id === 1);
    
    const isHorizontal = mainBlock.orientation === 'horizontal';
    const middle = Math.floor(size);
    const goal = isHorizontal ? {
            row: mainBlock.row,
            col: mainBlock.col < middle ? size - 1 : 0
        } : {
            row: mainBlock.row < middle ? size - 1 : 0,
            col: mainBlock.col
        };

    const createIsSolvedCondition = () => {
                
        if (isHorizontal && goal.col >= middle) {
            return grid => {
                for (let i = mainBlock.col; i <= goal.col; i++) {
                    if (![mainBlock.id, 0].includes(grid[mainBlock.row][i])) {
                        return false;
                    }
                }
                return true;
            };
        } else if (isHorizontal && goal.col < middle) {
            return grid => {
                for (let i = mainBlock.col; i > goal.col; i--) {
                    if (![mainBlock.id, 0].includes(grid[mainBlock.row][i])) {
                        return false;
                    }
                }
                return true;
            };
        } else if (!isHorizontal && goal.row >= middle) {
            return grid => {
                for (let i = mainBlock.row; i <= goal.row; i++) {
                    if (![mainBlock.id, 0].includes(grid[i][mainBlock.col])) {
                        return false;
                    }
                }
                return true;
            };
        } else if (isHorizontal && goal.row < middle) {
            return grid => {
                for (let i = mainBlock.row; i > goal.row; i--) {
                    if (![mainBlock.id, 0].includes(grid[i][mainBlock.col])) {
                        return false;
                    }
                }
                return true;
            };
        }
        
        return null;
        
    };
    
    const isSolved = createIsSolvedCondition();
    const manhattan = (a, b, c, d) => Math.abs(a - b) + Math.abs(c - d);
    
    const states = new Set();
    const initialState = { blocks, moves: [], cost: 0};
};




