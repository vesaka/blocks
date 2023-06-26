import data from '../config/puzzles.json' assert { type: "json" };
import options from '../config/options.json' assert { type: "json" };
import fs from 'fs';
import path from 'path';

const { boards } = data;
const { level } = options.game;

const findBoard = (moves) => {
    let board = boards.find(({ solution, taken }) => !taken && solution.length === moves);
    if (!board) {
        board = findBoard(--moves);
    }
    board.taken = true;
    return {name: board.name, blocks: board.blocks, moves};
}

const savePuzzles = (boards) => {
    const puzzlesPath = path.resolve(process.cwd(), 'src/game/blocks/config/puzzles.json');
    fs.writeFileSync(puzzlesPath, JSON.stringify({boards}, null, 4));
}

const levels = [];
for (let i = 0; i < level.max; i++) {
    const levelMoves = level.moves.initial + level.moves.byLevel * (i);
    levels.push(findBoard(levelMoves));
}

savePuzzles(levels );   


console.log(levels)