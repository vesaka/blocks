class StateSpace {
    static n = 0;
    constructor(action, gval, parent) {
        this.action = action;
        this.gval = gval;
        this.parent = parent;
        this.index = StateSpace.n;
        StateSpace.n++;
    }
    
    successors() {}
    hashable_state() {}
    print_state() {}
    print_path() {
        let s = this;
        const states = [];
        while(s) {
            states.push(s);
            s = s.parent;
        }
        states.pop().print_state();
        
        while(states.length > 0) {
            console.log(" ==> " + states[states.lenght - 1] + "\n");
            states.pop().print_state();
        }
    }
    
    has_path_cycle() {
        let s = this.parent;
        const hc = this.hashble_state();
        while(s) {
            if(s.hashable_state() === hc) {
                return true;
            }
            s = s.parent;
        }
        return false;
    }
}

export default StateSpace;

