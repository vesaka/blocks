import BinaryHeap from '../collections/heapq.js';
import Node from '../elements/node.js';
import { _H } from '../constants.js';
class BestFirstStrategy {
    
    constructor() {
        Node.lt_type = _H;
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

export default BestFirstStrategy;

