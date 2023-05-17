<template>
    <div class="flex flex-col relative w-screen h-screen items-center justify-center">
        <canvas ref="sky" class="flex fixed inset-0 bg-darkblue"></canvas>
        <slot></slot>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
    PerspectiveCamera, Vector3, Scene, FogExp2,
    BufferGeometry, Texture, SRGBColorSpace,
    Float32BufferAttribute, PointsMaterial, Points,
    WebGLRenderer
} from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


const props = defineProps({
    position: {
        type: Object,
        default() {
            return new Vector3
        }
    },
    fov: {
        type: Number,
        default: 50,
    }
});


let camera, scene, renderer, stats, material;
let mouseX = 0, mouseY = 0;
let animationID;

const sky = ref(null);

const init = () => {
    if(!WebGL.isWebGLAvailable()) {
        return;
    }
    camera = new PerspectiveCamera();
    camera.position.z = 1000;
    scene = new Scene;
    scene.fog = new FogExp2(0x000000, 0.001);
    const geometry = new BufferGeometry;
    const vertices = [];

    for (let i = 0; i < 1000; i++) {

        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 2000 * Math.random() - 1000;

        vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    material = new PointsMaterial({
        size: 6,
        sizeAttenuation: true,
        color: 0xffffff,
        map: createCircleTexture('#ffffff', 32),
        transparent: true,
        //depthWrite: false
    });
    material.color.setHSL(1.0, 0.3, 0.7, SRGBColorSpace);

    const particles = new Points(geometry, material);
    scene.add(particles);

    try {

        
        renderer = new WebGLRenderer({
            canvas: sky.value,
            alpha: true,
            style: {
                background: '#f02f02'
            }
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0.2);
    } catch (err) {}
    document.body.style.touchAction = 'none';
    document.body.addEventListener('pointermove', onPointerMove);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onPointerMove(event) {

    if (event.isPrimary === false) return;

    mouseX = event.clientX * 0.05;
    mouseY = event.clientY * 0.05;

}

//

function animate() {
    animationID = requestAnimationFrame(animate);
    const time = Date.now() * 0.00005;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (- mouseY - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    //const h = (360 * (1.0 + time) % 360) / 360;
    //material.color.setHSL(h, 0.5, 0.5);

    renderer.render(scene, camera);

}

function createCircleTexture(color, size) {
    const matCanvas = document.createElement('canvas');
    matCanvas.width = matCanvas.height = size;
    const matContext = matCanvas.getContext('2d') || {};
    // create texture object from canvas.
    const texture = new Texture(matCanvas);
    // Draw a circle
    if (matContext.beginPath) {


        const center = size * 0.5;
        matContext.beginPath();
        matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false);
        matContext.closePath();
        matContext.fillStyle = color;
        matContext.fill();

        // need to set needsUpdate
        texture.needsUpdate = true;
    }
    // return a texture made from the canvas
    return texture;
}

onBeforeUnmount(() => {
    renderer.renderLists.dispose();
    cancelAnimationFrame(animationID);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('resize', onWindowResize);
});

onMounted(() => {
    init();
    if (renderer){
        animate();
    }
    
});

</script>