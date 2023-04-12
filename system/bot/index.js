//import Matrix from '../src/game/core/2d/grids/matrix.js';
import { generate, rand } from './generator.js';
import { start } from '../ai/solve.js';
import { runFunction } from '@guydev/native-python';

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



const puzzles = [];

const { board, blocks } = generate(goal, size, path);

console.log(start(blocks));




//console.log(JSON.stringify(puzzles));
