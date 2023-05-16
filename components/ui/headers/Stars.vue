<template>
    <svg ref="stars" :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg">
        <polygon v-for="(path, i) in paths" :points="path" :fill="fill(i)"
             stroke-width="3" stroke="chocolate" transform-origin="0.5, 0.5"/>
    </svg>
</template>
<script setup>
import { computed, ref } from 'vue';

const stars = ref(null);
const props = defineProps({
    count: {
        type: Number,
        default: 3,
    },
    score: {
        type: Number,
        default: 0
    },
    rounded: {
        type: Boolean,
        default: true
    },
    amplitude: {
        type: Number,
        default: 0
    },
    innerRadius: {
        type: Number,
        default: 5
    },
    outerRadius: {
        type: Number,
        default: 10
    },
    beams: {
        type: Number,
        default: 5
    },
    offset: {
        type: Number,
        default: 2
    }
});

const fill = (i) => {
    return (i / props.count) < props.score ? "gold" : "darkgoldenrod";
};

const maxRadius = computed(() => {
    return Math.max(props.innerRadius, props.outerRadius);
});

const d = computed(() => {
    return maxRadius.value * 2;
});

const width = computed(() => {
    return props.count * d.value + props.offset * (props.count - 1);
});

const height = computed(() => {
    return d.value + maxRadius.value*0.5;
});

const paths = computed(() => {
    const polygons = [];
    const segments = props.beams * 2;
    const theta = Math.PI / props.beams;
    const startTheta = -Math.PI / segments;

    for (let n = 0; n < props.count; n++) {
        const path = [];
        const cx = maxRadius.value + d.value*n + props.offset;
        const cy = d.value - maxRadius.value*(Math.sin(Math.PI * (cx / width.value)))
        for(let i = 0; i < segments; i++) {
            const radius = 0 === (i % 2) ? props.outerRadius : props.innerRadius;
            const x = Math.cos(startTheta + theta*i) * radius + cx;
            const y = Math.sin(startTheta + theta*i) * radius + cy;
            path.push(`${x},${y}`);
        }

        polygons.push(path.join(' '));
    }

    return polygons;
});


</script>