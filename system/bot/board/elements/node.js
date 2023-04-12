import { _SUM_HG, _H, _G } from '../constants.js';

class Node {
    static n = 0;
    static lt_type = _SUM_HG;
    
    constructor(state, hval) {
        this.state = state;
        this.hval = hval;
        this.gval = state.gval;
        this.index = Node.n;
        Node.n++;
    }
    
    lt(node) {
        if (Node.lt_type === _SUM_HG) {
            if ((this.gval+this.hval) === (node.gval+node.hval)) {
                return this.gval > node.gval;
            } else {
                return (this.gval + this.hval) < (node.gval + node.hval);
            }
        } else if(Node.lt_type === _G) {
            return this.gval < node.gval;
        } else if(Node.lt_type === _H) {
            return this.hval < node.hval;
        }
        
        console.log("Invalid comparator settings!");
        
        return this.gval < node.gval;
    }
}

export default Node;

