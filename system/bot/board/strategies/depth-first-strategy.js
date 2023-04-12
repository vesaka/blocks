import Strategy from './strategy';
class DepthFirstStrategy extends Strategy {
    constructor() {
        this.open = [];
    }
    
    insert(node) {
        this.open.push(node);
    }
    
    extract() {
        return this.open.pop();
    }
    
    empty() {
        return 0 === this.open.length;
    }
    
}

export default DepthFirstStrategy;

