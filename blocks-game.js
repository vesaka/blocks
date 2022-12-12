import Game3D from '$lib/game/core/3d/game-main.js';
import StatesMixin from '$core/mixins/states-mixin.js';
import {
    PerspectiveCamera, HemisphereLight,
    DirectionalLight, Vector3, Clock
} from 'three';
import { useOrbitControls } from '$core/3d/mixins/orbit-controls-mixin.js';
class BlocksGame extends Game3D {
    constructor(options = {}) {
        super(options);

        this.states = [];
    }

    renderer_created(renderer) {
        const camera = this.options.camera;
        const {settings} = this;
        console.log(this.width, this.height);
        this.$set('camera', new PerspectiveCamera(camera.fov, this.width / this.height, camera.near, camera.far));
        this.$emit('camera_created');
        this.camera.position.set(
                camera.position.x,
                camera.position.y,
                camera.position.z,
        );
        
        renderer.shadowMap.enabled = true;
        renderer.setClearColor( 0xffaa33, 1 );
        useOrbitControls(this);

    }
}

export default BlocksGame;

