import Model from '$core/3d/models/three-model';
import { Object3D, Mesh, BoxGeometry, MeshPhongMaterial, Box3 } from 'three';
import Cell from './cell';
import { extend } from '$core/utils/object';
class Board extends Model {

    slots = [];
    labels = [];
    constructor(options) {
        super(options);
        this.box = new Box3().setFromObject(this.model);
        this.$listen({
            level: ['starting', 'start', 'end']
        });
        this.createLabels();
    }

    createModel() {
        const model = new Object3D;
        const {table, cell} = this;
        this.slots = [];
        table.eachSlot((slot) => {
            slot.cell = new Cell(extend(cell, {
                x: slot.x,
                y: slot.y,
                position: {
                    x: slot.ax,
                    y: slot.ay,
                    z: 0
                }
            }));

            model.add(slot.cell.model);
            this.slots.push(slot);
        });
        return model;
    }

    createLabels() {
        const { table, labels } = this;
        table.eachSlot(slot => {
            labels.push({x: slot.x, y: slot.y});
        });
        
        
    }

    shuffleLabels() {
        
    }
}

export default Board;