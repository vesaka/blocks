<template>
    <FireWorks>
        <Card class="items-center lg:w-3/4 xl:w-1/2" :title="t('levels.title')">
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
import { t } from '$core/utils/i18n';
import { useGameStore } from '$blocks/bootstrap/stores';
import { game } from '$blocks/config/options.json';
import { useRouter, useRoute } from 'vue-router';
import { PLAY_PATH } from '$blocks/bootstrap/paths';


const store = useGameStore();
const router = useRouter();
const route = useRoute();

const options = reactive({
    innerRadius: 35,
    outerRadius: 70,
    count: 3,
    beams: 5,
    score: 0.5

});

const btnLevel = {
    'px-4 py-2 m-2': true,
    'bg-coconut': true,
    'border-2 border-jasperorange rounded-2xl': true,
    'w-24 h-20 md:w-24 md:h-20 sm:w-auto': true,
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

</script>