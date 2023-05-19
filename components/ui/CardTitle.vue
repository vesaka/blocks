<template>
    <svg ref="ribbon" width="172.82707mm" height="51.23587mm" viewBox="0 0 172.82707 51.23587" version="1.1" id="svg5"
        inkscape:export-filename="bitmap.svg" inkscape:export-xdpi="96" inkscape:export-ydpi="96"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg" class="z-10">
        

        <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" inkscape:path-effect="#path-effect1656"
            class="UnoptimicedTransforms" transform="translate(-17.95204,-86.377607)">
            <path id="path222" :style="sides"
                d="m 17.952039,112.75669 c 11.2665,-3.30915 22.714459,-6.11105 34.289155,-8.30148 l 4.823873,25.45904 c -10.675549,2.03062 -21.302327,4.63177 -31.825614,7.69923 1.401052,-4.90523 2.900862,-9.81169 4.505816,-14.71399 -3.844545,-3.44084 -7.77831,-6.82251 -11.79323,-10.1428 z"
                sodipodi:nodetypes="cccccc"
                inkscape:original-d="M 19.91049,112.46089 H 53.975 v 25.90322 H 19.91049 l 8.466921,-12.95161 z" />
            <path :style="backSide"
                d="m 38.709976,120.89069 c 6.298356,2.84052 12.428426,5.8534 18.357506,9.03631 l -2.36508,-12.48222 c -5.353012,1.01556 -10.685857,2.16807 -15.992426,3.44591 z"
                id="path1089" inkscape:original-d="m 37.570833,125.67708 16.404166,12.7 v -12.7 H 37.570833" />
            <path id="path1140" :style="sides"
                d="m 190.77912,112.78477 c -11.2208,-3.84051 -22.70431,-6.87322 -34.33945,-9.10003 l -4.86679,25.43724 c 10.46123,1.99942 20.76941,4.72164 30.81343,8.16858 -1.0977,-4.94105 -2.35796,-9.88625 -3.77895,-14.82791 3.92619,-3.31963 7.98397,-6.54816 12.17176,-9.67788 z"
                sodipodi:nodetypes="cccccc"
                inkscape:original-d="m 188.73212,112.46089 h -34.06451 v 25.90322 h 34.06451 l -8.46693,-12.95161 z" />
            <path :style="backSide"
                d="m 169.78199,120.244 c -6.30424,2.72324 -12.37873,5.69633 -18.21155,8.89072 l 2.38612,-12.47154 c 5.31461,1.01648 10.59389,2.21001 15.82543,3.58082 z"
                id="path1142" inkscape:original-d="m 171.07177,125.67708 -16.40416,12.7 v -12.7 h 16.40416" />
            <path id="rect111" ref="banner" :style="front"
                d="m 32.641362,95.691019 c 23.477632,-5.65508 47.706896,-9.025805 72.261538,-9.300255 24.27193,-0.237904 48.58487,2.749871 72.10852,8.977641 l -6.62872,25.033825 c -21.22564,-5.62071 -43.24605,-8.31909 -65.23091,-8.10945 -22.308364,0.20118 -44.597717,3.33779 -66.441814,8.59791 z"
                inkscape:original-d="M 37.570833,99.773866 H 171.69986 V 125.67708 H 37.570833 Z">

            </path>
            <path id="p"
                d="m 32.641362,95.691019 c 23.477632,-5.65508 47.706896,-9.025805 72.261538,-9.300255 24.27193,-0.237904 48.58487,2.749871 72.10852,8.977641"
                fill="none"></path>
            <text class="font-lucky-guy" dx="42.5%" dy="35%">
                <textPath id="tp" ref="textPathEl" :fill="shades[5]" xlink:href="#p"
                text-anchor="middle" v-html="props.title"></textPath>
            </text>
        </g>
    </svg>
</template>
<script setup>
import { ref } from 'vue';
import { generateShades } from '$core/utils/colors';
const props = defineProps({
    fill: {
        type: String,
        default: '#ff0000'
    },
    title: {
        type: String,
        default: 'Title'
    }
});

const textPathEl = ref(null);

// const words = ['Home', 'Welcome', 'Conratulations', 'Online Store'];

// window.addEventListener('click', () => {
//     const word = words[Math.floor(Math.random()*words.length)];
//     textPathEl.value.innerHTML = word;
//     setTimeout(() => {
//         options.textDX = textDX();
//         }, 1000);
    
// }); 

const shades = generateShades(props.fill, 10);

const front = {
    display: 'inline',
    strokeWidth: 0.264583,
    fill: props.fill
};

const backSide = {
    display: 'inline',
    strokeWidth: 0.264583,
    fill: shades[6]
};

const sides = {
    display: 'inline',
    strokeWidth: 0.264583,
    fill: shades[1]
};


</script>
<style scoped>
    textPath {text-shadow: 0px 2px 1px rgba(255, 255, 255, 0.5), 0px -2px 1px rgba(0, 0, 0, 0.75);}
</style>