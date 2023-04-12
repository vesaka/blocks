import Deque from '../collections/deque.js';
class BreathFirstStrategy {
    constructor() {
        this.open = new Deque;
    }
    
    insert(node) {
        this.open.append(node);
    }
    
    extract() {
        return this.open.popleft();
    }
    
    empty() {
        return this.open.isEmpty();
    }
}

export default BreathFirstStrategy;

