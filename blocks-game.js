import Game3D from '$core/3d/game-main.js';
import {
    PerspectiveCamera, Clock, HemisphereLight
} from 'three';

import Box from '$blocks/models/box';
import Cell from '$blocks/models/cells/cell';
import Pointer from '$blocks/system/pointer';
import Level from '$blocks/system/level';
//import Bot from '$blocks/system/bot';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { useOrbitControls } from '$core/3d/mixins/orbit-controls-mixin.js';
import HistoryMixin from '$core/mixins/history-mixin';

class BlocksGame extends Game3D {
    constructor(options = {}) {
        super(options);
        this.$listen({
            scene: ['created'],
            
        });

        this.states = [];
        
        Cell.setOptions(this.options.models.cell);
        this.$set('clock', new Clock);
        this.$set('box', new Box(this.options.models));
        this.add(this.box);
        
        this.loaders = {ttf: TTFLoader};
        
        this.createLights();
        
        const pointer = new Pointer({
            mixins: [HistoryMixin]
        });

        this.$set('$level', new Level({
            mixins: [HistoryMixin]
        }));

        // if (this.settings.bot) {
        //     this.$set('$bot', new Bot);
        // }

    }

    startLevel(level = 1) {
        this.$level.load(level);
    }

    renderer_created(renderer) {
        const camera = this.options.camera;
        this.$set('camera', new PerspectiveCamera(camera.fov, this.width / this.height, camera.near, camera.far));
        this.$emit('camera_created');
        this.camera.position.set(
                camera.position.x,
                camera.position.y,
                camera.position.z,
        );
        
        renderer.shadowMap.enabled = true;
        renderer.setClearColor( 0x111111, 1 );

        if (this.settings.controls) {
            useOrbitControls(this);
        } else {
            this.camera.lookAt(0, 250, -180);
        }

    }
    
    createLights() {
        const hemisphereLight = new HemisphereLight( 0x444444, 0x999999, 1);
        this.scene.add(hemisphereLight);
    }
    
    createBlocks() {
        
    }
    
    async build() {
        const {
            scene, camera, renderer
        } = this;
        
        const animate = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

export default BlocksGame;

