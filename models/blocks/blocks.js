import Collection from '$core/models/collection';
import { Raycaster, Vector2 } from 'three';


import StatesMixin from '$core/mixins/states-mixin';
import HistoryMixin from '$core/mixins/history-mixin';
import { extend, raw, unserialize } from '$core/utils/object';
import { rand } from '$core/utils/math';

import MainBlock from './main-block';
import HorizontalBlock from './horizontal-block';
import VerticalBlock from './vertical-block';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { boards } from '$blocks/config/puzzles.json';
import gsap from 'gsap';

const MAP = {
    main: MainBlock,
    leader: MainBlock,
    horizontal: HorizontalBlock,
    vertical: VerticalBlock
};

class Blocks extends Collection {
    constructor(options) {
        super(options);

        this.$listen({
            game: ['destroy'],
            level: ['start', 'end'],
            board: ['ready'],
            pointer: ['start', 'drag', 'stop', 'out']
        });

        this.ray = new Vector2;
        this.raycaster = new Raycaster;
        this.activeBlock = null;
        //this.placeItems();


    }

    createItems() {
        const {def, types, path} = this;

        const draggableBlocks = [];
        for (let name in types) {
            const blockClass = MAP[name];
            if (!blockClass) {
                continue;
            }
            const blockOptions = extend(def, types[name]);
            blockOptions.path = path;
            blockOptions.type = name;
            blockOptions.mixins = [StatesMixin, HistoryMixin];

            let count = blockOptions.count;
            if (Array.isArray(count)) {
                count = rand(count[0], count[1]);
            }


            for (let i = 0; i < count; i++) {
                const block = new blockClass(blockOptions);
                this.add(block);
                draggableBlocks.push(block.model);
            }


        }
        console.log(draggableBlocks);
    }

    placeItems() {
        const board = boards.find(({ solution }) => solution.length == 1);

        board.blocks.forEach(b => this.createItem(unserialize(b)));

    }

    arrangeItems(board) {
        const { box, screen } = this;

        board.blocks.forEach(item => { 
            const block = this.createItem(item);
            block.model.position.z += block.id * block.size.depth*5;
            box.model.add(block.model);
         });

         const tl = gsap.timeline({
            repeat: 0,
            duration: 1,
            onComplete: () => {
                this.$emit('level_start')
            }
         })

         this.each(item => {
            tl.to(item.model.position, {
                z: item.position.z,
                
            }, '>-0.45')
            
         });
    }

    createItem(options) {
        const {def, types} = this;
        const typeKeys = Object.keys(types);
        const name = 1 === options.id
                ? typeKeys[0]
                : (options.orientation === 'horizontal' ? typeKeys[1] : typeKeys[2])

        const blockClass = MAP[name];
        
        if (!blockClass) {
            return;
        }

        const typeOptions = extend(raw(types[name]), options);
        const opts = extend(def, typeOptions);
        opts.type = name;
        opts.position = { x: options.col, y: options.row};
        opts.count = options.size;
        opts.mixins = [StatesMixin, HistoryMixin];

        const block = new blockClass(opts);
        this.add(block);
        return block;
    }

    clearItems() {
        this.each(item => {
            this.model.remove(item.model);
        });

        this.clearItems();
    }

    pointer_start(point) {
        this.updateRay(point);
        const {camera, ray, raycaster} = this;

        raycaster.setFromCamera(ray, camera);

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