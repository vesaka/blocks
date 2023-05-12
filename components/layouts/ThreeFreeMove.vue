<template>
    <div class="flex flex-col relative w-screen h-screen items-center justify-center">
        <canvas ref="screen" class="flex fixed inset-0 bg-darkblue"></canvas>
        <slot></slot>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
    PerspectiveCamera, Vector3, Scene, FogExp2, WebGLRenderer
} from 'three';

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
    },
    sensitivity: {
        type: Number,
        default: 0.05
    },
    init: {
        type: Function,
        default: () => ({})
    },
    animate: {
        type: Function,
        default: () => ({})
    }
});

let camera, scene, renderer, stats, material;
let mouseX = 0, mouseY = 0;
let animationID;

const screen = ref(null);

const init = () => {
    camera = new PerspectiveCamera();
    camera.position.z = 1000;
    scene = new Scene;
    scene.fog = new FogExp2(0x000000, 0.001);

    renderer = new WebGLRenderer({
        canvas: screen.value,
        alpha: true,
        style: {
            background: '#f02f02'
        }
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.2);

    props.init({renderer, camera, scene})

    document.body.style.touchAction = 'none';
    document.body.addEventListener('pointermove', onPointerMove);

    window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

const onPointerMove = ev => {
    if (ev.isPrimary === false) return;
    mouseX = ev.clientX * 0.05;
    mouseY = ev.clientY * 0.05;
}

function animate() {
    animationID = requestAnimationFrame(animate);
    const time = Date.now() * 0.00005;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (- mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    props.animate();
    renderer.render(scene, camera);

}

onBeforeUnmount(() => {
    renderer.renderLists.dispose();
    cancelAnimationFrame(animationID);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('resize', onWindowResize);
});

onMounted(() => {
    init();
    animate();
});

</script>