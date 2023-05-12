import Game3D from '$lib/game/core/3d/game-main.js';
import {
    PerspectiveCamera, Points, Vector3,
    PointsMaterial, MathUtils, Color, BufferGeometry, BufferAttribute
} from 'three';

import { useOrbitControls } from '$core/3d/mixins/orbit-controls-mixin.js';
import { getSize } from '$core/utils/window';
import { Point } from 'pixi.js';

class FireworksRenderer extends Game3D {
    constructor(options = {}) {
        super(options);
        this.loaders = {};
        this.fireworks = [];
        this.done = false;
        this.dest = [];
        this.colors = [];
        this.geometry = null;
        this.points = null;

        this.material = new PointsMaterial(this.options.material);
    }

    renderer_created(renderer) {
        const camera = this.options.camera;
        const size = getSize();
        this.camera = new PerspectiveCamera(camera.fov, size.ratio, camera.near, camera.far);
        this.$emit('camera_created');
        this.camera.position.set(
            camera.position.x,
            camera.position.y,
            camera.position.z,
        );

        this.camera.lookAt(this.scene.position);

        renderer.setClearColor(0x111111, 1);
useOrbitControls(this);
        if (this.settings.controls) {
            //
        } else {
            //this.camera.lookAt(0, 250, -180);
        }

    }

    createFirework() {
        const { options, scene } = this;
        const MAX_COUNT = 100;
        return {
            done: false,
            dest: [],
            colors: [],
            geometry: null,
            points: null,
            material: new PointsMaterial(options.material),
            reset() {
                scene.remove(this.points);
                this.dest = [];
                this.colors = [];
                this.geometry = null;
                this.points = null;
            },
            launch() {
                const size = getSize();
                const x = MathUtils.randInt(-size.width, size.width);
                const y = MathUtils.randInt(-100, 800);
                const z = MathUtils.randInt(-1000, -3000);

                const from = new Vector3(x, -800, z);
                const to = new Vector3(x, y, z);

                const color = new Color;
                color.setHSL(new MathUtils.randFloat(0.1, 0.9), 1, 0.9);
                this.geometry = new BufferGeometry;
                const vertices = new Float32Array(MAX_COUNT * 3);
                this.geometry.setAttribute('vertices', new BufferAttribute(vertices, 3));


                this.points = new Points(this.geometry, this.material);                
                this.geometry.colors = this.colors;
                this.addVertex(from);
                this.dest.push(to);
                this.colors.push(color);
                //console.log(this.points)
                scene.add(this.points);
                return this;
            },
            addVertex(vector, i = 0) {
                const vertices = this.geometry.getAttribute('vertices');
                //console.log(this.geometry.attributes);
                vertices.setXYZ(i, vector.x, vector.y, vector.y);
            },
            explode(vector) {
                this.dest = [];
                this.colors = [];
                this.geometry = new BufferGeometry;
                const vertices = new Float32Array(MAX_COUNT * 3);
                this.geometry.setAttribute('vertices', new BufferAttribute(vertices, 3));
                this.points = new Points(this.geometry, this.material);

                for (var i = 0; i < MAX_COUNT; i++) {
                    var color = new Color;
                    color.setHSL(MathUtils.randFloat(0.1, 0.9), 1, 0.5);
                    this.colors.push(color);

                    var from = new Vector3(
                        MathUtils.randInt(vector.x - 10, vector.x + 10),
                        MathUtils.randInt(vector.y - 10, vector.y + 10),
                        MathUtils.randInt(vector.z - 10, vector.z + 10)
                    );
                    var to = new Vector3(
                        MathUtils.randInt(vector.x - 1000, vector.x + 1000),
                        MathUtils.randInt(vector.y - 1000, vector.y + 1000),
                        MathUtils.randInt(vector.z - 1000, vector.z + 1000)
                    );

                    
                    this.addVertex(from, this.dest.length);
                    //this.geometry.vertices.push(from);
                    this.dest.push(to);
                }

                
                this.geometry.colors = this.colors;
                scene.add(this.points);
            },
            update() {
                if (!this.points || !this.geometry) {
                    return;
                }
                const vertices = this.geometry.getAttribute('vertices');
                const total = this.dest.length;

                for (let i = 0; i < total; i++) {
                    const x = vertices.getX(i);
                    const y = vertices.getY(i);
                    const z = vertices.getZ(i);
                    
                    vertices.setXYZ(i, x + (this.dest[i].x - x) / 20, y + (this.dest[i].y - y) / 20, z + (this.dest[i].z - z) / 20);
                    vertices.needsUpdate = true;
                }
                // watch first particle for explosion 
                if (total === 1) {
                    if (Math.ceil(vertices.getY(0)) > (this.dest[0].y - 20)) {
                        this.explode({
                            x: vertices.getX(0),
                            y: vertices.getY(0),
                            z: vertices.getZ(0),
                        });
                        return;
                    }
                }
                // fade out exploded particles 
                if (total > 1) {
                    this.material.opacity -= 0.015;
                    this.material.colorsNeedUpdate = true;
                }
                // remove, reset and stop animating 
                if (this.material.opacity <= 0) {
                    this.reset();
                    this.done = true;
                    return;
                }
            }
        };
    }

    async build() {
        const {
            scene, camera, renderer, fireworks, to
        } = this;

        const animate = () => {
            renderer.render(scene, camera);
            if (MathUtils.randInt(1, 20) === 10) {
                //console.log('add fireworks');
                fireworks.push(this.createFirework().launch());
            }

            for (var i = 0; i < fireworks.length; i++) {
                if (fireworks[i].done) {
                    fireworks.splice(i, 1);
                    continue;
                }
                fireworks[i].update();
                
            }
// console.log({len: fireworks.length});
            camera.position.x += (to.x - camera.position.x) / 40;
            camera.position.y += (to.y - camera.position.y) / 40;
            camera.position.z += (to.z - camera.position.z) / 40;
            requestAnimationFrame(animate);
        };


        animate();
    }
}

export default FireworksRenderer;