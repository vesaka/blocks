import Model from '$core/3d/models/three-model';
import Matrix from '$core/2d/grids/matrix';
import { Object3D, Mesh, MeshPhongMaterial } from 'three';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import { Font } from 'three/addons/loaders/FontLoader.js';

import { extend } from '$core/utils/object';

import Board from './board';
import Blocks from './blocks/blocks.js';
import Goal from './goal';
import Cell from './cells/cell';

class Box extends Model {
    
    path = null;
    
    constructor(options) {
        super(options);
        
        this.$listen({
            level: ['loaded', 'start', 'end', 'close'],
            pointer: ['start', 'drag', 'stop', 'out'],
           // lucky: ['loaded'],
        });
        
        
        const { grid } = this.board;
        this.$set('table', new Matrix(extend(grid, {
            width: Cell.def.size * grid.columns,
            height: Cell.def.size * grid.rows,
        })));
        
        this.createBoard();
        this.createGoal();
        this.createBlocks();
        this.model.rotation.z = -Math.PI*0.26;
        
    }
    
    createModel() {
        return new Object3D;
    }
    
    createBoard() {
        const { options } = this;
        const board = new Board(options.models.board);
        
        this.setPosition(
                options.game.position.x,
                options.game.position.y,
                options.game.position.z
        );

        this.add(board);
        
        this.board = board;
    }
    
    createGoal() {
        const goal = new Goal(this.goal);
        const { table } = this;
        const axis = goal.getAxis();
        const slot = table.firstSlot(slot => {
            return slot.ay === goal.model.position.y;
        });
        
        this.path = slot[axis];
        this.add(goal);
        this.$set('goal', goal);
    }
    
    createBlocks() {
        this.blocks.path = this.path;
        const blocks = new Blocks(this.blocks);
        
        blocks.each(block => {
           this.model.add(block.model) 
        });
        
        this.$blocks = blocks;
    }
    
    clearBlocks() {
        this.$blocks.each(block => {
           this.model.remove(block.model);
           
        });
    }
    
    add(obj) {
        this.model.add(obj.model);
    }

    level_loaded(puzzle) {
        this.board.show(() => {
            this.$blocks.arrangeItems(puzzle)
        });
    }
    
    level_start() {
        
    }
    
    level_end() {
        
    }
    
    lucky_loaded(font) {

        const { text, size } = Cell.def;
        const { table, model, $store } = this;
        
        const halfSize = size / 2;
        table.eachSlot((slot, x, y) => {
            const fontOptions = extend(text, {});
            fontOptions.font = new Font(font);

            const textGeometry = new TextGeometry(`${x}${y}`, fontOptions);
            const material = new MeshPhongMaterial({
                color: 0xff8800,
                transparent: true,
                opacity: 0.25,
                //wireframe: true
            });
            
            const mesh = new Mesh(textGeometry, material);

            mesh.position.set(slot.ax - halfSize, slot.ay, -halfSize);
            mesh.rotation.x = Math.PI/2;
            model.add(mesh);
        });
    }
    levelOptions() {
        const { moves, cells, current } = this.$store.level;

        return {
            moves: moves.optimal + Math.floor(current * moves.byLevel),
            cells: Math.floor(this.table.count * cells.available) + Math.floor(current * cells.byLevel)
        };
    }
    
}

export default Box;