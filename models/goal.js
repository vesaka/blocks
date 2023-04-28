import Model from '$core/3d/models/three-model';
import Matrix from '$core/2d/grids/matrix';
import { Object3D } from 'three';
import { extend, isObject } from '$core/utils/object';

import Cell from '$blocks/models/cells/cell';

class Goal extends Model {
    constructor(options) {
        super(options);

        this.$listen({
            pointer: ['start', 'drag', 'end', 'out']
        });

    }
    
    getAxis() {
        return this.isHorizontal() ? 'x' : 'y';
    }
    
    get axis() {
        return this.isHorizontal() ? 'x' : 'y';
    }
    
    get cross() {
        return this.isHorizontal() ? 'y' : 'x';
    }

    filter_position(position) {
        const {table, grid} = this;
        const {size, depth} = Cell.def;
        const {edge, at} = position;
        let x = 0, y = 0, atX, atY;

        switch (edge) {
            case 'top':
                atX = Math.floor(table.width * at);
                x = atX - (atX % size);
                y = -size * 2;
                grid.rows = 2;
                grid.columns = 1;
                break;
            case 'bottom':
                atX = Math.floor(table.width * at);
                x = atX - (atX % size);
                y = table.height;
                grid.rows = 2;
                grid.columns = 1;
                break;
            case 'left':
                atY = Math.floor(table.height * at);
                x = -size*2;
                y = atY - (atY % size);
                grid.rows = 1;
                grid.columns = 2;
                break;
            case 'right':
                atY = Math.floor(table.height * at);
                x = table.width;
                y = atY - size;
                grid.rows = 1;
                grid.columns = 2;
                break;
            default:
                break;
        }
        
        this.size = {
            width: size * grid.rows,
            height: size * grid.columns,
            depth: depth
        };
        this.length = Math.max(grid.rows, grid.columns);
        this.edge = edge;
        this.at = at;
console.log({ edge, x, y })
        return {x, y, z: 0, edge, at};
    }
    
    resolve(choices) {
        const {edge} = this;
        if (typeof choices[edge] === 'function') {
            choices[edge]();
        }
    }

    createMatrix() {
        const {grid} = this;
        this.matrix = new Matrix(extend(grid, {
            width: Cell.def.size * grid.columns,
            height: Cell.def.size * grid.rows,
        }));
    }

    createModel() {
        this.createMatrix();
        const {matrix, cell} = this;
        const model = new Object3D;
        matrix.eachSlot(slot => {
            slot.cell = new Cell(extend(cell, {
                position: {
                    x: slot.ax,
                    y: slot.ay,
                    z: 0
                }
            }));

            model.add(slot.cell.model);
        });
        return model;
    }
    
    isHorizontal() {
        return this.grid.rows < this.grid.columns;
    }
    
    isVertical() {
        return this.grid.rows > this.grid.columns;
    }
    
    getAttributes() {
        const { grid } = this;
        if (grid.rows > grid.columns) {
            return ['x', 'y', 'width', 'height'];
        }
        
        return ['y', 'x', 'height', 'width'];
    }
    
    getRange(prop) {
        const { table, size, goal, at, model: {position} } = this;
        
        const goalSize = goal.size[prop];
        console.log(goalSize);
        let min = 0, max = table[prop] - size[prop];
        goal.resolve({
            top() {
                min -= goalSize;
            },
            left() {
                min = -goalSize;
                max = table.width;
            },
            bottom() {
                min = 0; 
                max += goalSize;
            },
            right() {
                min = 0;
                max = table.width + goalSize;
            }
        });

        
        return {min, max};
    }
}

export default Goal;