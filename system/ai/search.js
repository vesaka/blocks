import heapq from './heapq.js';
export class StateSpace {
    static n = 0;
    constructor(action, gval, parent) {
        this.action = action;
        this.gval = gval;
        this.parent = parent;
        this.index = StateSpace.n;
        StateSpace.n = StateSpace.n + 1;
    }

    successors() {
        console.log("Must be overridden.");
    }

    hashable_state() {
        console.log("Must be overridden.");
    }

    print_state() {
        console.log("Must be overridden.");
    }

    print_path() {
        let s = this;
        let states = [];
        while (s) {
            states.push(s);
            s = s.parent;
        }
        states.pop().print_state();
        while (states.length > 0) {
            console.log(" ==> ", end = "");
            states.pop().print_state();
        }
        console.log("");
    }

    has_path_cycle() {
        let s = this.parent;
        let hc = this.hashable_state();
        while (s) {
            if (s.hashable_state() === hc) {
                return true;
            }
            s = s.parent;
        }
        return false;
    }
}

class UnblockMe extends StateSpace {
    constructor(action, gval, target_block, block_list, board, parent = null) {
        super(action, gval, parent);
        this.target_block = target_block;
        this.block_list = block_list;
        this.board = board;
    }

    successors() {
        let successors_list = [];
        for (let i = 0; i < this.block_list.length; i++) {
            let block = this.block_list[i];
            if (block.orientation === VERTICAL) {
                let [up, down] = this.get_vertical_moves(block);
                successors_list.push(...this.vertical_successors(block, up, i), ...this.vertical_successors(block, down, i));
            } else {
                let [left, right] = this.get_horizontal_moves(block);
                successors_list.push(...this.horizontal_successors(block, left, i), ...this.horizontal_successors(block, right, i));
            }
        }
        let [target_left, target_right] = this.get_horizontal_moves(this.target_block);
        successors_list.push(...this.horizontal_successors(this.target_block, target_left, null), ...this.horizontal_successors(this.target_block, target_right, null));
        return successors_list;
    }

    horizontal_successors(block, distance, block_index) {
        let successors_list = [];
        if (distance !== 0) {
            let new_block = this.almost_clone_block(block, [block.position[0], block.position[1] + distance]);
            let new_block_list = this.block_list;
            let new_target_block = this.target_block;
            if (block.name !== TARGET_NAME) {
                new_block_list = this.block_list.slice(0, block_index).concat([new_block], this.block_list.slice(block_index + 1));
            } else {
                new_target_block = new_block;
            }
            let new_board = this.update_board(block, new_block.position);
            let dir = distance < 0 ? "left" : "right";
            let action = `Move ${block.name} ${dir} ${Math.abs(distance)} spaces from ${block.position} to ${new_block.position}`;
            let successor = new UnblockMe(action, this.gval + Math.abs(distance), new_target_block, new_block_list, new_board, this);
            successors_list.push(successor);
        }
        return successors_list;
    }

    vertical_successors(block, distance, block_index) {
        let successors_list = [];
        if (distance !== 0) {
            let new_block = this.almost_clone_block(block, [block.position[0] + distance, block.position[1]]);
            let new_block_list = this.block_list.slice(0, block_index).concat([new_block], this.block_list.slice(block_index + 1));
            let new_board = this.update_board(block, new_block.position);
            let dir = distance < 0 ? "up" : "down";
            let action = `Move ${block.name} ${dir} ${Math.abs(distance)} spaces from ${block.position} to ${new_block.position}`;
            let successor = new UnblockMe(action, this.gval + Math.abs(distance), this.target_block, new_block_list, new_board, this);
            successors_list.push(successor);
        }
        return successors_list;
    }

    get_vertical_moves(block) {
        let position = block.position;
        let up = 0;
        let down = 0;
        let row = position[0]
        for (let i = position[1] - 1; i >= 0; i--) {
            if (this.board[row][i] === EMPTY) {
                up--;
            } else {
                break;
            }
        }
        for (let i = position[1] + block.length; i < BOARD_SIZE; i++) {
            if (this.board[row][i] === EMPTY) {
                down++;
            } else {
                break;
            }
        }
        return [up, down];
    }

    get_horizontal_moves(block) {
        let position = block.position;
        let left = 0;
        let right = 0;
        let col = position[1];
        for (let i = position[0] - 1; i >= 0; i--) {
            if (this.board[i][col] === EMPTY) {
                left--;
            } else {
                break;
            }
        }
        for (let i = position[0] + block.length; i < BOARD_SIZE; i++) {
            if (this.board[i][col] === EMPTY) {
                right++;
            } else {
                break;
            }
        }
        return [left, right];
    }

