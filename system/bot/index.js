//import Matrix from '../src/game/core/2d/grids/matrix.js';
import { generate, rand } from './generator.js';
import { solve, isSolvable } from './solver.js';
import puzzles from './puzzles.json' assert { type: 'json' };
//import options from '../config/options.json';
//console.log(puzzles.list[0]);

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
    solve(blocks, size, limit);
    
    console.log(JSON.stringify({blocks, grid}));
}
console.log(isSolvable(blocks, size));