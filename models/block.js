import Model from '$core/3d/models/three-model';
import { Object3D, Raycaster, Vector2, Vector3, Box3,MathUtils } from 'three';
import Cell from './cell';

export const IDLE = 'idle';
export const ACTIVE = 'active';

export const LEADER = 'leader';
export const SHORT = 'short';
export const MEDIUM = 'medium';

export const X = 'x';
export const Y = 'y';

import { extend } from '$core/utils/object';
import { round } from '$core/utils/math';
import { rectOverlapsRect } from '$core/2d/utils/intersections';
class Block extends Model {
    constructor(options) {
        super(options);

        this.$listen({
            pointer: ['start', 'move', 'stop', 'out'],
        });
        
        this.box = new Box3().setFromObject(this.model);
        this.slots = [];
        
        this.start = new Vector3;
        this.bookSlots();
        
    }
    
    filter_count(count) {
        if (Array.isArray(count)) {
            count = rand(count[0], count[1]);
        }
        
        return count;
    }
    
    filter_position(position) {
        const { table, path, goal, count } = this;
        const frist = this.getDirection();
        const second = X === frist ? Y : X;
        const isGoalHorizontal = goal.isHorizontal();
        
        const xAxis = Number(this.isX());
        const yAxis = Number(this.isY());
        
        const [dir, prop] = goal.getAttributes();
        if (this.isLeader()) {
            position[frist] = 4 * Cell.def.size;
            position[second] = path * Cell.def.size;
            position.z = Cell.def.depth * 2;
            
        } else {
            
            table.eachSlot(slot => {
                if (!slot.available || (Math.random() > 0.75)) {
                    return;
                }
                let nextSlot, nextX, nextY;
                for (let i = 0; i < count; i++) {
                        nextX = slot.x + xAxis;
                        nextY = slot.y + yAxis;
                        
                        if (table.slots[nextX] && table.slots[nextX][nextY]) {
                            nextSlot = table.slots[nextX][nextY];
                            
                        }
                }
                
                
                position.x = slot.ax;
                position.y = slot.ay;
                position.z = Cell.def.depth * 2;;
            });
        }
        return position;
    }
    
    createModel() {
        const model = new Object3D;
        const { count, cell, direction } = this;
        const { size, depth } = Cell.def;
        
        const xAxis = Number(0 === direction);
        const yAxis = Number(1 === direction);
        for (let i = 0; i < count; i++) {
            const cellOptions = extend(cell, {
                position: {
                    x: size * xAxis * i,
                    y: size * yAxis * i,
                    z: 0
                }
            });
            const blockCell = new Cell(cellOptions);
            model.add(blockCell.model);
        }
        
        this.size = {
            width: size + size * xAxis * (count-1),
            height: size + size * yAxis * (count-1),
            depth: depth
        };

        return model;
    }
    
    isLeader() {
        return LEADER === this.type;
    }
    
    pointer_drag(target) {
        if (this.isNot(ACTIVE)) {
            return;
        }

        const { table, model, direction, camera, at} = this;
        const attribute = 1 === direction ? Y : X;
        const prop = 1 === direction ? 'height' : 'width';

        const { min, max } = this.getRange(prop);
        model.position[attribute] = MathUtils.clamp(Math.round(target[attribute]) - at[attribute], min, max );
    }
    
    grab(cross) {
        this.cross = cross;
        this.at = this.model.worldToLocal(cross.point);
        this.at.x *= 2;
        this.at.y *= 2;

        this.setState(ACTIVE);
        this.$listen({pointer: ['drag']});
        const { table, model, direction} = this;
        
        
        this.$emit('block_grabed', this);
        
    }
    
    release() {
        this.cross = null;
        this.at = null;
        this.setState(IDLE);
        
        const { model, direction, table } = this;

        const attribute = this.getDirection();
        model.position[attribute] = round(model.position[attribute], Cell.def.size);
        this.$off('pointer_drag');
        
        
    }
    
    
    getDirection() {
        return 1 === this.direction ? Y : X;
    }
    
    getLimit() {
        
    }
    
    getRange(prop) {
        const { table, size, goal, at, model: {position} } = this;
        
        const goalSize = this.isLeader() ? goal.size[prop] : 0;
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
    
    isX() {
        return X === this.direction;
    }
    
    isY() {
        return Y === this.direction;
    }
    
    bookSlots() {
        const { count, table, size, direction, model: { position } } = this;
        const rect = {
            x1: position.x,
            y1: position.y,
            x2: position.x + size.width,
            y2: position.y + size.height
        };
        
        table.eachSlot(slot => {
            const slotRect = {
                x1: slot.ax,
                y1: slot.ay,
                x2: slot.dx,
                y2: slot.dy
            };

            if(slot.available && rectOverlapsRect(rect, slotRect)) {
                slot.available = false;
                this.slots.push([slot.x, slot.y]);
            }

        });
    }
    
    releaseSlots() {
        
    }
    
}

const map = {
    x: {
        prop: 'width'
    },
    y: {
        prop: 'height'
    }
};

export default Block;