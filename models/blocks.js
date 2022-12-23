import Collection from '$core/models/collection';
import { Object3D, Raycaster, Vector2 } from 'three';

import Cell from './cell';
import Block from './block';

import StatesMixin from '$core/mixins/states-mixin';
import HistoryMixin from '$core/mixins/history-mixin';
import { extend } from '$core/utils/object';
import { rand } from '$core/utils/math';

class Blocks extends Collection {
    constructor(options) {
        super(options);

        this.$listen({
            game: ['destroy'],
            level: ['start', 'end'],
            pointer: ['start', 'drag', 'stop', 'out']
        });

        this.ray = new Vector2;
        this.raycaster = new Raycaster;
        this.activeBlock = null;
        this.createItems();
        
        console.log(this.$store.levelOptions);
    }

    createItems() {
        const {def, types, table, path, raycaster, ray} = this;

        
        const cellsToFill = rand(
            Math.round(table.count / 2),
            table.count - Math.min(table.rows, table.columns)*2
        );

        for (let name in types) {
            const blockOptions = extend(def, types[name]);
            blockOptions.path = path;
            blockOptions.type = name;
            blockOptions.mixins = [StatesMixin, HistoryMixin];
            const block = new Block(blockOptions);
            if ('leader' === name) {
                this.add(block);
            }

        }

    }
    
    clearItems() {
        
    }

    pointer_start(point) {
        this.updateRay(point);
        const {camera, ray, raycaster} = this;
        
        raycaster.setFromCamera( ray, camera );
        
        let cross = null;
        this.each(block => {
            const crosses = raycaster.intersectObject(block.model);
            for (let i in crosses) {
                if (null === cross || (cross && (cross.distance < crosses[i].distance))) {
                    cross = crosses[i];
                    this.activeBlock = block;
                }
            }
        });
        
        if (this.activeBlock) {
            this.activeBlock.grab(cross);
        }
    }
    
    pointer_drag() {
        
    }

    pointer_stop(point) {
        if (this.activeBlock) {
            this.activeBlock.release();
            this.activeBlock = null;
        }
        
        this.updateRay(point);
    }

    updateRay(point) {
        this.ray.x = point.x;
        this.ray.y = point.y;
    }

}

export default Blocks;