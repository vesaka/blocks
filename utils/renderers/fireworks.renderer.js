import Game3D from '$lib/game/core/3d/game-main.js';
import {
    PerspectiveCamera, Points, Vector3,
    PointsMaterial, MathUtils, Color, BufferGeometry, BufferAttribute,
    HemisphereLight, SRGBColorSpace, Mesh, BoxGeometry, MeshBasicMaterial,
    FogExp2, Float32BufferAttribute
} from 'three';

import { useOrbitControls } from '$core/3d/mixins/orbit-controls-mixin.js';
import { getSize } from '$core/utils/window';
import { raw } from '$core/utils/object';

const oneColor = new Color;
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

        const light = new HemisphereLight(0xffffff, 0x080820, 0.8);
        this.scene.add(light);
        this.material = new PointsMaterial(this.options.material);

        this.scene.fog = new FogExp2(0x000000, 0.0008);
    }

    renderer_created(renderer) {
        const camera = this.options.camera;
        const size = getSize();
        this.camera = new PerspectiveCamera(camera.fov, size.ratio, camera.near, camera.far);
        this.$emit('camera_created');
        this.camera.lookAt(this.scene.position);

        renderer.setClearColor(0x000000, 0.8);
        useOrbitControls(this);

    }

    createFirework() {
        const { options } = this;
        const { maxActive, count } = options;

        const material = new PointsMaterial(raw(options.material));
        const geometry = new BufferGeometry();

        const positions = [];
        const goals = [];
        const colors = [];

        const color = new Color();
        //const from = 
        const size = getSize();
        const x = MathUtils.randInt(-size.width, size.width);
        const y = MathUtils.randInt(100, 800);
        const z = MathUtils.randInt(-100, -800);
        for (let i = 0; i < count; i++) {
            positions.push(x, -800, z);
            goals.push(x, y, z);
            color.setHSL(MathUtils.randFloat(0.1, 0.9), 1, 0.9);
            //color.setRGB(MathUtils.randInt(16, 239), 255, 239, SRGBColorSpace);
            colors.push(color.r, color.g, color.b);

        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('goal', new Float32BufferAttribute(goals, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        const points = new Points(geometry, material);
        points.userData.faded = false;
        points.userData.state = 'rising';
        this.scene.add(points);
        return points;
    }

    update(firework, i) {
        const position = firework.geometry.getAttribute('position');
        const goal = firework.geometry.getAttribute('goal');
        const color = firework.geometry.getAttribute('color');

        const x = position.getX(0);
        const y = position.getY(0);
        const z = position.getZ(0);

        if ('rising' === firework.userData.state) {
            this.updatePosition(0, position, goal, color);
            

            if (position.getY(0) > (goal.getY(0) - 20)) {
                for (let i = 0; i < position.count; i++) {
                    position.setX(i, MathUtils.randInt(x - 10, x + 10));
                    position.setY(i, MathUtils.randInt(y - 10, y + 10));
                    position.setZ(i, MathUtils.randInt(z - 10, z + 10));
    
                    goal.setX(i, MathUtils.randInt(x - 1000, x + 1000));
                    goal.setY(i, MathUtils.randInt(y - 1000, y + 1000));
                    goal.setZ(i, MathUtils.randInt(z - 1000, z + 1000));

                    oneColor.setHSL(MathUtils.randFloat( 0.1, 0.9 ), 1, 0.5 );
                    color.setXYZ(i, oneColor.r, oneColor.g, oneColor.b);
                    color.needsUpdate = true;
                }
                position.needsUpdate = true;
                firework.userData.state = 'exploded';
            }
        } else if ('exploded' === firework.userData.state) {
            for (let i = 0; i < position.count; i++) {
                this.updatePosition(i, position, goal, color);
            }

            firework.material.opacity -= 0.015;
            if (firework.material.opacity <= 0) {
                this.clear(firework);
                this.fireworks.splice(i, 1);

            }
        }
    }

    updatePosition(i, point, goal, color) {
        const x = point.getX(i);
        const y = point.getY(i);
        const z = point.getZ(i);

        point.setXYZ(i, x + (goal.getX(i) - x) / 20, y + (goal.getY(i) - y) / 20, z + (goal.getZ(i) - z) / 20);
        oneColor.setHSL(MathUtils.randFloat( 0.1, 0.9 ), 1, 0.5 );
        color.setXYZ(i, oneColor.r, oneColor.g, oneColor.b);
        point.needsUpdate = true;
        color.needsUpdate = true;
    }

    clear(firework) {
        this.scene.remove(firework);
        firework.geometry.dispose();
        firework.material.dispose();
    }

    async build() {
        const {
            scene, camera, renderer, fireworks, to,
            options: { maxActive }
        } = this;

        camera.position.set(0, 0, 1000);
        camera.rotation.set(0, 0, 0);
        const animate = () => {

            if ((fireworks.length < maxActive) && MathUtils.randInt(1, 20) === 10) {
                fireworks.push(this.createFirework());
            }

            for (var i = 0; i < fireworks.length; i++) {

                if ('faded' === fireworks[i].userData.state) {
                    fireworks.splice(i, 1);
                    this.clear(fireworks[i]);

                    continue;
                }

                this.update(fireworks[i], i);

            }
            // console.log({len: fireworks.length});
            // camera.position.x += (to.x - camera.position.x) / 40;
            // camera.position.y += (to.y - camera.position.y) / 40;
            // camera.position.z += (to.z - camera.position.z) / 40;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };


        animate();
    }
}

export default FireworksRenderer;