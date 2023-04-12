import { _DEPTH_FIRST, _BREADTH_FIRST, _BEST_FIRST, _ASTAR } from '../constants.js';
import Deque from './deque';
class Open {
    constructor(strategy) {
        if (_DEPTH_FIRST === strategy) {
            this.open = [];
            this.insert = this.open.append;
        }
    }
    
    get empty() {
        return 0 === this.open.length;
    }

    
}

export default Open;

