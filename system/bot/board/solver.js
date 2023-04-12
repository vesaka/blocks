import UnblockMe from './unblock-me.js';
import SearchEngine from './search-engine.js';
import { _ASTAR } from './constants.js';
export const solve = (blocks, board, limit = 30) => {
    const se = new SearchEngine();
}
const heuristic = state => {
    if (state.index === 6324) {
        return;
    }
    
    let moves = 0;
    
    targetColumn = state.target.col + state.target.size;
    let axis, cross;
    for (let block of state.blocks) {
        if ((state.target.orientation === 'vertical') && (block.orientation === 'horizontal')) {
            axis = 'col';
            cross = 'row';
        } else if ((state.target.orientation === 'horizontal') && (block.orientation === 'vertical')) {
            axis = 'row';
            cross = 'col';
        }
        
        const form = block[axis];
        const to = block[axis] + block.size - 1;
            
        if ((form < state.target[axis] <= to) && (block[cross] >= state.target[cross])) {
            const next = to + state.target[axis] - from - 1;
            const back = state.target[axis] - from - 1;

            if (from < next) {
                moves += back;
            } else if ((state.board.length - (to + 1)) < back) {
                moves += next;
            } else {
                moves += Math.min(next, back);
            }
        }

        moves += state.board.length - state.target[cross];
    }
    
    return moves;
    
}

