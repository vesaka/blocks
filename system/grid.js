import Container from '$core/container';

class Grid extends Container {
    constructor(options) {
        super(options);
    }

    generate() {
        const {table: {count, rows, columns}, goal} = this;
        const path = this.path || 2;
        const minSize = Math.min(rows, columns);
        const freeTiles = rand(minSize, Math.floor(count * 0.25))

        let [grid, pairs] = this.createZeroGridAndPairs();
        const placements = [];


        let index = 1, x, y, tiles, straight, free;
        let first = {};
        while (pairs.length >= freeTiles) {
            if (index > 1) {
                [x, y] = pairs[rand(0, pairs.length - 1)];
                tiles = rand(2, 3);
                straight = rand(0, 1);
            } else {
                x = 'x' === goal.axis ? path : columns - rand(2, 3);
                y = 'y' === goal.axis ? path : rows - rand(2, 3);
                tiles = goal.length;
                straight = Number('x' === goal.axis);
                first = {x, y, tiles, straight, path};

            }
            let free = true;

            if (straight) {
                if ((index > 1 && first.straight && x === path) || (y + tiles > rows)) {
                    continue;
                }
                
                let takenCells = 0, last = 0;
                for (let i = 1; i < rows; i++) {
                    if ((0 < grid[x][i]) && (grid[x][i] === grid[x][i-1])) {
                        if (last && last === grid[x][i]) {
                            takenCells ++;
                        } else {
                            takenCells += 2;
                        }
                    }
                    last = grid[x][i-1];
                }
                
                if (takenCells >= rows-tiles) {
                    continue;
                }

                

                for (let i = y; i < y + tiles; i++) {
                    if (grid[x][i] !== 0) {
                        free = false;
                        break;
                    }
                }

                if (free) {
                    for (let i = y; i < y + tiles; i++) {
                        grid[x][i] = index;
                        pairs = pairs.filter(p => !compare([x, i], p));
                    }
                    
                    placements.push({
                        id: index,
                        count: tiles,
                        position: {x: y, y: x},
                        straight
                    });
                    index++;
                }
            } else {
                if ((index > 1 && !first.straight && (y === path)) || (x + tiles > columns)) {
                    continue;
                }
                
                
                let takenCells = 0, last = 0;
                for (let i = 1; i < columns; i++) {
                    if ((0 < grid[i][y]) && (grid[i][y] === grid[i-1][y])) {
                        if (last && last === grid[i][y]) {
                            takenCells ++;
                        } else {
                            takenCells += 2;
                        }
                    }
                    last = grid[i-1][y];
                }
                
                if (takenCells >= columns-tiles) {
                    continue;
                }

                for (let i = x; i < x + tiles; i++) {
                    if (grid[i][y] !== 0) {
                        free = false;
                        break;
                    }
                }

                if (free) {

                    for (let i = x; i < x + tiles; i++) {
                        grid[i][y] = index;
                        pairs = pairs.filter(p => !compare([i, y], p));
                    }
                    
                    placements.push({
                        id: index,
                        count: tiles,
                        position: {x: y, y: x},
                        straight
                    });
                    index++;
                }
            }

        }
        return placements;
    }

    transform(placements) {
        return placements.forEach(item => {
            return {
                id: item.id,
                size: item.count,
                orientation: 1 === item.straight ?  'horizontal' : 'vertical',
                row: item.position.x,
                col: item.position.y
            };
        });
        
    }
    
    solve() {
        const solver = new Solver(blocks);
    }
    
    createZeroGridAndPairs() {
        const {table} = this;
        const grid = [];
        const pairs = [];
        for (let i = 0; i < table.columns; i++) {
            let row = [];
            for (let j = 0; j < table.rows; j++) {
                row.push(0);
                pairs.push([i, j]);
            }
            grid.push(row);
        }

        return [grid, pairs];
    }
}

const compare = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

const rand = (min, max) => {
    return ~~(Math.random() * (max - min + 1) + min);
};


export default Grid;