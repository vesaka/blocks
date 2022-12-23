import Model from '$core/3d/models/three-model';
import { Object3D, Raycaster, Vector2, Vector3, Box3,MathUtils } from 'three';
import Cell from '$blocks/models/cell';

export const IDLE = 'idle';
export const ACTIVE = 'active';

export const LEADER = 'leader';
export const HORIZONTAL = 'horizontal';
export const Vertical = 'vertical';

export const X = 'x';
export const Y = 'y';

import { extend } from '$core/utils/object';
import { round, rand } from '$core/utils/math';
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
        const { table, path, axis, cross } = this;
        position[cross] = path * Cell.def.size;
        position[axis] = 4 * Cell.def.size;
        position.z = Cell.def.depth * 2;

        return position;
    }
    
    createModel() {
        const model = new Object3D;
        const { count, cell, direction, axis } = this;
        const { size, depth } = Cell.def;
        
        const xAxis = Number(X === axis);
        const yAxis = Number(Y === axis);
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

        const { table, model, direction, camera, at, axis} = this;

        const { min, max } = this.getRange(direction);
        model.position[axis] = MathUtils.clamp(Math.round(target[axis]) - at[axis], min, max );
    }
    
    grab(cross) {
        this.at = this.model.worldToLocal(cross.point);
        this.at.x *= 2;
        this.at.y *= 2;

        this.setState(ACTIVE);
        this.$listen({pointer: ['drag']});
        const { table, model, direction} = this;
        
        
        this.$emit('block_grabed', this);
        
    }
    
    release() {
        this.at = null;
        this.setState(IDLE);
        
        const { model, direction, table, axis } = this;

        const attribute = this.getDirection();
        model.position[axis] = round(model.position[axis], Cell.def.size);
        this.$off('pointer_drag');
        
        
    }
    
    
    getDirection() {
        return this.axis;
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
        return X === this.axis;
    }
    
    isY() {
        return Y === this.axis;
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