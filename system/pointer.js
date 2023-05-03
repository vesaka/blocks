import Container from '$core/container';
import { 
    Raycaster, Plane, PlaneHelper,
    Vector3, Vector2, MathUtils, Line3, ArrowHelper,
     Line, LineBasicMaterial, BufferGeometry,
     PlaneGeometry, MeshBasicMaterial, Mesh, LineSegments
} from 'three';
import Cell from '$blocks/models/cells/cell';
import GUI from 'lil-gui';

class Pointer extends Container {
    drag = false;
    plane = null;
    constructor(options) {
        super(options);
        
        this.$listen({
            game: ['destroy'],
            level: ['start', 'end'],
            block: ['grabed'],
            window: ['resize']
        });
        
        
        this.view = this.getCameraView();
        this.pointer = new Vector2;
        this.target = new Vector3;
        this.raycaster = new Raycaster;
        
        this.constant = 0;
        this.plane = new Plane( new Vector3, 0 );
        
        const gui = new GUI;
        // gui.add(this.plane.normal, 'x', -1, 1, 0.01).name('planeX');
        // gui.add(this.plane.normal, 'y', -1, 1, 0.01).name('planeY');
        // gui.add(this.plane.normal, 'z', -1, 1, 0.01).name('planeZ');
        // gui.add(this.camera.position, 'x', -400, 400, 10).name('cameraX');
        // gui.add(this.camera.position, 'y', -400, 400, 10).name('cameraY');
        // gui.add(this.camera.position, 'z', -400, 400, 10).name('cameraZ');
        // gui.add(this.camera.rotation, 'x', -Math.PI, Math.PI, 0.01).name('cameraRotateX');
        // gui.add(this.camera.rotation, 'y', -Math.PI, Math.PI, 0.01).name('cameraRotateY');
        // gui.add(this.camera.rotation, 'z', -Math.PI, Math.PI, 0.01).name('cameraRotateZ');
        //gui.add(this.plane, 'constant', -800, 800, 10).name('constant');
        this.helper = new PlaneHelper( this.plane, 1000, 0xffbbff );
        this.arrowHelper = null;
        
        this.scene.add(this.helper);
        this.toogleEvents();
        this.axis = new Line3;


        this.arrowHelper = null;
        this.createAxises();
        

        //this.box.model.add(this.scanner)
        //console.log(this.line.geometry)
       // console.log(this.line);
    }


    createAxises() {
        const { table, box } = this;
        this.rows = [];
        this.cols = [];
        const hs = Cell.halfSize;
        const d = Cell.def.depth*2;
        const size = hs*2;
        for (let i = 0; i < table.rows; i++) {
            this.rows.push(new Line3(
                box.model.localToWorld(new Vector3(-table.width, (i * size) + hs, d)),
                box.model.localToWorld(new Vector3(table.width*2, (i * size) + hs, d)))
            );
        }

        for (let i = 0; i < table.columns; i++) {
            this.cols.push(new Line3(
                box.model.localToWorld(new Vector3((i * size) + hs, -table.height, d)),
                box.model.localToWorld(new Vector3((i * size) + hs, table.height*2, d))));
        }

    }

    getRowAxis(i, offset) {
        const axis = this.rows[i].clone();
        axis.start.y -= Cell.def.size - offset.y;
        axis.end.y -= Cell.def.size - offset.y;
        return axis;
    }

    getColAxis(i, offset) {
        const axis = this.cols[i].clone();
        axis.start.x -= Cell.def.size - offset.x;
        axis.end.x -= Cell.def.size - offset.x;
        return axis;
    }

    createLine() {
        const geometry = new BufferGeometry().setFromPoints( [
            new Vector3(0, 0, 0), new Vector3(0, 500, 0)
        ] );

        const line = new Line(geometry, new LineBasicMaterial({ color: 0xff0000 }));
        return line;
    }
    
    
    level_start() {
        const { renderer } = this;
    }
    
    level_end() {
        const { renderer } = this;
    }
    
    game_destroy() {
        this.toogleEvents(false);
    }
    
    
    clearGameEvents() {
        
    }
    
    toogleEvents(bind = true) {
        const action = `${bind ? 'add' : 'remove'}EventListener`; 
        window[action]('mousedown', this.onStart.bind(this));
        window[action]('touchstart', this.onStart.bind(this));
        
        window[action]('mousemove', this.onMove.bind(this));
        window[action]('touchmove', this.onMove.bind(this));
        
        window[action]('mouseup', this.onEnd.bind(this));
        window[action]('touchend', this.onEnd.bind(this));
        
        window[action]('mouseout', this.onOut.bind(this));
    }
    
    onStart(ev) {
        this.updatePointer(ev);
        this.updatePlane();
        this.plane.intersectLine(this.axis, this.target);
        this.$emit('pointer_start', this.pointer);
        this.addEntry({
            event: 'start',
            at: this.target
        });
    }
    
    onMove(ev) {
        if (this.drag) {
            this.updatePointer(ev);
            this.updatePlane();
            const intersection = this.plane.intersectLine(this.axis, this.target);
            if (intersection) {
                this.box.model.worldToLocal(this.target);
                this.$emit('pointer_drag', this.target);
            }
        }
    }
    
    onEnd(ev) {
        this.drag = false;
        this.updatePointer(ev);
        this.updatePlane();
        this.$emit('pointer_stop', this.pointer);
        
        this.addEntry({
            event: 'release',
            at: this.target
        });
    }
    
    onOut(ev) {
        if (this.drag) {
            //this.onMove(ev);
        }
    }
    
    updatePointer(ev) {
        this.pointer.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = -( ev.clientY / window.innerHeight ) * 2 + 1;
        return this;
    }
    
    updatePlane() {
        const { raycaster, pointer, plane, direction } = this;
        raycaster.setFromCamera(pointer, this.camera);
        plane.constant = (pointer[direction] * this.constant);
    }
    
    block_grabed(block) {
        const { plane, view, table, axis, pointer } = this;
        const { at } = block;
        // at.x *= pointer.x;
        // at.y *= pointer.y;
        this.direction = block.getDirection();
        this.drag = true;

        if (this.arrowHelper) {
            this.scene.remove(this.arrowHelper);
        }

        //plane.normal.copy(block.normal);
        if ('x' === this.direction) {
            plane.normal.set(1, 0, 0);
            this.constant = -(view.width) * 0.16;
            axis.copy(this.getRowAxis(block.row, at));
            //axis.copy(this.rows[block.row])
        } else if ('y' === this.direction) {
            plane.normal.set(0, 0.64, 1);
            this.constant = -(view.height) * 0.25;
            axis.copy(this.getColAxis(block.col, at));
            //axis.copy(this.cols[block.col]);


        }

        this.arrowHelper = new ArrowHelper(block.normal, axis.end, table.width*4);
        this.scene.add(this.arrowHelper)
        this.updatePlane();
        
        this.addEntry({
            event: 'grab',
            at: block.at
        });
        
    }
    
    getCameraView() {
        const { camera, options } = this;
        
        const fov = MathUtils.degToRad( camera.fov );
        const height = Math.round(2 * Math.tan( fov / 2 ) * (options.camera.far / 2));
        const width = Math.round(height * camera.aspect);
        let widthRatio = 0.5, heightRatio = 0.5;
        if (width >= height) {
            heightRatio *= (height / width);
        } else {
            widthRatio *= (width / height);
        }

        return { width, height, widthRatio, heightRatio };
    }
       
    window_resize() {
        this.view = this.getCameraView();
        
    }
}

export default Pointer;