    almost_clone_block(block, position) {
        return new Block(block.name, block.length, block.orientation, position);
    }

    update_board(old_block, new_position) {
        let new_board = JSON.parse(JSON.stringify(this.board));
        let row = old_block.position[0];
        let col = old_block.position[1];
        let length = old_block.length;
        let orientation = old_block.orientation;
        let name = old_block.name;
        if (orientation === VERTICAL) {
            for (let i = 0; i < length; i++) {
                new_board[row + i][col] = EMPTY;
            }
            for (let i = 0; i < length; i++) {
                new_board[new_position[0] + i][new_position[1]] = name;
            }
        } else {
            for (let i = 0; i < length; i++) {
                new_board[row][col + i] = EMPTY;
            }
            for (let i = 0; i < length; i++) {
                new_board[new_position[0]][new_position[1] + i] = name;
            }
        }
        return new_board;
    }

    print_board() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            console.log(this.board[i].join(" "));
        }
    }
}

function almost_clone_block(block, new_position) {
    return new Block(block.name, block.length, block.orientation, new_position);
}

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';
const TARGET_ROW = 0;
const TARGET_COL = 3;
const TARGET_LENGTH = 2;
const EMPTY = 0;
const TARGET_NAME = 1;
const BOARD_SIZE = 6;

const _DEPTH_FIRST = 0;
const _BREADTH_FIRST = 1;
const _BEST_FIRST = 2;
const _ASTAR = 3;

const _SUM_HG = 0;
const _H = 1;
const _G = 2;

const _CC_NONE = 0;
const _CC_PATH = 1;
const _CC_FULL = 2;

export function heur_zero(state) {
    return 0;
}

export function heur_num_blocks_blocking(state) {
    let num_moves = 0;
    const [orientation, index, otherIndex, target_index] = state.target_block.orientation === HORIZONTAL
            ? [VERTICAL, 1, 0, TARGET_ROW]
            : [HORIZONTAL, 0, 1, TARGET_COL];

    const target_id = state.target_block.position[index] + TARGET_LENGTH;
    for (let block of state.block_list) {
        if (orientation === block.orientation) {

            const from = block.position[otherIndex];
            const to = block.position[otherIndex] + block.length - 1;
            if (top <= target_index && target_index <= bottom && block.position[index] >= target_id) {
                const num_up = to - TARGET_ROW + 1;
                const num_down = target_index - from + 1;
                if (from < num_up) {
                    num_moves += num_down;
                } else if ((BOARD_SIZE - (to + 1)) < num_down) {
                    num_moves += num_up;
                } else {
                    num_moves += Math.min(num_up, num_down);
                }
            }
        }
//        if (block.orientation === VERTICAL) {
//            const target_column = state.target_block.position[1] + TARGET_LENGTH;
//            const top = block.position[0];
//            const bottom = block.position[0] + block.length - 1;
//            if (top <= TARGET_ROW && TARGET_ROW <= bottom && block.position[1] >= target_column) {
//                const num_up = bottom - TARGET_ROW + 1;
//                const num_down = TARGET_ROW - top + 1;
//                if (top < num_up) {
//                    num_moves += num_down;
//                } else if ((BOARD_SIZE - (bottom + 1)) < num_down) {
//                    num_moves += num_up;
//                } else {
//                    num_moves += Math.min(num_up, num_down);
//                }
//            }
//        } else {
//            const left = block.position[1];
//            const right = block.position[1] + block.length - 1;
//            const target_row = state.target_block.position[0] + TARGET_LENGTH;
//            if (top <= TARGET_COL && TARGET_COL <= right && block.position[1] >= target_row) {
//                const num_up = right - TARGET_COL + 1;
//                const num_down = TARGET_COL - left + 1;
//                if (left < num_up) {
//                    num_moves += num_down;
//                } else if ((BOARD_SIZE - (right + 1)) < num_down) {
//                    num_moves += num_up;
//                } else {
//                    num_moves += Math.min(num_up, num_down);
//                }
//            }
//        }
    }
    num_moves += BOARD_SIZE - target_id;
    return num_moves;
}

export function unblockme_goal_fn(state) {
    return state.target_block.position[0] === TARGET_ROW && state.target_block.position[1] === 4;
}

