import Node from './elements/node.js';
import StateSpace from './state-space.js';
import { 
    _DEPTH_FIRST, _BREADTH_FIRST, _BEST_FIRST, _ASTAR,
    _CC_NONE, _CC_PATH, _CC_FULL
} from './constants.js';

const STRATEGIES = [_DEPTH_FIRST, _BREADTH_FIRST, _BEST_FIRST, _ASTAR];
const CC = [_CC_NONE, _CC_PATH, _CC_FULL];
class SearchEngine {
    constructor(strategy, level = null) {
        this.strategy = STRATEGIES.includes(strategy) ? strategy : STRATEGIES[0];
        this.cycleCheck = CC.includes(level) 
                        ? level 
                        : (STRATEGIES[0] === this.strategy ? _CC_PATH : _CC_FULL);
    }
    
    initStats() {
        Node.n = 0;
        StateSpace.n = 1;
        this.totalSearchTime = 0;
        this.cycleCheckPruned = 0;
        this.totalSearchTime = new Date().getTime();
    }
    
    traceOn(level = 1) {
        this.trace = 1;
    }
    
    traceOff() {
        this.trace = 0;
    }
    
    search(initState, goalHandler) {
        this.initStats();
    }
}

export default SearchEngine;

