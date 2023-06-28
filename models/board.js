import Model from '$core/3d/models/three-model';
import { Object3D, Box3 } from 'three';
import Cell from './cells/board-cell';
import { extend } from '$core/utils/object';
import { TimelineMax  } from 'gsap/all ';

class Board extends Model {

    slots = [];
    labels = [];
    constructor(options) {
        super(options);
        this.box = new Box3().setFromObject(this.model);
        this.$listen({
            level: ['loaded', 'start', 'end']
        });
        this.createLabels();
        
    }

    createModel() {
        const model = new Object3D;
        const {table, cell, scale } = this;
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
        model.scale.set(scale.from, scale.from, scale.from);
        return model;
    }

    createLabels() {
        const { table, labels } = this;
        table.eachSlot(slot => {
            labels.push({x: slot.x, y: slot.y});
        });
        
        
    }

    show(onComplete) {
        const tl = new TimelineMax({
            repeat: 0,
            ease: 'elastic',
            onComplete
        });

        const { model, table, goal } = this;
        model.position.x = table.width * 0.5;
        model.position.y = table.height * 0.5;

        goal.model.position.x += goal.size.width*4; 

        tl.add('showBoard')
            .add('addBlocks')
            .to(model.scale, {
                x: 1, 
                y: 1,
                z: 1,
            }, 'showBoard')
            .to(model.position, {
                x: 0,
                y: 0
            }, 'showBoard')
            .to(goal.model.position, {
                x: goal.position.x
            }, '>addBlocks');
    }
}

export default Board;