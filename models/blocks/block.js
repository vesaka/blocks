import Model from '$core/3d/models/three-model';
import {
    Object3D, Mesh, MeshPhongMaterial, Vector3, Box3, MathUtils
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import Cell from '$blocks/models/cells/cell';

export const IDLE = 'idle';
export const ACTIVE = 'active';

export const LEADER = 'leader';
export const HORIZONTAL = 'horizontal';
export const Vertical = 'vertical';

export const X = 'x';
export const Y = 'y';

import { extend, raw } from '$core/utils/object';
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
        position.x = Cell.def.size * position.x;
        position.y = Cell.def.size * position.y;
        position.z = Cell.def.depth * 2;

        return position;
    }

    createModel() {
        const model = new Object3D;
        const { id, count, cell, direction, axis } = this;
        const { size, depth } = Cell.def;

        const xAxis = Number(X === axis);
        const yAxis = Number(Y === axis);
        for (let i = 0; i < count; i++) {
            const cellOptions = extend(cell, {
                id,
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
            width: size + size * xAxis * (count - 1),
            height: size + size * yAxis * (count - 1),
            depth: depth
        };

        return model;
    }

    get isMain() { return 1 === this.id; }

    isLeader() {
        return LEADER === this.type;
    }

    pointer_drag(target) {
        if (this.isNot(ACTIVE)) {
            return;
        }

        const { model, at, axis, direction } = this;

        const { min, max } = this.range;
        model.position[axis] = MathUtils.clamp(Math.round(target[axis]) - (at[axis]), min, max);
    }

    grab(cross) {
        this.at = this.model.worldToLocal(cross.point);
        this.at[this.axis] += Cell.halfSize/2;

        this.setState(ACTIVE);
        this.$listen({ pointer: ['drag'] });
        this.range = this.getRange();

        this.$emit('block_grabbed', this);

    }

    release() {
        this.at = null;
        this.setState(IDLE);

        const { model, axis } = this;

        model.position[axis] = round(model.position[axis], Cell.def.size);
        this.range = {};
        this.releaseSlots().bookSlots();
        this.$off('pointer_drag');
        this.$emit('block_released', this);

    }

    get normal() {
        const [first, second] = this.model.children;
        return new Vector3().subVectors(first.getWorldPosition(new Vector3), second.getWorldPosition(new Vector3)).normalize();
    }


    getDirection() {
        return this.axis;
    }

    getLimit() {

    }

    getRange(prop) {
        const { table, size, goal, model: { position } } = this;

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


        return { min, max };
    }

    isX() {
        return X === this.axis;
    }

    isY() {
        return Y === this.axis;
    }

    bookSlots() {
        const { id, count, table, size, direction, model: { position } } = this;
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

            if (slot.available && rectOverlapsRect(rect, slotRect)) {
                slot.available = false;
                slot.takenBy = id;
                this.slots.push({ x: slot.x, y: slot.y });
            }

        });
        return this;
    }

    releaseSlots() {
        const { id, table } = this;
        this.slots = [];
        table.eachSlot(slot => {
            if (id === slot.takenBy) {
                slot.available = true;
                slot.takenBy = 0;
            }
        });
        return this;
    }

    lucky_loaded(font) {
        const { text, size } = Cell.def;
        const { model } = this;
        const halfSize = size / 2;
        const $text = raw(text);
        $text.font = new Font(font);

        const textGeometry = new TextGeometry(`${x}${y}`, $text);
        const material = new MeshPhongMaterial({
            color: 0xbbbbbb,
            transparent: true,
            opacity: 0.95,
        });

        model.children.forEach(cell => {
            const mesh = new Mesh(textGeometry, material);
            mesh.position.set(0, cell.y, -halfSize);
            mesh.rotation.x = Math.PI / 2;
            this.model.add(mesh)
        });

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