import BinaryHeap from '../collections/heapq.js';
import Node from '../elements/node.js';
import { _SUM_HG } from '../constants.js';

class AStarStrategy {
    constructor() {
        Node.lt_type = _SUM_HG;
        this.open = new BinaryHeap;
    }
    
    insert(node) {
        this.open.push(node);
    }
    
    extract() {
        this.open.pop();
    }
    
    empty() {
        return this.open.isEmpty();
    }
    
}

export default AStarStrategy;

