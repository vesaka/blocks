import Collection from '$core/models/collection';
import { Object3D, Raycaster, Vector2 } from 'three';

import Cell from '$blocks/models/cells/cell';
import Block from './block';

import StatesMixin from '$core/mixins/states-mixin';
import HistoryMixin from '$core/mixins/history-mixin';
import { extend, raw } from '$core/utils/object';
import { rand } from '$core/utils/math';

import MainBlock from './main-block';
import HorizontalBlock from './horizontal-block';
import VerticalBlock from './vertical-block';
import Grid from '$blocks/system/grid';

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
            pointer: ['start', 'drag', 'stop', 'out']
        });

        this.ray = new Vector2;
        this.raycaster = new Raycaster;
        this.activeBlock = null;
        this.placeItems();


    }

    createItems() {
        const {def, types, path} = this;


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
            }


        }

    }

    clearItems() {
        const {table} = this;

    }
    placeItems() {
        const grid = new Grid({path: this.path});
        
        const { blocks } = this.settings.puzzles.list[2];
        blocks.forEach(p => this.createItem(p));

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