export function make_init_state(block_list, target_block_pos) {
    const blocks = [];
    for (let block of block_list) {
        blocks.push(new Block(block[0], block[1], block[2], block[3]));
    }
    const target_block = new Block(TARGET_NAME, TARGET_LENGTH, HORIZONTAL, target_block_pos);
    const board = Array.from({length: BOARD_SIZE}, () => Array(BOARD_SIZE).fill(false));
    for (let block of blocks) {
        for (let i = 0; i < block.length; i++) {
            if (block.orientation === VERTICAL) {
                board[block.position[0] + i][block.position[1]] = true;
            } else {
                board[block.position[0]][block.position[1] + i] = true;
            }
        }
    }
    for (let i = 0; i < target_block.length; i++) {
        board[target_block.position[0]][target_block.position[1] + i] = true;
    }
    return new UnblockMe("START", 0, target_block, blocks, board);
}

class Block {
    constructor(name, length, orientation, position) {
        this.name = name;
        this.length = length;
        this.orientation = orientation;
        this.position = position;
    }
}


class sNode {
    static n = 0;
    static lt_type = _SUM_HG;

    constructor(state, hval) {
        this.state = state;
        this.hval = hval;
        this.gval = state.gval;
        this.index = sNode.n;
        sNode.n = sNode.n + 1;
    }

    static compare(self, other) {
        if (sNode.lt_type === _SUM_HG) {
            if ((self.gval + self.hval) === (other.gval + other.hval)) {
                return self.gval > other.gval;
            } else {
                return ((self.gval + self.hval) < (other.gval + other.hval));
            }
        }
        if (sNode.lt_type === _G) {
            return self.gval < other.gval;
        }
        if (sNode.lt_type === _H) {
            return self.hval < other.hval;
        }
        console.log("sNode class has invalid comparator setting!");
        return self.gval < other.gval;
    }

    static setComparatorType(lt_type) {
        sNode.lt_type = lt_type;
    }

}

class Open {
    constructor(search_strategy) {
        console.log(search_strategy);
        if (search_strategy === _DEPTH_FIRST) {
            this.open = [];
            this.insert = this.open.push;
            this.extract = this.open.pop;
        } else if (search_strategy === _BREADTH_FIRST) {
            this.open = [];
            this.insert = this.open.push;
            this.extract = this.open.shift;
        } else if (search_strategy === _BEST_FIRST) {
            this.open = [];
            sNode.setComparatorType(_H);
            this.insert = node => {
                heapq.heappush(this.open, node);
            };
            this.extract = () => {
                return heapq.heappop(this.open);
            };
        } else if (search_strategy === _ASTAR) {
            this.open = [];
            sNode.setComparatorType(_SUM_HG);
            this.insert = node => {
                heapq.heappush(this.open, node);
            };
            this.extract = () => {
                return heapq.heappop(this.open);
            };
        } else {
            console.log("Invalid search strategy specified for Open class!");
        }
    }
    empty() {
        return this.open.length === 0;
    }
}

export class Search {
    static state = null;
    constructor(search_strategy, conflict_strategy) {
        this.search_strategy = search_strategy;
        this.conflict_strategy = conflict_strategy;
    }

    clear_closed() {
        if (this.conflict_strategy === _CC_FULL) {
            Search.state = null;
        } else if (this.conflict_strategy === _CC_PATH) {
            Search.state = Search.state.parent;
        }
    }

    search(start, goal, goal_fn, heur_fn) {
        let node_start = new sNode(start, heur_fn);
        let node_goal = new sNode(goal, goal_fn);

        let open_start = new Open(this.search_strategy);
        let open_goal = new Open(this.search_strategy);

        open_start.insert(node_start);
        open_goal.insert(node_goal);

        let closed_start = new Set();
        let closed_goal = new Set();

        while (!open_start.empty() && !open_goal.empty()) {
            let n_start = open_start.extract();
            let n_goal = open_goal.extract();

            if (n_start.state === n_goal.state) {
                n_start.state.print_path();
                n_goal.state.print_path();
                return true;
            }

            closed_start.add(n_start.state.blocks);
            closed_goal.add(n_goal.state.blocks);

            let succ_start = n_start.state.successors();
            let succ_goal = n_goal.state.successors();

            for (let s_start of succ_start) {
                let h_s_start = s_start.blocks;
                if (!closed_start.has(h_s_start)) {
                    let node_s_start = new sNode(s_start, heur_fn);
                    open_start.insert(node_s_start);
                    closed_start.add(h_s_start);
                }
            }

            for (let s_goal of succ_goal) {
                let h_s_goal = s_goal.blocks;
                if (!closed_goal.has(h_s_goal)) {
                    let node_s_goal = new sNode(s_goal, goal_fn);
                    open_goal.insert(node_s_goal);
                    closed_goal.add(h_s_goal);
                }
            }
        }

        return false;
    }
}

