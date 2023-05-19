<template>
    <FireWorks>
        <Card class="items-center w-4/5 lg:w-2/3 lg:min-h-2/3" :title="t('levels.title')">
            <template #header>
                <Stars v-if="route.meta.justPlayed" class="absolute -top-24 z-10" :count="options.count"
                    :inner-radius="options.innerRadius" :outer-radius="options.outerRadius" :beams="options.beams"
                    :score="store.level.stars / game.level.stars" />
            </template>
            <h2 class="flex mx-auto text-4xl font-lucky-guy text-coconut" v-if="route.meta.justPlayed"
                v-html="t('levels.result.good-job', 'Good Job!')"></h2>
            <div class="grid grid-cols-3 gap-1 md:grid-cols-5 md:gap-0 justify-center items-center content-center mx-auto">
                <button v-for="level in levels" :class="btnLevel" @click="startLevel(level.current)">
                    <span class="md:inline-flex text-white font-lucky-guy text-md text-2xl md:text-lg">
                        <span v-html="t('levels.level')" class="mr-1 hidden md:inline-block"></span>
                        <span v-html="level.current" class="text-md"></span>
                    </span>

                    <Stars :count="game.level.stars" :inner-radius="7" :outer-radius="12"
                        :score="level.stars / game.level.stars" />
                </button>

            </div>
        </Card>
    </FireWorks>
</template>
<script setup>
import { reactive, computed } from 'vue';
import FireWorks from '$blocks/components/layouts/FireWorks.vue';
import Card from '$blocks/components/ui/Card.vue';
import Stars from '$blocks/components/ui/headers/Stars.vue';
import GUI from 'lil-gui';
import { t } from '$core/utils/i18n';
import { useGameStore } from '$blocks/bootstrap/stores';
import { game } from '$blocks/config/options.json';
import { useRouter, useRoute } from 'vue-router';
import { PLAY_PATH } from '$blocks/bootstrap/paths';

const store = useGameStore();
const router = useRouter();
const route = useRoute();

console.log(route.meta);
// const gui = new GUI;
// const options = reactive({
//     innerRadius: 35,
//     outerRadius: 70,
//     count: 3,
//     beams: 5,
//     score: 0.5

// });

// gui.add(options, 'innerRadius', 5, 100, 1);
// gui.add(options, 'outerRadius', 5, 100, 1);
// gui.add(options, 'count', 3, 10, 1);
// gui.add(options, 'beams', 2, 32, 1);
// gui.add(options, 'score', 0, 1, 0.01);

const btnLevel = {
    'px-4 py-2 m-2': true,
    'bg-coconut': true,
    'border-2 border-jasperorange rounded-2xl': true,
    'w-16 h-16 md:w-24 md:h-20 md:h-24 sm:w-auto': true,
    'flex flex-col items-center content-center justify-center': true,
    'transition duration-300 hover:scale-110': true
};

const startLevel = (i) => {
    store.level.current = i;
    router.push(PLAY_PATH)
}

const levels = computed(() => {
    const list = [];

    for (let i = 1; i <= game.level.max; i++) {
        const lvl = store.myLevels.find(l => l.current === i);
        if (lvl) {
            list.push(lvl);
        } else {
            list.push({
                current: i,
                stars: 0
            });
        }
    }


    return list;
});

// beforeRouteEnter(to, from) {
//     console.log(to, from)
// };

</script>