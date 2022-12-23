import Game3D from '$lib/game/core/3d/game-main.js';
import StatesMixin from '$core/mixins/states-mixin.js';
import {
    PerspectiveCamera,
    DirectionalLight, Vector3, Clock, Color,
    HemisphereLight, HemisphereLightHelper
} from 'three';

import Box from '$blocks/models/box';
import Cell from '$blocks/models/cell';
import Pointer from '$blocks/system/pointer';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { extend } from '$core/utils/object';
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

    }

    renderer_created(renderer) {
        const camera = this.options.camera;
        const {settings} = this;
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
        const hemisphereLight = new HemisphereLight( 0xffffff, 0xff8800, 1);
        const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 5);
        this.scene.add(hemisphereLight,hemisphereLightHelper);
    }
    
    createBlocks() {
        
    }
    
    async build() {
        const {
            scene, camera, renderer,
            options, clock
        } = this;
        
        const animate = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

export default BlocksGame;

