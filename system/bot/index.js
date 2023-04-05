//import Matrix from '../src/game/core/2d/grids/matrix.js';
import { generate, rand } from './generator.js';
import { solve, isSolvable } from './solver.js';

const get = (name, def = null) => {
    for (let i in process.argv) {
        if (process.argv[i].startsWith(name + '=')) {
            return process.argv[i].replace(name + '=', '');
        } else if (process.argv[i] === '--' + name) {
            return true;
        }
    }
    
    return def;
};



const size = get('size', 6);
const limit = get('limit', 30);
const path = Math.floor(size / 2);
const axis = get('axis', 'y');
const horizontal = 'x' === axis;
const goal = {axis, length: get('mbs', rand(2, 3))};

const { grid, blocks } = generate(goal, size, path);

if (isSolvable(blocks, size)) {
    const moves = solve(blocks, size, limit);
    if (Array.isArray(moves)) {
        console.log(JSON.stringify({blocks, grid, moves}));
    } else {
        console.warn('Not Solvalble or passed the limit')
    }
    
}
console.log(isSolvable(blocks, size));