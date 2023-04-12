export const rand = (min, max) => {
    return ~~(Math.random() * (max - min + 1) + min);
};

export const compare = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

export const generate = (goal, size = 6, path = 2) => {
    const count = size * size;
    const freeTiles = rand(size, Math.floor(count * 0.25))

    let [grid, pairs] = createZeroGridAndPairs(size);
    const blocks = [];

    let index = 1, x, y, tiles, straight, free;
    let first = {};
    while (pairs.length >= freeTiles) {
            if (index > 1) {
                [x, y] = pairs[rand(0, pairs.length - 1)];
                tiles = rand(2, 3);
                straight = rand(0, 1);
                
                if (straight === first.straight) {
                    if ((1 === straight) && (x === path)) {
                        straight = 0;
                    } else if ((0 === straight) && (y === path)) {
                        straight = 1;
                    }
                }
                
            } else {
                x = 'x' === goal.axis ? path : size - rand(2, 3);
                y = 'y' === goal.axis ? path : size - rand(2, 3);
                tiles = goal.length;
                straight = Number('x' === goal.axis);
                first = {x, y, tiles, straight, path};

            }
            let free = true;

            if (straight) {
                if (y + tiles > size) {
                    continue;
                }
                
                let takenCells = 0, last = 0;
                for (let i = 1; i < size; i++) {
                    if ((0 < grid[x][i]) && (grid[x][i] === grid[x][i-1])) {
                        if (last && last === grid[x][i]) {
                            takenCells ++;
                        } else {
                            takenCells += 2;
                        }
                    }
                    last = grid[x][i-1];
                }
                
                if (takenCells >= size-tiles) {
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
                    
                    blocks.push({
                        id: index,
                        size: tiles,
                        row: x,
                        col: y,
                        orientation: straight ? 'horizontal' : 'vertical'
                    });
                    index++;
                }
            } else {
                if (x + tiles > size) {
                    continue;
                }
                
                
                let takenCells = 0, last = 0;
                for (let i = 1; i < size; i++) {
                    if ((0 < grid[i][y]) && (grid[i][y] === grid[i-1][y])) {
                        if (last && last === grid[i][y]) {
                            takenCells ++;
                        } else {
                            takenCells += 2;
                        }
                    }
                    last = grid[i-1][y];
                }
                
                if (takenCells >= size-tiles) {
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
                    
                    blocks.push({
                        id: index,
                        size: tiles,
                        row: x,
                        col: y,
                        orientation: straight ? 'horizontal' : 'vertical'
                    });
                    index++;
                }
            }

        }
        
        return { board: grid, blocks };
}

const createZeroGridAndPairs = (size) => {
    const grid = [];
    const pairs = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(0);
            pairs.push([i, j]);
        }
        grid.push(row);
    }

    return [grid, pairs];
}
