import Container from '$core/container';
import { 
    Raycaster, Plane, PlaneHelper,
    Vector3, Vector2, MathUtils, Line3
} from 'three';
import dat from 'dat.gui';

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
        
        
        this.helper = new PlaneHelper( this.plane, 1000, 0xffbbff );

        this.toogleEvents();
        this.axis = new Line3;
        
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
    }
    
    onMove(ev) {
        if (this.drag) {
            this.updatePointer(ev);
            this.updatePlane();
            this.plane.intersectLine(this.axis, this.target);
            
            this.$emit('pointer_drag', this.target);
            this.addEntry({
                event: 'drag',
                at: this.target
            });
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
        //console.log(ev);
    }
    
    updatePointer(ev) {
        this.pointer.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = -( ev.clientY / window.innerHeight ) * 2 + 1;
    }
    
    updatePlane() {
        const { raycaster, pointer } = this;
        raycaster.setFromCamera(pointer, this.camera);
        this.plane.constant = pointer[this.direction] * this.constant;
    }
    
    block_grabed(block) {
        const { plane, pointer, view, table, axis } = this;
        const { at, model: { position } } = block;
        this.direction = block.getDirection();
        this.drag = true;

        if ('y' === this.direction) {
            plane.normal.set(0, 0.66, 1);
            this.constant = -view.height / 2;
            
            axis.start.set(position.x + at.x, -table.height, position.z);
            axis.end.set(position.x, table.height*2, position.z);
        } else if ('x' === this.direction){
            plane.normal.set(1, 0, 0);
            this.constant = view.width / 2;
            
            axis.start.set(-table.width, position.y + at.y, position.z);
            axis.end.set(table.width*2, position.y, position.z);
        }

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
        
        return { width, height };
    }
       
    window_resize() {
        this.view = this.getCameraView();
        
    }
}

export default Pointer;