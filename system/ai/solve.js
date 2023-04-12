import { Search, make_init_state, unblockme_goal_fn, heur_num_blocks_blocking } from './search.js';
export const start = (blocks) => {
    const se = new Search(3, 2);

    const newBlocks = [];
    for (let block of blocks) {
        newBlocks.push([block.id, block.size, block.orientation, [block.row, block.col]]);
    }
    const target = blocks.find(b => b.id === 1);
    const initState = make_init_state(newBlocks, [target.row, target.col]);
    const state = se.search(initState, unblockme_goal_fn, heur_num_blocks_blocking);

    console.log(initState, state);
};

